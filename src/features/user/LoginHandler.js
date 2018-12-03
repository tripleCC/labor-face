import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from './redux/getUserInfo';
import { Redirect } from 'react-router';

class LoginHandler extends React.PureComponent {
  componentDidMount() {
    const { getUserInfo, location } = this.props;
    let params = new URLSearchParams(location.search);
    let code = params.get('code');
    getUserInfo(code);
  }

  render() {
    return <Redirect to="/" />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo: code => dispatch(getUserInfo(code)),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(LoginHandler);
