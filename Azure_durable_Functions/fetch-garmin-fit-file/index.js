
var AWS = require("aws-sdk");
AWS.config.loadFromPath("aws.json");
const oauth_v1_handler = require("../utility/oauth_v1_service.js");
const s3Operation = require("../utility/aws_s3_service.js");
const secretManagerClient = require("../utility/aws_secret_manager_service.js");
const lambdaGateway = require("../utility/lambda_gateway.js");
const utils = require("../utility/utils.js");

const consumer_key = 'e63d8f99-9a84-4728-8959-a31b612dbd7d'
const consumer_secret = '0QyAalhUKqYI4cF6fdGbxdl3IIBfbmXFyX2'

exports.lambdaHandler = async (context, req) => {
  let body = lambdaGateway.inputGateway(req, context);
  // body = JSON.parse(body);
  consolidatedFitData = [];

  secretName = body.data[0].userAccessToken;
  const tempSecret = await secretManagerClient.retrieveSecret(secretName);
  const secret = JSON.parse(tempSecret.SecretString);

  for (i = 0; i < body.data.length; i++) {
    const callBackURL = body.data[i].callbackURL;
    const activityFileUrl = new URL(callBackURL);
    const data = { id: activityFileUrl.searchParams.get("id") };

    const header = oauth_v1_handler.sign_url(
      oauth_v1_handler.Methods.GET,
      activityFileUrl.href.split("?")[0],
      consumer_key,
      consumer_secret,
      secret.oauth_token,
      secret.oauth_token_secret,
      data
    );
    const fitFile = await oauth_v1_handler.handleGet(
      activityFileUrl.href.split("?")[0],
      header,
      data,
      { responseType: "arraybuffer" }
    );
    let fitFileLocation = "";

    const key = body.data[i].userAccessToken + "_" + body.data[i].summaryId;
    fitFileLocation = await s3Operation.setPayload(
      key,
      'health-integration-garmin',
      JSON.stringify(utils.wrapBase64Data(fitFile.data, body.data[i].summaryId))
    );

    consolidatedFitData.push({
      ...body.data[i],
      fitDataKey: key,
      fitDataLocation: fitFileLocation,
    });
  }
  responseBody = {
    type: body.type,
    isBinary: body.isBinary,
    sendDataToBackend: body.sendDataToBackend,
    applyMapState: body.applyMapState,
    data: consolidatedFitData,
  };

  return lambdaGateway.outputGateway(responseBody);
};
