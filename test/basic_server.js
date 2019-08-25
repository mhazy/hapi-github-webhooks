const Hapi = require('@hapi/hapi');
const hapiGithubWebhook = require('../lib/');

/**
 * Secret to use
 *
 * @param secret
 * @returns {*}
 */
const createServer = async (secret) => {
    const server = new Hapi.Server({debug: false});

    await server.register(hapiGithubWebhook);

    server.auth.strategy('githubwebhook', 'githubwebhook', {secret: secret});
    server.auth.default('githubwebhook');
    server.route([{
        method: 'POST',
        path: '/webhooks/github',
        handler: async function () {
            return '';
        }
    }]);

    return server;
};

module.exports = {
    createServer
};

