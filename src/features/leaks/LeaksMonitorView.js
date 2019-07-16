import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Button,
  Col,
  Row,
  Popconfirm,
  message,
  Popover,
  AutoComplete
} from 'antd';
import { withRouter } from 'react-router';
import { getLeakInfos } from './redux/getLeakInfos';
import { fixLeakInfo } from './redux/fixLeakInfo';
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

  changeLeakStatus = (itemId) => {
    this.props.fixLeakInfo(itemId, () => {
      console.log('曾给');
    });
  }

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
          <Column title="循环引用" dataIndex="cycles" 
            render={cycles => {
               
              return cycles ? (
                <Popover
                  placement="top"
                  title="循环引用"
                  content={
                    <pre>
                      {cycles
                        ? cycles.split('+').join("\n---------------\n").split('|').join("\n  ")
                        : '无'}
                    </pre>
                  }
                >
                  <a target="_blank">{`${cycles.split('+').length}个`}</a>
                </Popover>
              ) : (
                <div>无</div>
              );
              // ( 
              //   <pre>{cycles ? cycles.split('+').join("\n") : ''}</pre> 
              // );
            }}
          />
          <Column title="操作"
            render={item => {
              if (item.active) {
                return (
                  <Popconfirm
                    title="确认标记为已解决?"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.changeLeakStatus(item.id)}
                  >
                    <a>变更状态</a>
                  </Popconfirm>
                )
              } else {
                return (
                  <div>{`已解决-${item.user.nickname}`}</div>
                )
              }
            }}
          />
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { items, loading } = state.leaks
  return { items, loading};
}

function mapDispatchToProps(dispatch) {
  return {
    // getLeakInfosList: (page, appName) => dispatch(getLeakInfos(page, 'TDFAppMonitor_Example')),
    getLeakInfosList: (page, appName) => dispatch(getLeakInfos(page, '二维火掌柜')),
    fixLeakInfo: (id, callback) => dispatch(fixLeakInfo(id, callback)),
  };
}

export default withRouter(
  connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(LeaksMonitorView))
);
