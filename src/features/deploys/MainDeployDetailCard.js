import React from 'react';
import { connect } from 'react-redux';
import semver from 'semver';
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
  message,
  Popconfirm,
  Modal,
  Popover,
  Input,
} from 'antd';
import { PageHeader, DescriptionList } from 'ant-design-pro';
import StatusConverter from './utils/statusConverter';
import { connectWebsocket } from './redux/processDeployMessage';
import { getDeployDetail } from './redux/getDeployDetail';
import { manualPodDeploy } from './redux/manualPodDeploy';
import { enqueuePodDeploy } from './redux/enqueuePodDeploy';
import { cancelPodDeploy } from './redux/cancelPodDeploy';
import { cancelDeploy } from './redux/cancelDeploy';
import { startDeploy } from './redux/startDeploy';
import { updatePodVersions } from './redux/updatePodVersions';
import './MainDeployDetailCard.css';

const { Description } = DescriptionList;
const { Column } = Table;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

class MainDeployDetailCard extends React.Component {
  state = {
    editedItems: new Map(),
  };

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

  componentDidUpdate(prevProps) {
    const {
      info: { error },
    } = this.props;
    if (!prevProps.error && error) {
      message.error(error);
    }
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
          {!!created_at ? new Date(created_at).toLocaleDateString() : '未知'}
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

  handHeaderAction = key => {
    const {
      info: {
        detail: { id },
      },
      cancelDeploy,
    } = this.props;
    switch (key) {
      case 'cancel':
        confirm({
          title: '确认取消发布?',
          content: '其下所有可取消组件都将取消发布',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            cancelDeploy(id);
          },
        });
        break;
      default:
        break;
    }
  };

  renderAction() {
    const {
      info: {
        detail: { id, status },
      },
      startDeploy,
    } = this.props;

    const menu = (
      <Menu onClick={({ key }) => this.handHeaderAction(key)}>
        <Menu.Item key="cancel">取消发布</Menu.Item>
        <Menu.Item key="validate-version">校验组件版本</Menu.Item>
        <Menu.Item key="save-version">保存组件版本</Menu.Item>
      </Menu>
    );

    const statusConverter = new StatusConverter(status);

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
        {statusConverter.getCanRetry() ? (
          <Button type="primary" onClick={() => startDeploy(id)}>
            重试
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => startDeploy(id)}
            disabled={!statusConverter.canPublish()}
          >
            自动发布
          </Button>
        )}
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

  handleManual = item => {
    const {
      info: {
        detail: { id },
      },
      manualPodDeploy,
    } = this.props;

    manualPodDeploy(id, item.id, () => {
      message.success(`【${item.name}】标记为成功!`);
    });
  };

  handlePublish = item => {
    const {
      info: {
        detail: { id },
      },
      enqueuePodDeploy,
    } = this.props;

    enqueuePodDeploy(id, item.id, () => {
      message.success(`开始发布【${item.name}】!`);
    });
  };

  handleCancel = item => {
    const {
      info: {
        detail: { id },
      },
      cancelPodDeploy,
    } = this.props;

    cancelPodDeploy(id, item.id, () => {
      message.success(`【${item.name}】取消成功!`);
    });
  };

  handleMoreClick = (key, item) => {
    switch (key) {
      case 'edit':
        const { editedItems } = this.state;
        editedItems.set(item.id, item);
        this.setState({ editedItems: editedItems });
        break;
      default:
        break;
    }
  };

  handleFieldChange = (e, fieldName, key) => {
    const { editedItems } = this.state;
    const item = editedItems.get(key);
    item[fieldName] = e.target.value;
    this.setState({ editedItems: editedItems });
  };

  handleKeyPress = (e, key) => {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  };

  saveRow(e, key) {
    const { updatePodVersions } = this.props;
    const { editedItems } = this.state;
    const item = editedItems.get(key);

    if (!semver.valid(item.version)) {
      message.warning(`【${item.name}】版本【${item.version}】不符合 Sematic Versioning!`)
      return;
    }
    updatePodVersions(
      {
        [key]: item.version,
      },
      () => {
        editedItems.delete(key);
        this.setState({ editedItems: editedItems });
        message.success(`更新【${item.name}】版本成功!`);
      },
    );
  }

  cancelRow(e, key) {
    const { editedItems } = this.state;
    editedItems.delete(key);
    this.setState({ editedItems: editedItems });
  }

  render() {
    const {
      info: {
        detail: { name },
        loading,
      },
    } = this.props;
    const { editedItems } = this.state;
    const editedItemIds = [...editedItems.keys()];
    const dataSource = this.getDataSource().map(item => {
      return editedItemIds.includes(item.id)
        ? { ...editedItems.get(item.id), editable: true }
        : { ...item, editable: false };
    });

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
              loading={loading}
            >
              <Column title="ID" dataIndex="id" />
              <Column
                title="名称"
                key="name"
                render={item => {
                  return (
                    <Popover
                      placement="top"
                      title="依赖发布组件"
                      content={
                        <div className="mddc-popover">
                          {item.external_dependency_names.length
                            ? item.external_dependency_names.map(name => {
                                return `【${name}】`;
                              })
                            : '无'}
                        </div>
                      }
                    >
                      {item.name}
                    </Popover>
                  );
                }}
              />
              <Column title="分支" dataIndex="ref" />
              <Column
                title="负责人"
                dataIndex="owner"
                render={owner => <div>{owner || '未知'}</div>}
              />
              <Column
                title="状态"
                key="status"
                render={item => {
                  const badge = (
                    <Badge
                      status={item.statusConverter.badge}
                      text={item.statusConverter.text}
                    />
                  );
                  return item.statusConverter.isFailed() ? (
                    <Popover
                      placement="top"
                      title={'错误原因'}
                      content={
                        <div className="mddc-popover">
                          {item.failure_reason}
                        </div>
                      }
                    >
                      {badge}
                    </Popover>
                  ) : (
                    badge
                  );
                  // return <Badge status={status.badge} text={status.text} />;
                }}
              />
              <Column
                title="版本"
                dataIndex="version"
                render={(version, item) => {
                  if (item.editable) {
                    return (
                      <Input
                        value={version}
                        autoFocus
                        onChange={e =>
                          this.handleFieldChange(e, 'version', item.id)
                        }
                        onKeyPress={e => this.handleKeyPress(e, item.id)}
                        placeholder="Semantic Versioning"
                      />
                    );
                  }
                  return version;
                }}
              />
              <Column
                title="操作"
                key="action"
                render={item => {
                  if (item.editable) {
                    return (
                      <span>
                        <a onClick={e => this.saveRow(e, item.id)}>保存</a>
                        <Divider type="vertical" />
                        <a onClick={e => this.cancelRow(e, item.id)}>取消</a>
                      </span>
                    );
                  }
                  return (
                    <span>
                      {item.statusConverter.getCanCancel() ? (
                        <Popconfirm
                          title="确认取消发布?"
                          cancelText="取消"
                          okText="确定"
                          onConfirm={() => this.handleCancel(item)}
                        >
                          <a>取消</a>
                        </Popconfirm>
                      ) : (
                        <a onClick={() => this.handlePublish(item)}>
                          {item.statusConverter.getCanRetry() ? '重试' : '发布'}
                        </a>
                      )}
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确认标记为发布成功?"
                        cancelText="取消"
                        okText="确定"
                        onConfirm={() => this.handleManual(item)}
                      >
                        <a href="#">标记成功</a>
                      </Popconfirm>
                      <Divider type="vertical" />
                      <Dropdown
                        overlay={
                          <Menu
                            onClick={({ key }) =>
                              this.handleMoreClick(key, item)
                            }
                          >
                            <Menu.Item key="edit">编辑</Menu.Item>
                          </Menu>
                        }
                      >
                        <a>
                          更多 <Icon type="down" />
                        </a>
                      </Dropdown>
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
    updatePodVersions: (params, callback) =>
      dispatch(updatePodVersions(params, callback)),
    startDeploy: (id, callback) => dispatch(startDeploy(id, callback)),
    cancelDeploy: (id, callback) => dispatch(cancelDeploy(id, callback)),
    cancelPodDeploy: (id, pid, callback) =>
      dispatch(cancelPodDeploy(id, pid, callback)),
    enqueuePodDeploy: (id, pid, callback) =>
      dispatch(enqueuePodDeploy(id, pid, callback)),
    connectWebsocket: id => connectWebsocket(dispatch, id),
    getDeployDetail: id => dispatch(getDeployDetail(id)),
    manualPodDeploy: (id, pid, callback) =>
      dispatch(manualPodDeploy(id, pid, callback)),
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
