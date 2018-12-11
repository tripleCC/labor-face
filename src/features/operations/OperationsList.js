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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getOperationList } from './redux/getOperationList';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;
const confirm = Modal.confirm;

class OperationsList extends Component {
  state = {
    addModalVisible: false,
  };

  componentDidMount() {
    this.getOperationList();
  }

  componentDidUpdate(prevProps) {
    const {
      info: { error },
    } = this.props;
    if (!prevProps.error && error) {
      message.error(error);
    }
  }

  getOperationList = (page = 1, query = {}) => {
    this.props.getOperationList(page, query);
  };

  getDataSource() {
    const { items, byId } = this.props.info;
    if (!items) return [];
    return items.map(id => {
      let item = byId[id];
      return { ...item};
    });
  }

  handlePageChange = (page, _) => this.getOperationList(page);

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

  render() {
    const dataSource = this.getDataSource();

    const {
      info: { loading, perPage, total },
    } = this.props;

    const pagination = {
      showQuickJumper: true,
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
    };

    return (
      <div className="hl-padding-content">
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={pagination}
          // onChange=
        >
          <Column title="ID" dataIndex="id" />
          <Column title="名称" dataIndex="deploy.name" />
          <Column title="操作人" dataIndex="user.nickname" />
          <Column title="操作" dataIndex="name" />
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    operations,
    user: { logined },
  } = state;

  return { info: operations, logined };
}

function mapDispatchToProps(dispatch) {
  return {
    getOperationList: (page, query) => dispatch(getOperationList(page, query)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form.create()(OperationsList)),
);
