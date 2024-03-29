const statusTextMapper = {
  created: '待分析',
  analyzing: '分析中',
  waiting: '待发布',
  preparing: '准备中',
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
  ['processing', ['deploying', 'analyzing', 'merged', 'preparing']],
  ['default', ['created', 'canceled', 'skipped']],
  ['error', ['failed']],
  ['warning', ['pending', 'waiting']],
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

  isFailed() {
    return this.status === 'failed'
  }

  canPublish() {
    return this.status === 'waiting'
  }

  getHasDetail() {
    return this.status !== 'created'
  }

  getCanCancel() {
    return ['pending', 'merged', 'deploying', 'preparing'].includes(this.status)
  }

  getCanRetry() {
    return ['failed', 'canceled', 'skipped'].includes(this.status)
  }
}

export default StatusConverter;
