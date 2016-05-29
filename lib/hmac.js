const crypto = require('crypto');

/**
 * Generate an sha1 hmac
 *
 * @param key
 * @param text
 * @returns {string}
 */
const createHmac = (key, text) => {
    const hmac = crypto.createHmac('sha1', key);
    hmac.setEncoding('hex');
    hmac.write(text);
    hmac.end();
    return 'sha1=' + hmac.read();
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
    return hash === digest;
};

module.exports = {
    create: createHmac,
    check: checkHmac
};