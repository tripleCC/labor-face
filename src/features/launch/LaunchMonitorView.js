import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
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
import { max } from 'moment';

class LaunchMonitorView extends Component {
  componentDidMount() {
    this.props.getLaunchInfos()
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
      return new Date(parseInt(text)).toLocaleDateString('en-GB');
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
              "gender*time*date",
              (gender, time, date) => {
                return {
                  name: gender,
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
      gender: '+Load总耗时',
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
      gender: 'WillLaunch-DidLaunch',
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
      gender: '进程启动-DidLaunch',
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

  render() {
    return (
      <div>
        {this.renderStartDid()}
        {this.renderLoad()}
        {this.renderWillDid()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { infos } = state.launch
  return { infos };
}

function mapDispatchToProps(dispatch) {
  return {
    getLaunchInfos: (appName, osName, deviceName) => dispatch(getLaunchInfos('二维火掌柜', 'iOS')),
  };
}

export default withRouter(
  connect(
  mapStateToProps,
  mapDispatchToProps,
)(LaunchMonitorView)
);
