'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import validator from 'validator';

module.exports = function (done) {


  $.method('notification.add').check({
    from: {validate: (v) => validator.isMongoId(String(v)), required: true},
    to: {validate: (v) => validator.isMongoId(String(v)), required: true},
    type: {validate: (v) => typeof v === 'string' && v, required: true},
  });
  $.method('notification.add').register(async function (params) {

    const item = new $.model.Notification(params);
    item.createdAt = new Date();
    item.isRead = false;

    return item.save();

  });


  $.method('notification.list').check({
    from: {validate: (v) => validator.isMongoId(String(v))},
    to: {validate: (v) => validator.isMongoId(String(v))},
    type: {validate: (v) => typeof v === 'string' && v},
    skip: {validate: (v) => v >= 0},
    limit: {validate: (v) => v > 0},
  });
  $.method('notification.list').register(async function (params) {

    const query = {};
    if (params.from) query.from = params.from;
    if (params.to) query.to = params.to;
    if (params.type) query.type = params.type;
    if ('isRead' in params) query.isRead = params.isRead;

    const ret = $.model.Notification.find(query)
    .populate({
      path: 'from',
      model: 'User',
      select: 'nickname about',
    })
    .populate({
      path: 'to',
      model: 'User',
      select: 'nickname about',
    });
    if (params.skip) ret.skip(Number(params.skip));
    if (params.limit) ret.limit(Number(params.limit));
    ret.sort({_id: -1});

    return ret;

  });


  $.method('notification.count').check({
    from: {validate: (v) => validator.isMongoId(String(v))},
    to: {validate: (v) => validator.isMongoId(String(v))},
    type: {validate: (v) => typeof v === 'string' && v},
  });
  $.method('notification.count').register(async function (params) {

    const query = {};
    if (params.from) query.from = params.from;
    if (params.to) query.to = params.to;
    if (params.type) query.type = params.type;
    if ('isRead' in params) query.isRead = params.isRead;

    return $.model.Notification.count(query);

  });


  $.method('notification.setRead').check({
    _id: {validate: (v) => validator.isMongoId(String(v)), required: true},
    to: {validate: (v) => validator.isMongoId(String(v)), required: true},
  });
  $.method('notification.setRead').register(async function (params) {

    return $.model.Notification.update(params, {$set: {
      isRead: true,
      readAt: new Date(),
    }});

  });


  $.method('notification.delete').check({
    _id: {validate: (v) => validator.isMongoId(String(v)), required: true},
    to: {validate: (v) => validator.isMongoId(String(v)), required: true},
  });
  $.method('notification.delete').register(async function (params) {

    return $.model.Notification.remove(params);

  });


  done();

};
