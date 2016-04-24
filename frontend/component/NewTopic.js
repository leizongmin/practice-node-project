import React from 'react';
import jQuery from 'jquery';
import {addTopic} from '../lib/client';
import {redirectURL} from '../lib/utils';
import TopicEditor from './TopicEditor';

export default class NewTopic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TopicEditor
        title="发表新主题"
        topic={null}
        onSave={(topic, done) => {
          addTopic(topic.title, topic.tags, topic.content)
            .then(ret => {
              done();
              redirectURL(`/topic/${ret._id}`);
            })
            .catch(err => {
              done();
              alert(err);
            });
        }}
      />
    )
  }
}
