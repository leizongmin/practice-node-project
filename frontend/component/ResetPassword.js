import React from 'react';
import jQuery from 'jquery';
import {Link} from 'react-router';
import {login, requestResetPassword, resetPassword} from '../lib/client';
import {redirectURL} from '../lib/utils';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(name, e) {
    this.state[name] = e.target.value;
  }

  handleSendCode(e) {
    const $btn = jQuery(e.target);
    $btn.button('loading');
    requestResetPassword(this.state.email)
      .then(ret => {
        $btn.button('reset');
        this.setState({sent: true});
        alert('已经发送验证码到你的邮箱，请登录邮箱查收，并在当前页面输入该验证码');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  handleReset(e) {
    const $btn = jQuery(e.target);
    $btn.button('loading');
    resetPassword(this.state.code, this.state.email, this.state.password)
      .then(ret => {
        $btn.button('reset');
        alert('修改成功！');
        redirectURL('/login');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  render() {
    return (
      <div style={{width: 400, margin: 'auto'}}>
        <div className="panel panel-primary">
          <div className="panel-heading">重置密码</div>
            <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-email">邮箱</label>
                <input type="email" className="form-control" id="ipt-email" onChange={this.handleChange.bind(this, 'email')} placeholder="" />
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleSendCode.bind(this)}>发送验证码</button>
              {this.state.sent ?
                <div>
                  <hr />
                  <div className="form-group">
                    <label htmlFor="ipt-code">验证码</label>
                    <input type="text" className="form-control" id="ipt-code" onChange={this.handleChange.bind(this, 'code')} placeholder="" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">新密码</label>
                    <input type="password" className="form-control" id="password" onChange={this.handleChange.bind(this, 'password')} placeholder="" />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={this.handleReset.bind(this)}>修改</button>
                </div>
              : null}
              </form>
            </div>
        </div>
      </div>
    )
  }
}
