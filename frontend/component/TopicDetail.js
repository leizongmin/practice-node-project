import React from 'react';
import {getTopicDetail} from '../lib/client';

export default class TopicDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getTopicDetail(this.props.params.id)
      .then(topic => this.setState({topic}))
      .catch(err => console.error(err));
  }

  render() {
    const topic = this.state.topic;
    if (!topic) {
      return (
        <div>正在加载...</div>
      );
    }
    return (
      <div>
        <h2>{topic.title}</h2>
        <section>{topic.content}</section>
        <ul className="list-group">
          {topic.comments.map((item, i) => {
            return (
              <li className="list-group-item">
                {item.authorId}于{item.createAt}说：<br/>{item.content}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
