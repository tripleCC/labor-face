import React, { Component } from 'react';
import {
  Table,
  Form,
  Select,
  Button,
  Col,
  Row,
  Input,
  message,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Modal,
  Badge,
} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDeployList } from './redux/getDeployList';
import { addDeploy } from './redux/addDeploy';
import AddMainDeployModal from './AddMainDeployModal';
import StatusConverter from './utils/statusConverter';
import './MainDeployList.css';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;
const confirm = Modal.confirm;

class MainDeployList extends Component {
  state = {
    addModalVisible: false,
  };

  componentDidMount() {
    this.getDeployList();
  }

  componentDidUpdate(prevProps) {
    const {
      list: { error },
    } = this.props;
    if (!prevProps.error && error) {
      message.error(error);
    }
  }

  getDeployList(page = 1, query = {}) {
    this.props.getDeployList(page, query);
  }

  getDataSource() {
    const { items, byId } = this.props.list;
    if (!items) return [];
    return items.map(id => {
      let item = byId[id];
      return { ...item, statusConverter: new StatusConverter(item.status) };
    });
  }

  handlePageChange = (page, _) => this.getDeployList(page);

  getTotalText = total => `共 ${total} 条`;

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.getDeployList(1, fieldsValue);
    });
  };

  handleSearchReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState({
      searchValues: {},
    });
  };

  renderSearchCard() {
    const {
      form: { getFieldDecorator },
      list: { loading },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status', {
                initialValue: '0',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              <span>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  查询
                </Button>
                <Button
                  disabled={loading}
                  style={{ marginLeft: 8 }}
                  onClick={this.handleSearchReset}
                >
                  重置
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  handleAddModalVisible = flag => {
    const { logined } = this.props;
    if (logined) {
      this.setState({
        addModalVisible: !!flag,
      });
    } else {
      message.warn('登录后才能执行此操作');
    }
  };

  handleAdd = fieldsValue => {
    this.props.addDeploy(fieldsValue, () => {
      message.success('新建发布成功!');
      this.getDeployList();
      this.handleAddModalVisible(false);
    });
  };

  handleAnalyze = item => {
    if (item.statusConverter.hasDetail()) {
      confirm({
        title: '确认重新分析依赖?',
        content:
          '重新分析依赖关系会覆盖旧发布信息，其下所有组件发布状态都将重置为待分析状态',
        okText: '确定',
        cancelText: '取消',
        onOk() {},
      });
    } else {
    }
  };

  render() {
    const dataSource = this.getDataSource();

    const { loading, perPage, total } = this.props.list;
    const { addModalVisible } = this.state;

    const pagination = {
      showQuickJumper: true,
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
    };

    return (
      <div>
        <div className="main-deploy-list-search">{this.renderSearchCard()}</div>
        <div className="main-deploy-list-add-button">
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleAddModalVisible(true)}
          >
            新建
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={pagination}
          // onChange=
        >
          <Column title="ID" dataIndex="id" />
          <Column title="名称" dataIndex="name" />
          <Column title="仓库" dataIndex="repo_url" />
          <Column title="分支" dataIndex="ref" />
          <Column title="负责人" dataIndex="user.nickname" />
          <Column
            title="状态"
            dataIndex="statusConverter"
            render={status => {
              return <Badge status={status.badge} text={status.text} />;
            }}
          />
          <Column
            title="操作"
            key="action"
            render={item => {
              return (
                <span>
                  {item.statusConverter.hasDetail() && (
                    <span>
                      <Link to={`/deploys/${item.id}`}>详情</Link>
                      <Divider type="vertical" />
                    </span>
                  )}
                  <a onClick={() => this.handleAnalyze(item)}>分析</a>
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
        <AddMainDeployModal
          modalVisible={addModalVisible}
          handleAdd={this.handleAdd}
          handleAddModalVisible={this.handleAddModalVisible}
          loading={loading}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    deploys,
    user: { logined },
  } = state;
  return { list: deploys, logined };
}

function mapDispatchToProps(dispatch) {
  return {
    getDeployList: (page, query) => dispatch(getDeployList(page, query)),
    addDeploy: (params, callback) => dispatch(addDeploy(params, callback)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form.create()(MainDeployList)),
);
