const AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
var moment = require("moment");
const s3Operation = require("../utility/aws_s3_service.js");
const lambdaGateway = require("../utility/lambda_gateway.js");

const integration = "garmin";

exports.lambdaHandler = async (context, req) => {
  let body = lambdaGateway.inputGateway(req, context);
  // body = JSON.parse(body);
  const year = moment().format("YYYY");
  const month = moment().format("MM");
  const day = moment().format("DD");
  const prefix = "/" + body.type + "/" + year + "/" + month + "/" + day;
  const s3Promises = [];
  for (let i = 0; i < body.data.length; i++) {
    const key = body.data[i].userId + "_" + body.data[i].summaryId;
    metadata = createMetadata(
      body.type,
      body.data[i],
      moment().format("YYYY-MM-DD")
    );
    s3Promises.push(
      s3Operation.setPayload(
        key,
        "health-integration-garmin" + prefix,
        JSON.stringify(body.data[i]),
        metadata
      )
    );
  }
  await Promise.all(s3Promises).then((pathValueLocation) => {
    pathValueLocation.forEach((value, index) => {
      body.data[index].landingZonePath = value;
    });
  });

  return lambdaGateway.outputGateway(body);
};

function createMetadata(type, body, date) {
  return `Integration=${integration}&Type=${type}&Date=${date}&User=${body.userId}&Status=Unprocessed`;
}
