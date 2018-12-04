import React from 'react';
import { connect } from 'react-redux';
import { WEBSOCKET_LABOR_DEPLOY_PROCESS_MODULE } from '../websocket/redux/constants';
import { connectWebsocket } from '../websocket/redux/connectWebsocket';
import { getDeployDetail } from './redux/getDeployDetail';

class MainDeployDetailCard extends React.PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      connectWebsocket,
      getDeployDetail,
    } = this.props;
    this.websocket = connectWebsocket(id);
    getDeployDetail();
  }

  componentWillUnmount() {
    this.websocket.close();
  }

  render() {
    return <div />;
  }
}

function mapStateToProps(state) {
  const { common } = state;
  return { common };
}

function mapDispatchToProps(dispatch) {
  return {
    connectWebsocket: id => {
      return connectWebsocket(
        dispatch,
        WEBSOCKET_LABOR_DEPLOY_PROCESS_MODULE,
        id,
      );
    },
    getDeployDetail: () => getDeployDetail(),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDeployDetailCard);
