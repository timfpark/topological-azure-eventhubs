const EventHubConnection = require('../index');

module.exports = {
    connection: new EventHubConnection({
        id: 'eventHubsConnection',
        config: {
            id: 'test',
            eventHubConnectionString: process.env.EVENTHUB_CONNECTION_STRING,
            eventHubName: 'topologicaltest',
            hostName: 'testhost',
            leaseContainerName: 'topological',
            storageConnectionString: process.env.STORAGE_CONNECTION_STRING,
            groupId: '$Default',
            keyField: 'userId'
        }
    })
};
