import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDeployList } from './redux/getDeployList';

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

  handlePageChange = (page, _) => this.getDeployList(page)
  getTotalText = total => `共 ${total} 条`

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
    );
  }
}

function mapStateToProps(state) {
  const { deploys } = state;
  return { list: deploys };
}

function mapDispatchToProps(dispatch) {
  return {
    getDeployList: (page) => dispatch(getDeployList(page)),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MainDeployList),
);
