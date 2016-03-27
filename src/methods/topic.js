'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import validator from 'validator';

module.exports = function (done) {


  $.method('topic.add').check({
    authorId: {required: true, validate: (v) => validator.isMongoId(v)},
    title: {required: true},
    content: {required: true},
    tags: {validate: (v) => Array.isArray(v)},
  });
  $.method('topic.add').register(async function (params) {

    const topic = new $.model.Topic(params);
    topic.createdAt = new Date();

    return topic.save();

  });


  $.method('topic.get').check({
    _id: {required: true, validate: (v) => validator.isMongoId(v)},
  });
  $.method('topic.get').register(async function (params) {

    return $.model.Topic.findOne({_id: params._id});

  });


  $.method('topic.list').check({
    authorId: {validate: (v) => validator.isMongoId(v)},
    tags: {validate: (v) => Array.isArray(v)},
    skip: {validate: (v) => v >= 0},
    limit: {validate: (v) => v > 0},
  });
  $.method('topic.list').register(async function (params) {

    const query = {};
    if (params.authorId) query.authorId = params.authorId;
    if (params.tags) query.tags = {$all: params.tags};

    const ret = $.model.Topic.find(query, {
      authorId: 1,
      title: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1,
      lastCommentedAt: 1,
    });
    if (params.skip) ret.skip(params.skip);
    if (params.limit) ret.skip(params.limit);

    return ret;

  });


  done();

};
