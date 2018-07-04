const Hapi = require('hapi');
const hapiGithubWebhook = require('hapi-github-webhooks');
const port = process.env.PORT || 4005;
const host = process.env.HOST || '0.0.0.0';
const secret = process.env.SECRET || 'RandomSecretToken'; // Never Share This!
const server = new Hapi.Server({
    host: host,
    port: port
});

const startServer = async () => {
  try {
      await server.register(hapiGithubWebhook);

      // see: http://hapijs.com/api#serverauthschemename-scheme
      server.auth.strategy('githubwebhook', 'githubwebhook', { secret: secret});

      server.route([
          {
              method: 'GET',
              path: '/',
              config: {},
              handler: async function () {
                  return 'ok';
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
              handler: async function() {
                  return '';
              }
          }
      ]);

      await server.start();
  } catch (err) {
      console.log(err);
  }
};

startServer().then(() => console.log('Server running at:', server.info.uri));
