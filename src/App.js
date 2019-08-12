import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './common/configureStore';
import HomePage from './HomePage';
import './App.css';
import {LocaleProvider} from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
moment.locale ('zh-cn');

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <HomePage />
        </LocaleProvider>
      </Provider>
    );
  }
}

export default App;
