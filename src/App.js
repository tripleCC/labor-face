import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './common/configureStore';
import HomePage from './HomePage';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
  }
}

export default App;
