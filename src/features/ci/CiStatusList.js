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
  AutoComplete,
} from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCiStatusList } from './redux/getCiStatusList';
import './CiStatusList.css';

const { Column } = Table;
const FormItem = Form.Item;
const { Option } = Select;

class CiStatusList extends Component {
  state = {
    addModalVisible: false,
    teams: [],
    owners: [],
  };

  perPage = 10;
  query = {};

  componentDidMount() {
    this.getCiStatusList();
  }

  componentDidUpdate(prevProps) {
    const {
      info: { error },
    } = this.props;
    if (!prevProps.info.error && error) {
      message.error(error);
    }
  }

  getDataSource() {
    const { items, byId } = this.props.info;
    if (!items) return [];
    return items.map(id => {
      let item = byId[id];
      return { ...item };
    });
  }

  renderSearchCard() {
    const {
      form: { getFieldDecorator },
      info: { loading, teams, owners },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="组件名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入组件名称" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="业务组">
              {getFieldDecorator('team')(
                <AutoComplete
                  dataSource={
                    this.state.teams.length > 0 ? this.state.teams : teams
                  }
                  onSearch={value => {
                    this.setState({
                      teams: value
                        ? teams.filter(team => team.includes(value))
                        : teams,
                    });
                  }}
                  placeholder="请输入业务组"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="负责人">
              {getFieldDecorator('owner')(
                <AutoComplete
                  dataSource={
                    this.state.owners.length > 0 ? this.state.owners : owners
                  }
                  onSearch={value => {
                    this.setState({
                      owners: value
                        ? owners.filter(owner => owner.includes(value))
                        : owners,
                    });
                  }}
                  placeholder="请输入负责人"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.query = fieldsValue;
      this.getCiStatusList();
    });
  };

  handleSearchReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.query = {};
    this.getCiStatusList();
  };

  getCiStatusList(page = 1) {
    this.props.getCiStatusList(page, this.query, this.perPage);
  }

  handlePageChange = (page, _) => {
    const { perPage } = this.props.info;
    this.perPage = perPage;
    this.getCiStatusList(page);
  };

  handleSizeChange = (current, size) => {
    if (current !== size) {
      this.perPage = size;
      this.getCiStatusList();
    }
  };
  getTotalText = total => `共 ${total} 条`;

  render() {
    const dataSource = this.getDataSource();

    const {
      info: { loading, perPage, total },
    } = this.props;

    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '40', '80', '160'],
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handleSizeChange,
    };

    return (
      <div className="hl-padding-content">
        <div className="ci-status-list-search">{this.renderSearchCard()}</div>
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={pagination}
        >
          <Column title="ID" dataIndex="id" />
          <Column
            title="名称"
            dataIndex="name"
            render={(name, item) => {
              return <a href={item.web_url} target="_blank">{name}</a>;
            }}
          />
          <Column title="负责人" dataIndex="owner" />
          <Column
            title="业务组"
            dataIndex="team"
            render={name => {
              return <span>{name || '未知'}</span>;
            }}
          />
          <Column
            title="CI状态"
            dataIndex="pipeline_url"
            render={(url, item) => {
              return (
                <a href={item.master_url} target="_blank">
                  <img alt="pipeline status" src={url} />
                </a>
              );
            }}
          />
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { ci } = state;

  return { info: ci };
}

function mapDispatchToProps(dispatch) {
  return {
    getCiStatusList: (page, query, perPage) =>
      dispatch(getCiStatusList(page, query, perPage)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form.create()(CiStatusList)),
);
