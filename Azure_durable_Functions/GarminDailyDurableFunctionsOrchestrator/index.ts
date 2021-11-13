/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {
    try {
        var transformationZoneResult;
        var purposeZoneResult;

        var ingestDataResult = yield context.df.callActivity("handle-garmin-webhook", context.df.getInput())

        if (ingestDataResult.body.type === "activityFiles") {
            ingestDataResult = yield context.df.callActivity("fetch-garmin-fit-file", ingestDataResult)
        } else if (ingestDataResult.body.type === "unsupported") {
            throw new Error("Garmin Webhook Failed")
        }

        const landingZoneResult = yield context.df.callActivity("garmin-webhook-landing-zone", ingestDataResult)

        if (landingZoneResult.body.type === "dailies") {
            const tasks = [];
            for (const data of landingZoneResult.body.data) {
                tasks.push(context.df.callActivity("process-garmin-dailies", data));
            }
            const tempTransformationZoneResult = yield context.df.Task.all(tasks)
            transformationZoneResult = landingZoneResult
            transformationZoneResult.body.data = tempTransformationZoneResult.reduce(
                (prev, curr) => [...prev, curr.body], []
            )
        } else if (landingZoneResult.body.type === "activities") {
            transformationZoneResult = yield context.df.callActivity("process-garmin-activities", landingZoneResult)
        } else {
            transformationZoneResult = landingZoneResult
        }

        if (transformationZoneResult.body.sendDataToBackend === true) {
            purposeZoneResult = yield context.df.callActivity("upload-baseplatform", transformationZoneResult)
        } else {
            purposeZoneResult = yield context.df.callActivity("save-garmin-webhook", transformationZoneResult)
        }
        return purposeZoneResult;
    }
    catch (error) {
        console.error(error)
    }
});

export default orchestrator;
