import React from 'react';
import 'highlight.js/styles/github-gist.css';
import {getTopicDetail} from '../lib/client';
import {renderMarkdown} from '../lib/utils';

export default class TopicDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getTopicDetail(this.props.params.id)
      .then(topic => {
        topic.html = renderMarkdown(topic.content);
        this.setState({topic});
      })
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
        <section dangerouslySetInnerHTML={{__html: topic.html}}></section>
        <ul className="list-group">
          {topic.comments.map((item, i) => {
            return (
              <li className="list-group-item" key={i}>
                {item.authorId}于{item.createAt}说：<br/>{item.content}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
