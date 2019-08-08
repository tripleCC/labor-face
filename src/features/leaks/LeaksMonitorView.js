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
  AutoComplete,
  Input
} from 'antd';

import { withRouter } from 'react-router';
import { getLeakInfos } from './redux/getLeakInfos';
import { addLeakComment } from './redux/addLeakComment';
import { fixLeakInfo } from './redux/fixLeakInfo';
import './LeaksMonitorView.css';
import AddLeakCommentModal from './AddLeakCommentModal';

const { Column } = Table;
const FormItem = Form.Item;
const { TextArea } = Input;

class LeaksMonitorView extends Component {
  state = {
    addModalVisible: false,
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
  handleAddModalVisible = (flag, itemId = null) => {
    const { logined } = this.props;
    if (logined) {
      this.setState({
        itemId,
        addModalVisible: !!flag,
      });
    } else {
      message.warn('登录后才能执行此操作');
    }
  };

  handleAdd = fieldsValue => {
    var content = `变更链接: ${fieldsValue.commit_url}`;
    if (fieldsValue.content) {
      content += `\n变更备注: ${fieldsValue.content.replace(/\n|\r/g, " ")}`;
    }
    console.log(content);
    this.props.addLeakComment(this.state.itemId, content, () => {
      this.changeLeakStatus(this.state.itemId);
      this.handleAddModalVisible(false);
    })
    // fieldsValue.content;
  };

  render() {
    const {
      leaks: {
        loading,  perPage, total, items,
      }
    } = this.props;

    const pagination = {
      showQuickJumper: true,
      pageSize: perPage,
      total: total,
      showTotal: this.getTotalText,
      onChange: this.handlePageChange,
    };
    const { addModalVisible } = this.state;
    return (
      <div className="hl-padding-content">
        {/* <div className="main-deploy-list-search">{this.renderSearchCard()}</div> */}
        <Table
          dataSource={items}
          rowKey={item => item.updated_at}
          loading={loading}
          pagination={pagination}
        >
          <Column title="ID" dataIndex="id" />
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
                  placement="left"
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
            }}
          />
          <Column title="版本" dataIndex="app_info.version" />
          <Column title="备注" dataIndex="comments" 
            render={comments => {
              return comments && comments.length ? (
                <Popover
                  placement="left"
                  title="备注内容"
                  content={
                    <pre>
                      {comments
                        ? comments.map((c) => `【${c.user_name}】${c.content}`).join("\n")
                        : '无'}
                    </pre>
                  }
                >
                  <a target="_blank">{`${comments.length}条`}</a>
                </Popover>
              ) : (
                <div>无</div>
              );
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
                    onConfirm={() => this.handleAddModalVisible(true, item.id)}
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
        <AddLeakCommentModal
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
    leaks,
    user: { logined },
  } = state;

  return { leaks, logined };
}

function mapDispatchToProps(dispatch) {
  return {
    // getLeakInfosList: (page, appName) => dispatch(getLeakInfos(page, 'TDFAppMonitor_Example')),
    getLeakInfosList: (page, appName) => dispatch(getLeakInfos(page, '二维火掌柜')),
    fixLeakInfo: (id, callback) => dispatch(fixLeakInfo(id, callback)),
    addLeakComment: (id, content, callback) => dispatch(addLeakComment(id, content, callback)),
  };
}

export default withRouter(
  connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(LeaksMonitorView))
);
