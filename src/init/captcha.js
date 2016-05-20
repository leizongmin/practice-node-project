'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import Redis from 'ioredis';

module.exports = function (done) {

  const debug = $.createDebug('init:captcha');

  const connection = new Redis($.config.get('captcha.redis'));
  const prefix = $.config.get('captcha.redis.prefix');
  $.captcha = {connection};

  $.captcha.generate = async function (data, ttl) {
    const json = JSON.stringify(data);
    const code = Date.now() + '.' + $.utils.randomString(20);
    debug('generate: code=%s, json=%s', code, json);
    const key = prefix + code;
    await connection.setex(key, ttl, json);
    return code;
  };

  $.captcha.get = async function (code) {
    const key = prefix + code;
    const json = await connection.get(key);
    debug('get: code=%s, json=%s', code, json);
    if (!json) return false;
    const data = JSON.parse(json);
    return data;
  };

  done();

}
