# Measurement Aggregator - Azure Function - TimerTrigger - JavaScript

## How it works
Azure Function which is triggered periodically. The function connects to the mongoDB and gets all current measurements uploaded by the checkpoints. These measurements are then grouped into timeslots and aggregated. The aggregated information are stored back to the database as the individual measurements are purged.

## Design

## Development
### Visual Studio Code
For the development Visual Studio Code is used. For the development of the Azure Function the Azure extension is required. The extension provides the possibility to run the function locally. Furthermore the extension provides the possibility to deploy the function to the Azure cloud. The extension can be loaded here [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

### Environment Variables
To control the application behavior the following environment variables are available:

    # MONGO DB
    MONGO_DB_STRING=db

## Productive Infrastructure
The productive infrastructure is hosted on Azure.

### Configuration
Crontab: every 5 min
