const AWSDynamo = require("aws-sdk");
var AWSXRay = require("aws-xray-sdk-core");
// Configure the context missing strategy to do nothing
AWSXRay.setContextMissingStrategy(() => {});
const paramsDynamo = {
        apiVersion: "2012-08-10",
        region: 'us-east-1',
      };
var dynamodb = AWSXRay.captureAWSClient(new AWSDynamo.DynamoDB(paramsDynamo));

exports.getPayload = function (key, tableName) {
  var params = {
    Key: key,
    TableName: tableName,
  };
  return dynamodb.getItem(params).promise();
};

exports.setPayload = async function (key, bucketName, body, tag = "") {};
