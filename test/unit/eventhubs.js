const assert = require('assert');
const fixtures = require('../fixtures');

describe('EventHubsConnection', function() {
    it('can start, enqueue, and stream messages', done => {
        let finished = false;
        fixtures.connection.start(err => {
            assert(!err);

            fixtures.connection.stream((err, message) => {
                assert(!err);
                assert(message);

                assert(message.body.number, 1);
                if (!finished) done();

                finished = true;
            });

            setTimeout(() => {
                fixtures.connection.enqueue(
                    [
                        {
                            body: {
                                userId: 'user1',
                                number: 1
                            }
                        }
                    ],
                    err => {
                        assert(!err);
                    }
                );
            }, 10000000);
        });
    });
});
