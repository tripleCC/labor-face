const statusTextMapper = {
  created: '待分析',
  analyzing: '分析中',
  skipped: '已忽略',
  pending: '等待中',
  merged: '已合并',
  deploying: '发布中',
  success: '发布成功',
  failed: '发布失败',
  canceled: '已取消',
};

const statusBadgeMapper = new Map([
  ['success', ['success']],
  ['processing', ['deploying', 'analyzing', 'merged']],
  ['default', ['created', 'canceled', 'skipped']],
  ['error', ['error']],
  ['warning', ['pending']],
]);

class StatusConverter {
  constructor(status) {
    this.status = status;
    this.text = this.getText();
    this.badge = this.getBadge();
  }

  getText() {
    const text = statusTextMapper[this.status];
    return !!text ? text : '未知';
  }

  getBadge() {
    for (let [key, value] of statusBadgeMapper) {
      if (value.filter(status => this.status === status).length > 0) {
        return key;
      }
    }
    return 'default';
  }
}

export default StatusConverter;
