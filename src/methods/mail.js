'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import fs from 'fs';
import path from 'path';
import rd from 'rd';
import ejs from 'ejs';
import nodemailer from 'nodemailer';

module.exports = function (done) {


  $.smtp = nodemailer.createTransport($.config.get('smtp'), {
    from: $.config.get('smtp.auth.user'),
  });


  const templates = {};
  rd.eachFileFilterSync(path.resolve(__dirname, '../../email_templates'), /\.html$/, (f, s) => {
    const name = path.basename(f, '.html');
    const html = fs.readFileSync(f).toString();
    templates[name] = ejs.compile(html);
  });


  $.method('mail.send').check({
    to: {required: true},
    subject: {required: true},
    html: {required: true},
  });
  $.method('mail.send').register(function (params, callback) {

    $.smtp.sendMail(params, callback);

  });


  $.method('mail.sendTemplate').check({
    to: {required: true},
    subject: {required: true},
    template: {required: true},
  });
  $.method('mail.sendTemplate').register(async function (params) {

    const fn = templates[params.template];
    if (!fn) throw new Error(`invalid email template "${params.template}"`);

    const html = fn(params.data || {});

    return $.method('mail.send').call({
      to: params.to,
      subject: params.subject,
      html: html,
    });

  });


  done();

};
