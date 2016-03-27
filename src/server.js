'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import path from 'path';
import ProjectCore from 'project-core';
import createDebug from 'debug';

const $ = global.$ = new ProjectCore();


// 创建Debug函数
$.createDebug = function (name) {
  return createDebug('my:' + name);
};
const debug = $.createDebug('server');


// 加载配置文件
$.init.add((done) => {
  $.config.load(path.resolve(__dirname, 'config.js'));
  const env = process.env.NODE_ENV || null;
  if (env) {
    debug('load env: %s', env);
    $.config.load(path.resolve(__dirname, '../config', env + '.js'));
  }
  $.env = env;
  done();
});


// 初始化MongoDB
$.init.load(path.resolve(__dirname, 'init', 'mongodb.js'));
// 加载Models
$.init.load(path.resolve(__dirname, 'models'));


// 加载methods
$.init.load(path.resolve(__dirname, 'methods'));


// 初始化Express
$.init.load(path.resolve(__dirname, 'init', 'express.js'));
// 初始化中间件
$.init.load(path.resolve(__dirname, 'middlewares'));
// 加载路由
$.init.load(path.resolve(__dirname, 'routes'));


// 初始化
$.init((err) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  } else {
    console.log('inited [env=%s]', $.env);
  }

  require('./test');
});
