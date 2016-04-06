import 'bootstrap-webpack';
import React from 'react';
import ReactDOM from 'react-dom';

console.log('hello. world');

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.body);
