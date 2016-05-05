'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import Redis from 'ioredis';

module.exports = function (done) {

  const debug = $.createDebug('init:limiter');

  const connection = new Redis($.config.get('limiter.redis'));
  const prefix = $.config.get('limiter.redis.prefix');
  $.limiter = {connection};

  $.limiter.incr = async function (key, limit) {
    let ret = await connection.incr(prefix + key);
    ret = Number(ret);
    debug('incr: key=%s, counter=%s', key, ret);
    if (isNaN(ret)) return false;
    if (ret > limit) return false;
    return true;
  };

  $.limiter.reset = async function (key) {
    debug('reset: key=%s', key);
    return connection.del(prefix + key);
  };

  done();

}
