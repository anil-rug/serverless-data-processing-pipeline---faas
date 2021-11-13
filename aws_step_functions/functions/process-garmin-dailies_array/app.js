/**
 * Lambda function to process Garmin Activity data.
 *
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 *
 */
var AWS = require("aws-sdk");
const utils = require("/opt/utility/utils.js");
const lambdaGateway = require("/opt/utility/lambda_gateway.js");

exports.lambdaHandler = async (event, context, callback) => {
  let body = lambdaGateway.inputGateway(event, context);
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
  lambdaGateway.outputGateway(JSON.stringify(body), callback);
};
