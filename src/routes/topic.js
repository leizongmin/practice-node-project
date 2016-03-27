'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (done) {


  $.router.post('/api/topic/add', $.checkLogin,  async function (req, res, next) {

    req.body.authorId = req.session.user._id;

    if ('tags' in req.body) {
      req.body.tags = req.body.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    const topic = await $.method('topic.add').call(req.body);

    res.apiSuccess({topic});

  });


  $.router.get('/api/topic/list', async function (req, res, next) {

    if ('tags' in req.query) {
      req.query.tags = req.query.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    const list = await $.method('topic.list').call(req.query);

    res.apiSuccess({list});

  });


  $.router.get('/api/topic/item/:topic_id', async function (req, res, next) {

    const topic = await $.method('topic.get').call({_id: req.params.topic_id});
    if (!topic) return next(new Error(`topic ${req.params.topic_id} does not exists`));

    res.apiSuccess({topic});

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
    req.body.authorId = req.session.user._id;
    const comment = await $.method('topic.comment.add').call(req.body);

    res.apiSuccess({comment});

  });


  $.router.post('/api/topic/item/:topic_id/comment/delete', $.checkLogin, async function (req, res, next) {

    req.body._id = req.params.topic_id;

    const query = {
      _id: req.params.topic_id,
      cid: req.body.cid,
    };
    const comment = await $.method('topic.comment.get').call(query);

    if (!(comment && comment.comments && comment.comments[0] &&
        comment.comments[0].authorId.toString() === req.session.user._id.toString())) {
      return next(new Error('access denied'));
    }

    await $.method('topic.comment.delete').call(query);

    res.apiSuccess({comment: comment.comments[0]});

  });


  done();

};
