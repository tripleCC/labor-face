import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import history from './common/history';
import LoginHandler from './features/user/LoginHandler';
import HomeLayout from './features/common/HomeLayout';
import MainDeployList from './features/deploys/MainDeployList';

class HomePage extends React.Component {
  render() {
    const { globalSpinning, globalSpinTip } = this.props;
    return (
      <Router history={history}>
        <Spin spinning={globalSpinning} size="large" tip={globalSpinTip}>
          <HomeLayout>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/deploys" />} />
              <Route path="/deploys" component={MainDeployList} />
              <Route path="/oauth/handler" component={LoginHandler} />
            </Switch>
          </HomeLayout>
        </Spin>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const {
    common: { globalSpinning, globalSpinTip },
  } = state;
  return { globalSpinning, globalSpinTip };
}

export default connect(mapStateToProps)(HomePage);
