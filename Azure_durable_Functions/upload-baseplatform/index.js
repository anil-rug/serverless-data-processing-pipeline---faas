var AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
const utils = require("../utility/utils.js");
const lambdaGateway = require("../utility/lambda_gateway.js");
const s3Operation = require("../utility/aws_s3_service.js");
const BackendService = require("./backend.service");
const AuthService = require("./auth.service");
const dynamoDBService = require("../utility/aws_dynamodb_service.js");

exports.lambdaHandler = async (context, req) => {
  let body = lambdaGateway.inputGateway(req, context);
  // body = JSON.parse(body);
  let backend_service = new BackendService();
  let auth_service = new AuthService();
  let key;
  if (body.isBinary) {
    key = {
      UserId: {
        S: Array.isArray(body.data) ? body.data[0].userId : body.data.userId,
      },
    };
  } else {
    key = {
      UserId: {
        S: Array.isArray(body.data) ? body.data[0].user_id : body.data.user_id,
      },
    };
  }
  const user = await dynamoDBService.getPayload(key,"HealthIntegrationUserInfo");
  let token = await auth_service.login(
    parseInt(Object.values(user.Item.uuid)[0])
  );
  let consolidatedData = [];
  if (body.isBinary) {
    if (Array.isArray(body.data)) {
      for (i = 0; i < body.data.length; i++) {
        let tempData = await s3Operation.getPayload(
          body.data[i].fitDataKey,
          "health-integration-garmin"
        );
        consolidatedData.push(JSON.parse(tempData));
      }
    } else {
      let tempData = await s3Operation.getPayload(
        body.data.fitDataKey,
        "health-integration-garmin"
      );
      consolidatedData.push(JSON.parse(tempData));
    }
  } else {
    Array.isArray(body.data) ? consolidatedData.push(...body.data) : consolidatedData.push(body.data);
  }
  wrappedData = utils.wrapDataToSendBaseplatform(
    "garmin",
    consolidatedData,
    body.isBinary
  );
  await backend_service.sendData(wrappedData, token.access_token);
  body.status = "Record Sent to Base Platform";
  return lambdaGateway.outputGateway(body);
};
