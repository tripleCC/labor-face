import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Button,
  Col,
  Row,
  Input,
  message,
  AutoComplete
} from 'antd';
import { withRouter } from 'react-router';
import { getLeakInfos } from './redux/getLeakInfos';
import './LeaksMonitorView.css';

const { Column } = Table;
const FormItem = Form.Item;

class LeaksMonitorView extends Component {
  state = {
  };

  componentDidMount() {
    this.getLeakInfosList();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (!prevProps.error && error) {
      message.error(error);
    }
  }
  
  getLeakInfosList = (page = 1, query = {}) => {
    this.props.getLeakInfosList(page, query);
  };

  handlePageChange = (page, _) => this.getLeakInfosList(page);

  render() {
    const {
      loading,  perPage, total, items,
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
        {/* <div className="main-deploy-list-search">{this.renderSearchCard()}</div> */}
        <Table
          dataSource={items}
          rowKey={item => item.trace}
          loading={loading}
          pagination={pagination}
        >
          <Column width='300px' title="类名" dataIndex="name" />
          <Column title="引用路径" dataIndex="trace" 
            render={trace => {
              return <pre>{trace.split('->').join("\n-> ")}</pre>;
            }}
          />
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
console.log(state)

  const { items, loading } = state.leaks
  return { items, loading};
}

function mapDispatchToProps(dispatch) {
  return {
    getLeakInfosList: (page, appName) => dispatch(getLeakInfos(page, '二维火掌柜')),
  };
}

export default withRouter(
  connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(LeaksMonitorView))
);
