import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Dropdown,
  Icon,
  Menu,
  Table,
  Badge,
  Divider,
  Card,
} from 'antd';
import { PageHeader, DescriptionList } from 'ant-design-pro';
import { WEBSOCKET_LABOR_DEPLOY_PROCESS_MODULE } from '../websocket/redux/constants';
import StatusConverter from './utils/statusConverter';
import { connectWebsocket } from '../websocket/redux/connectWebsocket';
import { getDeployDetail } from './redux/getDeployDetail';
import './MainDeployDetailCard.css';

const { Description } = DescriptionList;
const { Column } = Table;
const ButtonGroup = Button.Group;

class MainDeployDetailCard extends React.PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      connectWebsocket,
      getDeployDetail,
    } = this.props;

    getDeployDetail(id);
    this.websocket = connectWebsocket(id);
  }

  componentWillUnmount() {
    this.websocket.close();
  }

  renderDescription() {
    const {
      info: {
        detail: { user, should_push_ding, created_at },
        detailItems,
      },
    } = this.props;
    return (
      <DescriptionList size="small" col="2">
        <Description term="负责人">
          {!!user ? user.nickname : '未知'}
        </Description>
        <Description term="允许发送钉钉">
          {should_push_ding ? '是' : '否'}
        </Description>
        <Description term="创建时间">
          {new Date(created_at).toLocaleDateString()}
        </Description>
        <Description term="组件数量">{detailItems.length}</Description>
      </DescriptionList>
    );
  }

  renderExtra() {
    const {
      info: {
        detail: { status },
      },
    } = this.props;
    const statusConverter = new StatusConverter(status);
    return (
      <Row>
        <Col xs={24} sm={12}>
          <div className="mddc-header-extra-title">状态</div>
          <div className="mddc-header-extra-text">{statusConverter.text}</div>
        </Col>
      </Row>
    );
  }

  renderAction() {
    const menu = (
      <Menu>
        <Menu.Item key="cancel">取消发布</Menu.Item>
        <Menu.Item key="validate-version">校验组件版本</Menu.Item>
        <Menu.Item key="save-version">保存组件版本</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <ButtonGroup>
          {/* <Button>操作</Button> */}
          {/* <Dropdown placement="bottomRight"> */}
          {/* </Dropdown> */}
        </ButtonGroup>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button>
            <Icon type="ellipsis" />
          </Button>
        </Dropdown>
        <Button type="primary">自动发布</Button>
      </div>
    );
  }

  getDataSource() {
    const {
      info: { detailItems, detailById },
    } = this.props;
    if (!detailItems) return [];
    return detailItems.map(id => {
      let item = detailById[id];
      return { ...item, statusConverter: new StatusConverter(item.status) };
    });
  }

  handlePublish = item => {
    console.log(item);
  };

  render() {
    const {
      info: {
        detail: { name },
      },
    } = this.props;
    const dataSource = this.getDataSource();
    return (
      <div>
        <PageHeader
          title={name || ' '}
          content={this.renderDescription()}
          action={this.renderAction()}
          extraContent={this.renderExtra()}
        />
        <div className="hl-no-padding-content">
          <Card title="发布组件" bordered={false}>
            <Table
              dataSource={dataSource}
              rowKey={item => item.id}
              pagination={false}
            >
              <Column title="ID" dataIndex="id" />
              <Column title="名称" dataIndex="name" />
              <Column title="分支" dataIndex="ref" />
              <Column
                title="负责人"
                dataIndex="owner"
                render={owner => <div>{owner || '未知'}</div>}
              />
              <Column
                title="状态"
                dataIndex="statusConverter"
                render={status => {
                  return <Badge status={status.badge} text={status.text} />;
                }}
              />
              <Column title="版本" dataIndex="version" />
              <Column
                title="操作"
                key="action"
                render={item => {
                  return (
                    <span>
                      <a onClick={() => this.handlePublish(item)}>发布</a>
                      <Divider type="vertical" />
                      <Dropdown
                        overlay={
                          <Menu onClick={({ key }) => console.log(key)}>
                            <Menu.Item key="delete">删除</Menu.Item>
                          </Menu>
                        }
                      >
                        <a>
                          更多 <Icon type="down" />
                        </a>
                      </Dropdown>
                      {/* <a href="javascript:;">Delete</a> */}
                    </span>
                  );
                }}
              />
            </Table>
          </Card>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { deploys } = state;
  return { info: deploys };
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
    getDeployDetail: id => dispatch(getDeployDetail(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDeployDetailCard);

{
  /* <div className="main-deploy-detail-card-row">
          <p className="main-deploy-detail-card-title">标题</p>
          <div className="main-deploy-detail-card-auto-publish-button">
            <Button type="primary">自动发布</Button>
          </div>
        </div>
        <div className="main-deploy-detail-card-row">
          <div className="mddc-header-desc-content">
            <Row gutter={32}>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
            </Row>
          </div>
          <div className="mddc-header-desc-extra-content">状态</div>
        </div> */
}
