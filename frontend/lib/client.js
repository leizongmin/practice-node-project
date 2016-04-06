import browserRequest from 'browser-request';

const urlBase = '/api/';

export function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    method = method.toUpperCase();
    const options = {
      method,
      url: `${urlBase}/${path}`,
    };
    if (method === 'GET' || method === 'HEAD') {
      options.qs = data;
    } else {
      options.form = data;
    }
    browserRequest(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        let data;
        try {
          data = JSON.parse(body.toString());
        } catch (err) {
          return reject(new Error('parse JSON data error: ' + err.message));
        }
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    });
  });
}

export function getTopicList(options) {
  return request('get', 'topic/list', {});
}

export function getTopicDetail(id) {
  return request('get', `topic/item/${id}`).then(ret => ret.topic);
}
