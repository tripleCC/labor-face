import React from 'react';
import { Redirect } from 'react-router';
import { Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import history from './common/history';
import LoginHandler from './features/user/LoginHandler';
import HomeLayout from './features/common/HomeLayout';
import MainDeployList from './features/deploys/MainDeployList';
import MainDeployDetailCard from './features/deploys/MainDeployDetailCard';
import OperationsList from './features/operations/OperationsList';
import CiStatusList from './features/ci/CiStatusList';
import LaunchMonitorView from './features/launch/LaunchMonitorView'

class HomePage extends React.Component {
  render() {
    const {
      common: {
        globalSpinning,
        globalSpinTip,
        contentSpinning,
        contentSpinTip,
      },
    } = this.props;
    return (
      <Router history={history}>
        <Spin spinning={globalSpinning} size="large" tip={globalSpinTip}>
          <HomeLayout>
            <Spin spinning={contentSpinning} tip={contentSpinTip}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/deploys" />}
                />
                <Route path="/deploys/:id" component={MainDeployDetailCard} />
                <Route path="/deploys" component={MainDeployList} />
                <Route path="/operations" component={OperationsList} />
                <Route path="/ci-status" component={CiStatusList} />
                <Route path="/monitor/launch" component={LaunchMonitorView} />
                <Route path="/oauth/handler" component={LoginHandler} />
              </Switch>
            </Spin>
          </HomeLayout>
        </Spin>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { common } = state;
  return { common };
}

export default connect(mapStateToProps)(HomePage);
