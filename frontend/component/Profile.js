import React from 'react';
import jQuery from 'jquery';
import {loginUser, updateProfile} from '../lib/client';
import {redirectURL} from '../lib/utils';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    loginUser()
      .then(user => this.setState(user))
      .catch(err => console.error(err));
  }

  handleChange(name, e) {
    this.setState({[name]: e.target.value});
  }

  handleSave(e) {
    const $btn = jQuery(e.target);
    $btn.button('loading');
    updateProfile(this.state.email, this.state.nickname, this.state.about)
      .then(ret => {
        $btn.button('reset');
        alert('修改成功！');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  render() {
    if (!this.state._id) {
      return (
        <p>正在加载...</p>
      )
    }
    return (
      <div style={{width: 400, margin: 'auto'}}>
        <div className="panel panel-primary">
          <div className="panel-heading">{this.state.name} 的个人设置</div>
            <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-email">邮箱</label>
                <input type="email" className="form-control" id="ipt-email" onChange={this.handleChange.bind(this, 'email')} placeholder="" value={this.state.email} />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-nickname">昵称</label>
                <input type="text" className="form-control" id="ipt-nickname" onChange={this.handleChange.bind(this, 'nickname')} placeholder="" value={this.state.nickname} />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-about">个人介绍</label>
                <textarea className="form-control" id="ipt-about" onChange={this.handleChange.bind(this, 'about')} placeholder="">{this.state.about}</textarea>
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleSave.bind(this)}>保存</button>
              </form>
            </div>
        </div>
      </div>
    )
  }
}
