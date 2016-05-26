'use strict';

/**
 * pratice Node.js project
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import {expect} from 'chai';
import request from '../test';

describe('user', function () {

  it('signup', async function () {

    try {
      const ret = await request.post('/api/signup', {
        name: 'test1',
        password: '12345678',
      });
      throw new Error('should throws missing parameter "email" error');
    } catch (err) {
      expect(err.message).to.equal('email: missing parameter "email"');
    }

    {
      const ret = await request.post('/api/signup', {
        name: 'test1',
        password: '12345678',
        email: 'test1@example.com',
      });
      console.log(ret);
    }

  });

});
