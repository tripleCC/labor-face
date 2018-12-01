import React, { Component } from 'react';
import { Table, Form, Select, Button, Col, Row, Input } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDeployList } from './redux/getDeployList';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;

class MainDeployList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getDeployList(1);
  }

  getDeployList(page) {
    this.props.getDeployList(page);
  }

  getDataSource() {
    const { items, byId } = this.props.list;
    if (!items) return [];
    return items.map(id => byId[id]);
  }

  handlePageChange = (page, _) => this.getDeployList(page);

  getTotalText = total => `共 ${total} 条`;

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.getDeployList(1, fieldsValue);
      console.log(fieldsValue);
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
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
          <Col md={8} sm={24}>
            <FormItem>
              <Button type="primary" htmlType="submit" disabled={loading}>
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const dataSource = this.getDataSource();

    const { loading, perPage, total } = this.props.list;

    const pagination = {
      showQuickJumper: true,
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
    };

    return (
      <div>
        {this.renderSearchCard()}
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={pagination}
        >
          <Column title="ID" dataIndex="id" />
          <Column title="名称" dataIndex="name" />
          <Column title="仓库" dataIndex="repo_url" />
          <Column title="分支" dataIndex="ref" />
          <Column
            title="Action"
            key="action"
            render={() => (
              <span>
                {/* <a href="javascript:;">Invite {record.lastName}</a> */}
                {/* <Divider type="vertical" /> */}
                {/* <a href="javascript:;">Delete</a> */}
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { deploys } = state;
  return { list: deploys };
}

function mapDispatchToProps(dispatch) {
  return {
    getDeployList: page => dispatch(getDeployList(page)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form.create()(MainDeployList)),
);
