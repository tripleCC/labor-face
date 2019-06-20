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
import { Charts } from 'ant-design-pro';
import { withRouter } from 'react-router';
import {   
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import { getLaunchInfos } from './redux/getLaunchInfos';
import { getDevices } from './redux/getDevices';
import { max } from 'moment';
import './LaunchMonitorView.css';

const { Column } = Table;
const FormItem = Form.Item;

class LaunchMonitorView extends Component {
  state = {
    apps: [],
    devices: [],
    oss: [],
  };

  componentDidMount() {
    this.props.getLaunchInfos();
    this.props.getDevices();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (!prevProps.error && error) {
      message.error(error);
    }
  }
  
  renderChart(infosData) {
    const label = {
      formatter(text, item, index) {
        let date =  new Date(parseInt(text))
        return `${date.getMonth()}/${date.getDate()}`
      }
    }
    return (
      <div>
        {infosData.length > 0 && (
          <Chart height={400} data={infosData} forceFit>
            <Tooltip
              showTitle={false}
              crosshairs={{
                type: "cross"
              }}
              itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/>{value}</li>"
            />
            <Axis name="date" label={label}/>
            <Axis name="time" />
            <Legend />
            <Geom
              type="point"
              position="date*time"
              color="gender"
              opacity={0.65}
              shape="circle"
              size={4}
              tooltip={[
                "time*date*devName",
                (time, date, devName) => {
                  return {
                    name: devName,
                    value: (new Date(date)).toLocaleString() + ", " + time + "(ms)"
                  };
                }
              ]}
            />
          </Chart>
          )}
      </div>
    )
  }

  renderLoad() {
    const { infos } = this.props
    const infosData = infos.map(info => {
      return {
        gender: '+Load总耗时(ms)',
        devName: info.device.simple_name,
        date: new Date(info.created_at),
        time: parseInt(info.load_total),
      }
    })

    return (
      <div>
        {this.renderChart(infosData)}
      </div>  
    )
  }
  renderWillDid() {
    const { infos } = this.props
    const infosData = infos.map(info => {
      return {
        gender: 'WillLaunch-DidLaunch(ms)',
        devName: info.device.simple_name,
        date: new Date(info.created_at),
        time: parseFloat(info.will_to_did),
      }
    })

    return (
      <div>
        {this.renderChart(infosData)}
      </div>  
    )
  }

  renderStartDid() {
    const { infos } = this.props
    const infosData = infos.map(info => {
      return {
        gender: '进程启动-DidLaunch(ms)',
        devName: info.device.simple_name,
        date: new Date(info.created_at),
        time: parseInt(info.start_to_did),
      }
    })

    return (
      <div>
        {this.renderChart(infosData)}
      </div>  
    )
  }

  handleSearchReset = () => {
    const { form } = this.props;
    form.resetFields();
    
    this.props.getLaunchInfos();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let deviceName = fieldsValue['device_name'];
      deviceName = deviceName !== '全部' ? deviceName : null;
      this.props.getLaunchInfos(fieldsValue['app_name'], 'iOS', deviceName);
    });
  };

  renderSearchView() {
    const {
      form: { getFieldDecorator },
      loading, apps, oss, devices,
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="App名称">
              {getFieldDecorator('app_name', {
                initialValue: '二维火掌柜',
              })(
                <AutoComplete
                  dataSource={
                    this.state.apps.length > 0 ? this.state.apps : apps
                  }
                  placeholder="请输入App名称"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备类型">
              {getFieldDecorator('device_name', {
                initialValue: '全部',
              })(
                <AutoComplete
                  dataSource={
                    this.state.devices.length > 0 ? this.state.devices : devices
                  }
                  placeholder="请输设备类型"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              <span>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  查询
                </Button>
                <Button
                  disabled={loading}
                  style={{ marginLeft: 8 }}
                  onClick={this.handleSearchReset}
                >
                  重置
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className="hl-padding-content">
        <div className="launch-monitor-view-search">
          {this.renderSearchView()}
        </div>  
        {this.renderStartDid()}
        {this.renderLoad()}
        {this.renderWillDid()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { infos, loading, devices } = state.launch
  return { infos, loading, devices };
}

function mapDispatchToProps(dispatch) {
  return {
    getLaunchInfos: (appName, osName, deviceName) => dispatch(getLaunchInfos('二维火掌柜', 'iOS', deviceName)),
    getDevices: () => dispatch(getDevices()),
  };
}

export default withRouter(
  connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(LaunchMonitorView))
);
