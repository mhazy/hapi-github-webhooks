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
        const signature = 'sha1=725d3b6750a528d85390a1a81f908f838fce3c9e';
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
    it('should return a status of 200 if the signature is valid and contains utf-8', (done) => {
        const payload = JSON.stringify({
            message: 'This message is valid! ⚠️'
        });
        const signature = 'sha1=bc132642e6d17e72204085106dd774cc33818a81';
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
