import React from 'react';
import { Modal, Form, Input, message } from 'antd';

const FormItem = Form.Item;

class AddMainDeployModal extends React.PureComponent {
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
        title="新建发布"
        cancelText="取消"
        okText="确定"
        confirmLoading={loading}
        visible={modalVisible}
        onOk={this.handleAdd}
        onCancel={() => handleAddModalVisible()}
      >
        <FormItem {...formItemLayout} label="发布名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入至少五个字符的发布名称！',
                min: 5,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="仓库路径">
          {getFieldDecorator('repo_url', {
            rules: [
              {
                required: true,
                pattern: /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/,
                message: '请输入有效仓库路径！',
              },
            ],
          })(
            <Input
              // addonBefore="git@git.2dfire-inc.com:"
              // addonAfter=".git"
              placeholder="请输入"
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="分支名称">
          {getFieldDecorator('ref', {
            rules: [{ required: true, message: '请输入分支名称！' }],
            // initialValue: 'release/',
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(AddMainDeployModal);
