'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import nodemailer from 'nodemailer';

module.exports = function (done) {


  $.smtp = nodemailer.createTransport($.config.get('smtp'), {
    from: $.config.get('smtp.auth.user'),
  });


  $.method('mail.send').check({
    to: {required: true},
    subject: {required: true},
    html: {required: true},
  });
  $.method('mail.send').register(function (params, callback) {

    $.smtp.sendMail(params, callback);

  });



  done();

};
