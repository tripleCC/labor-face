import React from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

class AddLeakCommentModal extends React.PureComponent {
  handleAdd = () => {
    const { form, handleAdd } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      handleAdd(fieldsValue);
    });
  };

  render() {
    const {
      handleAddModalVisible,
      modalVisible,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <Modal
        destroyOnClose
        title="添加备注"
        cancelText="取消"
        okText="确定"
        confirmLoading={loading}
        visible={modalVisible}
        onOk={this.handleAdd}
        onCancel={() => handleAddModalVisible()}
      >
        <FormItem {...formItemLayout} label="提交链接">
          {getFieldDecorator('commit_url', {
            rules: [
              {
                required: true,
                pattern: /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\/)?/,
                message: '请输入有效 commit 链接！',
              },
            ],
          })(
            <Input
              // addonBefore="git@git.2dfire-inc.com:"
              // addonAfter=".git"
              placeholder="请输入 commit 链接"
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注内容">
          {getFieldDecorator('content', {
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(AddLeakCommentModal);
