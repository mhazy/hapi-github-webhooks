const Hapi = require('hapi');
const hapiGithubWebhook = require('../lib/');

/**
 * Secret to use
 *
 * @param secret
 * @returns {*}
 */
const createServer = (secret) => {
    const server = new Hapi.Server({ debug: false });
    server.connection();

    server.register(hapiGithubWebhook, function (err) {
        if (err) {
            throw err;
        }
        // Add the scheme and apply it to the URL
        server.auth.strategy('githubwebhook', 'githubwebhook', { secret: secret});
        server.route([
            {
                method: 'POST',
                path: '/webhooks/github',
                config: {
                    auth: {
                        strategies: ["githubwebhook"],
                        payload: 'required'
                    }
                },
                handler: function(request, reply) {
                    reply();
                }
            }
        ]);
    });

    return server;
};

module.exports = {
    createServer
};

