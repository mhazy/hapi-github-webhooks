import Boom from "boom"; // error handling https://github.com/hapijs/boom
import assert from "assert";
import * as joi from "joi";
import pkg from "../package.json";
import { checkHmac } from "./hmac";

const internals = {}; // Declare internals >> see: http://hapijs.com/styleguide
const WEBHOOK_SIGNATURE_HEADER = "x-hub-signature";

const validators = {
  header: joi
    .string()
    .regex(/^sha1=([a-f0-9]{40})$/)
    .required(0),
  options: joi.object({
    secret: joi
      .string()
      .min(1)
      .required()
  })
};

/**
 * Register plugin
 *
 * @param server
 * @returns {*}
 */
const register = async server => {
  server.auth.scheme("githubwebhook", internals.implementation);
};

// module.exports = { register, pkg };

internals.implementation = (server, options) => {
  const optionsValidation = validators.options.validate(options);
  assert(optionsValidation.error === null, "options are not valid");

  const invalidSignature = Boom.unauthorized("Invalid signature");

  return {
    authenticate: async (request, responseToolkit) => {
      const signatureHeader = request.headers[WEBHOOK_SIGNATURE_HEADER];
      if (!signatureHeader) {
        return responseToolkit.unauthenticated(invalidSignature);
      }
      const headerValidation = joi.validate(signatureHeader, validators.header);
      if (headerValidation.error !== null) {
        return responseToolkit.unauthenticated(invalidSignature);
      }
      return responseToolkit.authenticated({
        credentials: WEBHOOK_SIGNATURE_HEADER
      });
    },
    payload: async (request, responseToolkit) => {
      const body = JSON.stringify(request.payload);
      const valid = checkHmac(
        options.secret,
        body,
        request.headers[WEBHOOK_SIGNATURE_HEADER]
      );
      if (valid) {
        return responseToolkit.continue();
      }
      throw invalidSignature;
    }
  };
};

export { register, pkg };
