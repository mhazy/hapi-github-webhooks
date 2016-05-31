const expect = require('chai').expect;
const server = require('./basic_server');
const secret = 'SuperSecretKey';
const hmac = require('../lib/hmac');

let testServer;

describe('github webhook handler', () => {
    before(() => {
        testServer = server.createServer(secret);
    });
    it('should be unauthorized when signature header is missing', (done) => {
        const options = {
            method: "POST",
            url: "/webhooks/github"
        };
        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(401, 'server responded with 401');
            expect(response.result.message).to.equal('Invalid signature');
            done();
        });
    });
    it('should be unauthorized when signature is not valid', (done) => {
        const options = {
            method: "POST",
            url: "/webhooks/github",
            headers: {
                'X-Hub-Signature': 'invalid'
            }
        };
        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(401, 'server responded with 401');
            expect(response.result.message).to.equal('Invalid signature');
            done();
        });
    });
    it('should return a status of 200 if the signature is valid', (done) => {
        const payload = JSON.stringify({
            message: 'This message is valid!'
        });
        const signature  = hmac.create(secret, payload);
        const options = {
            method: "POST",
            url: "/webhooks/github",
            headers: {
                'X-Hub-Signature': signature,
                'Content-Type': 'application/json'
            },
            payload: payload
        };

        testServer.inject(options, function(response) {
            expect(response.statusCode).to.equal(200, 'server responded with non-200 response');
            done();
        });
    });
});
