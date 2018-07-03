import crypto from "crypto";
import bufferEq from "buffer-equal-constant-time";

/**
 * Generate an sha1 hmac
 *
 * @param key
 * @param text
 * @returns {string}
 */
const createHmac = (key, text) => {
  const hmac = crypto.createHmac("sha1", key);
  hmac.setEncoding("hex");
  hmac.write(new Buffer(text, "utf-8"));
  hmac.end();
  return "sha1=" + hmac.read();
};

/**
 * Check validity of text
 *
 * @param key
 * @param text
 * @param digest
 * @returns {boolean}
 */
const checkHmac = (key, text, digest) => {
  const hash = createHmac(key, text);
  const hashBuffer = new Buffer(hash);
  const digestBuffer = new Buffer(digest);
  return bufferEq(hashBuffer, digestBuffer);
};

export { createHmac, checkHmac };
