'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (done) {


  $.router.post('/api/topic/add', $.checkLogin,  async function (req, res, next) {

    req.body.author = req.session.user._id;

    // 发布频率限制
    {
      const key = `addtopic:${req.body.author}:${$.utils.date('YmdH')}`;
      const limit = 2;
      const ok = await $.limiter.incr(key, limit);
      if (!ok) throw new Error('out of limit');
    }

    if ('tags' in req.body) {
      req.body.tags = req.body.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    const topic = await $.method('topic.add').call(req.body);

    await $.method('user.incrScore').call({_id: req.body.author, score: 5});

    res.apiSuccess({topic});

  });


  $.router.get('/api/topic/list', async function (req, res, next) {

    if ('tags' in req.query) {
      req.query.tags = req.query.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    let page = parseInt(req.query.page, 10);
    if (!(page > 1)) page = 1;
    req.query.limit = 10;
    req.query.skip = (page - 1) * req.query.limit;

    const list = await $.method('topic.list').call(req.query);

    const count = await $.method('topic.count').call(req.query);
    const pageSize = Math.ceil(count / req.query.limit);

    res.apiSuccess({count, page, pageSize, list});

  });


  $.router.get('/api/topic/item/:topic_id', async function (req, res, next) {

    const topic = await $.method('topic.get').call({_id: req.params.topic_id});
    if (!topic) return next(new Error(`topic ${req.params.topic_id} does not exists`));

    const userId = req.session.user && req.session.user._id && req.session.user._id.toString();
    const isAdmin = req.session.user && req.session.user.isAdmin;

    const result = {};
    result.topic = $.utils.cloneObject(topic);
    result.topic.permission = {
      edit: isAdmin || userId === result.topic.author._id,
      delete: isAdmin || userId === result.topic.author._id,
    };
    result.topic.comments.forEach(item => {
      item.permission = {
        delete: isAdmin || userId === item.author._id,
      };
    });

    await $.method('topic.incrPageView').call({_id: req.params.topic_id});

    res.apiSuccess(result);

  });


  $.router.post('/api/topic/item/:topic_id', $.checkLogin, $.checkTopicAuthor, async function (req, res, next) {

    if ('tags' in req.body) {
      req.body.tags = req.body.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    req.body._id = req.params.topic_id;
    await $.method('topic.update').call(req.body);

    const topic = await $.method('topic.get').call({_id: req.params.topic_id});

    res.apiSuccess({topic});

  });


  $.router.delete('/api/topic/item/:topic_id', $.checkLogin, $.checkTopicAuthor, async function (req, res, next) {

    const topic = await $.method('topic.delete').call({_id: req.params.topic_id});

    res.apiSuccess({topic});

  });


  $.router.post('/api/topic/item/:topic_id/comment/add', $.checkLogin, async function (req, res, next) {

    req.body._id = req.params.topic_id;
    req.body.author = req.session.user._id;

    // 发布频率限制
    {
      const key = `addcomment:${req.body.author}:${$.utils.date('YmdH')}`;
      const limit = 20;
      const ok = await $.limiter.incr(key, limit);
      if (!ok) throw new Error('out of limit');
    }

    const comment = await $.method('topic.comment.add').call(req.body);

    await $.method('user.incrScore').call({_id: req.body.author, score: 1});

    res.apiSuccess({comment});

  });


  $.router.post('/api/topic/item/:topic_id/comment/delete', $.checkLogin, async function (req, res, next) {

    req.body._id = req.params.topic_id;

    const query = {
      _id: req.params.topic_id,
      cid: req.body.cid,
    };
    const comment = await $.method('topic.comment.get').call(query);

    if (comment && comment.comments && comment.comments[0]) {
      const item = comment.comments[0];
      if (req.session.user.isAdmin || item.author.toString() === req.session.user._id.toString()) {
        await $.method('topic.comment.delete').call(query);
      } else {
        return next(new Error('access denied'));
      }
    } else {
      return next(new Error('comment does not exists'));
    }

    res.apiSuccess({comment: comment.comments[0]});

  });


  done();

};
