import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Dropdown, Icon } from 'antd';
import { PageHeader, DescriptionList } from 'ant-design-pro';
import { WEBSOCKET_LABOR_DEPLOY_PROCESS_MODULE } from '../websocket/redux/constants';
import { connectWebsocket } from '../websocket/redux/connectWebsocket';
import { getDeployDetail } from './redux/getDeployDetail';
import './MainDeployDetailCard.css';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

class MainDeployDetailCard extends React.PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      connectWebsocket,
      getDeployDetail,
    } = this.props;
    this.websocket = connectWebsocket(id);
    getDeployDetail();
  }

  componentWillUnmount() {
    this.websocket.close();
  }

  renderDescription() {
    return (
      <DescriptionList size="small" col="2">
        <Description term="创建人">曲丽丽</Description>
        <Description term="订购产品">XX 服务</Description>
        <Description term="创建时间">2017-07-07</Description>
        <Description term="关联单据">
          <a href="">12421</a>
        </Description>
      </DescriptionList>
    );
  }

  renderAction() {
    return (
      <div>
        <ButtonGroup>
          <Button>操作</Button>
          <Button>操作</Button>
          {/* <Dropdown placement="bottomRight"> */}
          <Button>
            <Icon type="ellipsis" />
          </Button>
          {/* </Dropdown> */}
        </ButtonGroup>
        <Button type="primary">自动发布</Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <PageHeader
          title="1231342341"
          content={this.renderDescription()}
          action={this.renderAction()}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { common } = state;
  return { common };
}

function mapDispatchToProps(dispatch) {
  return {
    connectWebsocket: id => {
      return connectWebsocket(
        dispatch,
        WEBSOCKET_LABOR_DEPLOY_PROCESS_MODULE,
        id,
      );
    },
    getDeployDetail: () => getDeployDetail(),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDeployDetailCard);

{
  /* <div className="main-deploy-detail-card-row">
          <p className="main-deploy-detail-card-title">标题</p>
          <div className="main-deploy-detail-card-auto-publish-button">
            <Button type="primary">自动发布</Button>
          </div>
        </div>
        <div className="main-deploy-detail-card-row">
          <div className="mddc-header-desc-content">
            <Row gutter={32}>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
              <Col {...{ xs: 24, sm: 12 }}>
                <span>
                  <div className="mddc-header-desc-content-title">标题1</div>
                  <div className="mddc-header-desc-content-value">值1</div>
                </span>
              </Col>
            </Row>
          </div>
          <div className="mddc-header-desc-extra-content">状态</div>
        </div> */
}
