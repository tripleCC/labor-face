import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router';
import { Router, Route, Switch } from 'react-router-dom';
import history from './common/history';
import store from './common/configureStore';
import HomeLayout from './features/common/HomeLayout';
import MainDeployList from './features/deploys/MainDeployList';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <HomeLayout>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/deploys" />} />
              <Route path="/deploys" component={MainDeployList} />
            </Switch>
          </HomeLayout>
        </Router>
      </Provider>
    );
  }
}

export default App;
