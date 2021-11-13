var AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
const utils = require("../utility/utils.js");
const lambdaGateway = require("../utility/lambda_gateway.js");

exports.lambdaHandler = async (context, req) => {
  let body = lambdaGateway.inputGateway(req, context);
  // body = JSON.parse(body);
  // normalize keys
  let transformedData = [];
  for (let i = 0; i < body.data.length; i++) {
    transformedData[i] = utils.normalizeKeys(body.data[i]);
    transformedData[i] = utils.keepField(
      transformedData[i],
      utils.garminHeaderParams + utils.garminDailiesAllowedParams
    );
  }
  body.data = transformedData
  return lambdaGateway.outputGateway(body);
};
