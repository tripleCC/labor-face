import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import RightUserHeader from '../user/RightUserHeader';
import './HomeLayout.css';

const { Header, Sider, Content } = Layout;

class HomeLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const {
      location: { pathname },
    } = this.props;
    const matchPathname = `/${pathname.split("/", 2)[1]}`

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" selectedKeys={[matchPathname]}>
            <Menu.Item key="/deploys">
              <Link to="/deploys">
                <Icon type="hdd" />
                <span>组件发板</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="hdd" />
              <span>操作记录</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <RightUserHeader />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(HomeLayout);
