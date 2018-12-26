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

  // handleSearch = e => {
  //   e.preventDefault();

  //   const { form } = this.props;
  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;

  //     this.getDeployList(1, fieldsValue);
  //   });
  // };

  // handleSearchReset = () => {
  //   const { form } = this.props;
  //   form.resetFields();

  //   this.setState({
  //     searchValues: {},
  //   });
  // };

  getCiStatusList(page, query, perPage) {
    this.props.getCiStatusList(page, query, perPage);
  }

  handlePageChange = (page, _) => {
    const { perPage } = this.props.info;
    this.getCiStatusList(page, {}, perPage);
  };
  handleSizeChange = (current, size) => {
    if (current !== size) {
      console.log(size);
      this.getCiStatusList(1, {}, size);
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
      pageSizeOptions: ['10', '20', '40', '60'],
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handleSizeChange,
    };

    return (
      <div className="hl-padding-content">
        <Table
          dataSource={dataSource}
          rowKey={item => item.id}
          loading={loading}
          pagination={pagination}
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
