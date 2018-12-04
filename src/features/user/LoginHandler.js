import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from './redux/getUserInfo';
import { Redirect } from 'react-router';
import { message, Alert } from 'antd';

class LoginHandler extends React.PureComponent {
  componentDidMount() {
    const { getUserInfo, location } = this.props;
    let params = new URLSearchParams(location.search);
    let code = params.get('code');
    getUserInfo(code);
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (!prevProps.error && error) {
      message.error(error.message);
    }
  }

  render() {
    const { logined, error } = this.props;

    return !!error ? (
      <Alert message={`登录失败，重新登录! ${error.message}`} type="error" />
    ) : logined ? (
      <Redirect to="/" />
    ) : (
      <div>登录中...</div>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: { error, logined },
  } = state;
  return { error, logined };
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo: code => dispatch(getUserInfo(code)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginHandler);
