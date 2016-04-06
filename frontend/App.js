import React from 'react';
import {Router, Route, Link, browserHistory} from 'react-router'
import Header from './component/Header';
import Footer from './component/Footer';
import TopicList from './component/TopicList';
import TopicDetail from './component/TopicDetail';

class Index extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />
        {this.props.children ? this.props.children : <TopicList />}
        <Footer />
      </div>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Index}>
          <Route path="topic/:id" component={TopicDetail}/>
        </Route>
      </Router>
    );
  }
}
