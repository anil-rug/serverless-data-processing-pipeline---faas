const AWSSecretSDK = require("aws-sdk");
var AWSXRay = require("aws-xray-sdk-core");
// Configure the context missing strategy to do nothing
AWSXRay.setContextMissingStrategy(() => {});

const paramsSecretManager = {
        region: 'us-east-1',
      };

var clientSecret = AWSXRay.captureAWSClient(
  new AWSSecretSDK.SecretsManager(paramsSecretManager)
);

exports.retrieveSecret = async function (secretName) {
  const secret = clientSecret
    .getSecretValue({ SecretId: secretName })
    .promise();
  return secret;
};
