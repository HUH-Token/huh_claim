import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Meta from './components/Meta'

ReactDOM.render(
  <React.StrictMode>
    <Meta app = {App} />
  </React.StrictMode>,
  document.getElementById('root')
);