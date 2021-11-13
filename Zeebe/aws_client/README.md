# Showcase to coordinate serverless functions using Zeebe in Camunda Cloud

This demo implements an sample FaaS application with a managed Zeebe cluster in Camunda Cloud.

# How-to use

## Create Zeebe cluster in Camunda Cloud

* Create Camunda Cloud account: <https://camunda.com/products/cloud/>
* Create Zeebe Cluster
* Retrieve client credentials (clusterId, clientId, clientSecret). We need that for deployment (via the Zeebe Modeler or `zbctl`) and the [serverless.yml](serverless.yml) that will set the right environment variables to be used in the [healthapi-zeebe/index.js](healthapi-zeebe/index.js) function.

## Deploy Workflow Definition to Zeebe

You can deploy directly via the modeler.

Or using the below command:

```
zbctl --address 2daa1cac-f7cf-45e7-98f8-cccb474bf329.zeebe.camunda.io:443 --clientId xxxxxxxxxxxxxxx --clientSecret xxxxxxxxxxxxxx deploy health-api-integration.bpmn
```

## Run Lambda Worker

Make sure you operate the Lambda Worker as connection between Zeebe and AWS. Details can be found here: <https://github.com/zeebe-io/zeebe-lambda-worker>

For example just run it using Docker:

```
docker run --env-file camunda.env --env-file aws.env -p 8080:8080 camunda/zeebe-lambda-worker:SNAPSHOT
```

with camunda.env:

```
ZEEBE_CLIENT_CLOUD_CLUSTERID=x
ZEEBE_CLIENT_CLOUD_CLIENTID=y
ZEEBE_CLIENT_CLOUD_CLIENTSECRET=z
```

and aws.env:

```
AWS_REGION=eu-central-1
AWS_ACCESSKEY=x
AWS_SECRET=y
```

You might operate the container via AWS Fargate.


## Call health-integration via REST

```
curl -H "Content-Type: application/json" -X PUT -d  @request-zeebe.json https://8rbjxgtf82.execute-api.eu-central-1.amazonaws.com/dev/healthapi/start
```

Now you can inspect your workflow instance via Operate.
