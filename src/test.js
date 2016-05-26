'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import request from 'supertest';
import './server';


function makeRequest(method, path, params) {
  return new Promise((resolve, reject) => {
    $.ready(err => {
      if (err) return reject(err);

      params = params || {};
      let req = request($.express)[method](path);
      if (method === 'get' || method === 'head') {
        req = req.query(params);
      } else {
        req = req.send(params);
      }
      req.expect(200).end((err, res) => {
        if (err) return reject(err);
        if (res.body.success) {
          resolve(res.body.result);
        } else {
          reject(res.body);
        }
      });
    });
  });
}

function generateRequestMethod(method) {
  return function (path, params) {
    return makeRequest(method, path, params);
  }
}

export default {
  get: generateRequestMethod('get'),
  post: generateRequestMethod('post'),
  put: generateRequestMethod('put'),
  delete: generateRequestMethod('delete'),
};
