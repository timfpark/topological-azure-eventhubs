const async = require('async'),
      { Client } = require('azure-event-hubs'),
      { Connection } = require("topological");

class EventHubConnection extends Connection {
    constructor(config) {
        super(config);
    }

    start(callback) {
        this.client = Client.fromConnectionString(this.config.connectionString, this.config.name);
        this.client.open().then(() => {
            return this.client.createSender();
        }).then(sender => {
            this.sender = sender;
            return callback();
        }).catch(callback);
    }
/*
    resume(callback) {
        if (!this.receivers) return callback(new Error("Not yet streaming, cannot resume"));

        super.resume(err => {
            if (err) return callback(err);

            this.consumerGroup.resume();
            if (callback) return callback();
        });
    }

    pause(callback) {
        if (!this.receivers) return callback(new Error("Not yet streaming, cannot pause"));

        super.pause(err => {
            if (err) return callback(err);

            this.consumerGroup.pause();
            if (callback) return callback();
        });

    }
*/
    enqueue(messages, callback) {
        if (!messages || messages.length === 0) return callback();

        async.each(messages, (message, messageCallback) => {
            this.sender.on('errorReceived', err => {
                console.log(err);
            });

            this.sender.send({
                contents: JSON.stringify(message.body)
            }, message.body[this.config.keyField]);

            return messageCallback();
        }, callback);
    }

    stream(callback) {
        async.concat(this.client.getPartitionIds(), (partitionId, partitionCallback) => {
            this.client.createReceiver(this.config.groupId, partitionId, {
                'startAfterTime' : this.config.startFromOffset || 0
            }).then(receiver => {
                receiver.on('errorReceived', callback);
                receiver.on('message', message => {
                    return callback(null, message);
                });

                return partitionCallback(null, receiver);
            }).catch(partitionCallback);

        }, (err, receivers) => {
            if (err) return callback(err);

            this.receivers = receivers;
        });
    }
}

module.exports = EventHubConnection;