var AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
var moment = require("moment");
const utils = require("../utility/utils.js");
const lambdaGateway = require("../utility/lambda_gateway.js");

exports.lambdaHandler = async (context, req) => {
  // let body = lambdaGateway.inputGateway(req, context);
  let body = req;
  // normalize keys
  let transformedData;
  transformedData = utils.normalizeKeys(body);
  transformedData = utils.keepField(
    transformedData,
    utils.garminHeaderParams + utils.garminDailiesAllowedParams
  );
  body = transformedData
  return lambdaGateway.outputGateway(body);
};
