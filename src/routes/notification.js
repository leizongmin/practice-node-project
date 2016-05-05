'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (done) {


  function formatQuery(ret, query) {
    if (query.type) ret.type = query.type;
    if ('isRead' in query) ret.isRead = parseBoolean(query.isRead);
    return ret;
  }

  function parseBoolean(v) {
    switch (String(v)) {
      case 'true':
      case '1':
      case 'on':
        return true;
      default:
        return false;
    }
  }


  $.router.get('/api/notification/count', $.checkLogin,  async function (req, res, next) {

    const query = formatQuery({to: req.session.user._id}, req.query);
    const count = await $.method('notification.count').call(query);

    res.apiSuccess({count});

  });


  $.router.get('/api/notification/list', $.checkLogin,  async function (req, res, next) {

    const query = formatQuery({to: req.session.user._id}, req.query);
    const count = await $.method('notification.count').call(query);

    if (req.query.skip) query.skip = req.query.skip;
    if (req.query.limit) query.limit = req.query.limit;
    const list = await $.method('notification.list').call(query);

    res.apiSuccess({count, list});

  });


  $.router.post('/api/notification/:id/read', $.checkLogin,  async function (req, res, next) {

    const ret = await $.method('notification.setRead').call({
      to: req.session.user._id,
      _id: req.params.id,
    });

    res.apiSuccess(ret);

  });


  done();

};
