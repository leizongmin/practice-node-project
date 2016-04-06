import 'bootstrap-webpack';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {getTopicList} from './lib/client';

getTopicList({})
  .then(ret => console.log(ret))
  .catch(err => console.error(err));


ReactDOM.render(<App />, document.body);
