# hapi-github-webooks

## Description

[![Build Status](https://travis-ci.org/mhazy/hapi-github-webhooks.svg?branch=master)](https://travis-ci.org/mhazy/hapi-github-webhooks)

An authentication strategy plugin for [hapi](https://github.com/hapijs/hapi) for validating webhook requests from GitHub. This strategy validates the payload with the hmac-sha1 signature sent with the request.

The `'githubwebhook'` scheme takes the following options:
- `secret` - (required) the token configured for the webhook (never share or commit this to your project!)

## Usage
```javascript
var hapi = require('hapi');
var githubWebhooksPlugin = require('hapi-github-webooks');
var token = 'SomeUnsharedSecretToken';
var server = new hapi.Server();

server.connection({
    host: host,
    port: port
});

server.register(githubWebhooksPlugin, function (err) {
  // Register github webhook auth strategy
  server.auth.strategy('githubwebhook', 'githubwebhook', { secret: token});
  // Apply the strategy to the route that handles webhooks
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
        // request.payload is the validated payload from GitHub
        reply();
      }
    }
  ]);
});
```
