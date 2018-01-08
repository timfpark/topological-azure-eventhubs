const EventHubConnection = require('../index');

module.exports = {
    connection: new EventHubConnection({
        id: "eventHubsConnection",
        config: {
            id: "testEventHub",
            connectionString: "Endpoint=sb://iothub-ns-eeeparks-294135-ac895016f7.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=uNQa1OzXbaABcMtKRQsLp8dqnvYm0dg0Upi5vYr/1CY=",
            name: "eeeparks",
            groupId: "$Default",
            keyField: "userId"
        }
     })
};
