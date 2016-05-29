const Hapi = require('hapi');
const hapiGithubWebhook = require('../lib/');
const port = process.env.PORT || 4005;
const host = process.env.HOST || '0.0.0.0';
const secret = process.env.SECRET || 'RandomSecretToken'; // Never Share This!
const server = new Hapi.Server();

server.connection({
    host: host,
    port: port
});

server.register(hapiGithubWebhook, function (err) {
    if(err){
        console.log(err);
    }
    // see: http://hapijs.com/api#serverauthschemename-scheme
    server.auth.strategy('githubwebhook', 'githubwebhook', { secret: secret});

    server.route([
        {
            method: 'GET', path: '/', config: {},
            handler: function(request, reply) {
                reply('ok');
            }
        },
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

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
