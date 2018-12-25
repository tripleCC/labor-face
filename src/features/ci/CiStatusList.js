import React, { Component } from 'react';
import { Table, Form, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getCiStatusList } from './redux/getCiStatusList';

const { Column } = Table;

class CiStatusList extends Component {
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
    if (!prevProps.info.error && error) {
      message.error(error);
    }
  }

  getOperationList = () => {
    this.props.getOperationList();
  };

  getDataSource() {
    const { items, byId } = this.props.info;
    if (!items) return [];
    return items.map(id => {
      let item = byId[id];
      return { ...item };
    });
  }

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
      info: { loading },
    } = this.props;

    return (
      <div className="hl-padding-content">
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={{ pageSize: 50 }}
        >
          <Column title="ID" dataIndex="id" />
          <Column title="名称" dataIndex="name" />
          <Column title="负责人" dataIndex="owner" />
          <Column
            title="业务组"
            dataIndex="team_name"
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
    getOperationList: (page, query) => dispatch(getCiStatusList()),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form.create()(CiStatusList)),
);
