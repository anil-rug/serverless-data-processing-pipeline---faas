# Pattern-based Serverless Data Processing Pipeline using Function-as-a-Service (FaaS) Orchestration Systems - Azure Durable Functions

This project contains source code, supporting files for the paper "Pattern-based Serverless Data Processing Pipeline using Function-as-a-Service (FaaS) Orchestration Systems".

The folder includes the following files and folders:

- GarminDailyDurableFunctionsOrchestrator - Contains the source code for the Durable Functions Orchestrator for the Garmin Daily data processing pipeline. Durable Functions is an extension of Azure Functions. Orchestrator function helps to orchestrate the execution of other Durable functions within a function app.
- DurableFunctionsHttpStart - Contains the source code for the Durable Functions HTTP start function. This function is the entry point for the Durable Functions orchestration.

## Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com/download).
- Install the [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) VS Code extension
- Make sure you have the latest version of the [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).
- Durable Functions require an Azure storage account. You need an Azure subscription.
- Make sure that you have version 10.x or 12.x of [Node.js](https://nodejs.org/) installed.

If you don't have an [Azure subscription](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Deploy the sample application

To work with Durable Functions in a Node.js function app, you use a library called ```durable-functions```.

Use the View menu or Ctrl+Shift+` to open a new terminal in VS Code.

Install the ```durable-functions``` npm package by running ```npm install durable-functions``` in the root directory of the function app.

### Sign in to Azure

Please follow steps defined in [Sign in to Azure](https://docs.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#sign-in-to-azure).

### Publish the project to Azure

Please follow steps defined in [Publish the project to Azure](https://docs.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#publish-the-project-to-azure).

### Execute ADF

Please follow steps defined in [Test your function in Azure](https://docs.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#test-your-function-in-azure).