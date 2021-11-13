let _ = require("lodash");
const AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
const lambdaGateway = require("../utility/lambda_gateway.js");

const config = {
  region: 'us-east-1'
  };

const tableName = 'HealthIntegrationProcessed';
const docClient = new AWS.DynamoDB.DocumentClient(config);
const integration = 'garmin';

exports.lambdaHandler = async (context, req) => {
  let body = lambdaGateway.inputGateway(req, context);

  var splitRecordsBy25 = _.chunk(body.data, 25);
  for (let i = 0; i < splitRecordsBy25.length; i++) {
    var putItems = [];
    putItems = wrapRecord(body.type, splitRecordsBy25[i]);
    var tableItems = {};
    tableItems[tableName] = putItems;
    await writeItems(tableItems, 0, context, i);
  }

  lambdaGateway.outputGateway({'Status': 'Processed'});
};

function wrapRecord(type, body) {
  var items = [];
  body.forEach(function (record) {
    items.push({
      PutRequest: {
        Item: {
          Id: integration + record.summary_id,
          Type: type,
          UserId: record.user_id,
          Timestamp: Date.now(),
          Record: record,
        },
      },
    });
  });
  return items;
}

async function writeItems(items, retries, context, index) {
  try {
    console.log("Processing Batch ", index + 1);
    const response = await docClient
      .batchWrite({ RequestItems: items })
      .promise();

    if (Object.keys(response.UnprocessedItems).length) {
      console.log("Unprocessed items remain, retrying.");
      var delay = Math.min(
        Math.pow(2, retries) * 100,
        context.getRemainingTimeInMillis() - 200
      );
      setTimeout(function () {
        writeItems(response.UnprocessedItems, retries + 1);
      }, delay);
    } else {
      console.log("Processed Batch ", index + 1);
    }
  } catch (error) {
    console.log("DDB call failed: " + error, error.stack);
    return context.fail(error);
  }
}
