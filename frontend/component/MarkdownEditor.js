import React from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';

export default class MarkdownEditor extends React.Component {
  render() {
    return (
      <div style={{border: '1px solid #ccc'}}>
        <Codemirror value={this.props.value} options={{
          mode: 'gfm',
          lineNumbers: false,
          theme: 'default',
        }} onChange={(value) => this.props.onChange({target: {value}})} />
      </div>
    )
  }
}
