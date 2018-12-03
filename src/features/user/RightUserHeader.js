import React from 'react';
import { Avatar, Dropdown, Icon, Button, Menu } from 'antd';
import { connect } from 'react-redux';

import {
  YO_CLIENT_ID,
  YO_OAUTH_AUTHORIZE_URL,
  YO_OAUTH_REDIRECT_URI,
} from '../../common/constants';
import { logout } from './redux/getUserInfo';
import './RightUserHeader.css';

class RightUserHeader extends React.PureComponent {
  onMenuClick = item => {
    const { logout } = this.props;
    switch (item.key) {
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  renderAvatar() {
    const { info } = this.props;
    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <div>
            <Avatar size="large" icon="user" src={info.picture} alt="avatar" />
            <span className="right-user-header-nickname">{info.nickname}</span>
          </div>
        </Dropdown>
      </div>
    );
  }

  handleLogin() {
    let query =
      'client_id=' +
      YO_CLIENT_ID +
      '&redirect_uri=' +
      YO_OAUTH_REDIRECT_URI +
      '&state=' +
      'state' +
      '&response_type=' +
      'code' +
      '&scope' +
      'profile';
    window.location.href = YO_OAUTH_AUTHORIZE_URL + '?' + query;
  }
  renderLogin() {
    return (
      <Button type="primary" icon="user" onClick={() => this.handleLogin()}>
        YOYO登录
      </Button>
    );
  }
  render() {
    const { info } = this.props;

    return (
      <div className="right-user-header-container">
        {!!info ? this.renderAvatar() : this.renderLogin()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: { info },
  } = state;
  return { info };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightUserHeader);
