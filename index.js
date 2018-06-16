const { EventProcessorHost } = require('azure-event-processor-host'),
    { EventHubClient } = require('azure-event-hubs'),
    { Connection } = require('topological');

class EventHubConnection extends Connection {
    constructor(config) {
        super(config);
    }

    start(callback) {
        this.eventProcessorHost = EventProcessorHost.createFromConnectionString(
            EventProcessorHost.createHostName(this.config.hostName),
            this.config.storageConnectionString,
            this.config.eventHubConnectionString,
            {
                eventHubPath: this.config.eventHubName,
                leasecontainerName: this.config.leaseContainerName
            }
        );

        this.eventHubClient = EventHubClient.createFromConnectionString(
            this.config.eventHubConnectionString,
            this.config.eventHubName
        );

        return callback();
    }

    stop(callback) {
        this.eventProcessorHost.stop();
        return callback();
    }

    enqueue(messages, callback) {
        if (!messages || messages.length === 0) return callback();

        let partitionedMessages = messages.map(message => {
            message.partitionKey = message.body[this.config.keyField];
            return message;
        });

        this.eventHubClient
            .sendBatch(partitionedMessages)
            .then(deliveries => {
                return callback();
            })
            .catch(callback);
    }

    stream(callback) {
        this.eventProcessorHost.on(
            EventProcessorHost.message,
            (context, message) => {
                message.context = context;
                return callback(null, message);
            }
        );

        this.eventProcessorHost.start();
    }

    succeeded(message, callback) {
        message.context.checkpoint();
        if (callback) return callback();
    }
}

module.exports = EventHubConnection;
