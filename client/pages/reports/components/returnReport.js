/* 金额 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, DatePicker, Select } from '@alifd/next';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from 'bizcharts';
import Axios from 'axios';

import gold from '../../../static/gold.PNG';
import two from '../../../static/two.PNG';
import three from '../../../static/three.PNG';

const { Row, Col } = Grid;
const { YearPicker } = DatePicker;

export default class returnReport extends Component {
  static displayName = 'returnReport';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      yearSource: [],
    };
  }

  getReturnReport = async (value, year) => {
    Axios.post('/api/getReturnReport', {
      value, year, type: 'received',
    }).then(res => {
      const data = res.data.data;
      this.setState({
        data,
      });
    });
  }
  setYearSource = () => {
    const dataArr = [{ label: '过去12个月', value: '0' }];
    const data = new Date();
    for (let i = 0; i < 5; i++) {
      dataArr.push({
        label: `${data.getFullYear()}年`,
        value: `${data.getFullYear()}`,
      });
      data.setFullYear(data.getFullYear() - 1);
    }
    this.setState({
      yearSource: dataArr,
    });
  }

  onChange = (v) => {
    if (v === '0') {
      this.getReturnReport(0);
    } else {
      this.getReturnReport(1, v);
    }
  };
  async componentWillMount() {
    this.setYearSource();
    this.getReturnReport(0);
  }


  render() {
    const { data, yearSource } = this.state;
    return (
      <IceContainer>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>回款统计
            {/* <YearPicker /> */}
            <Select dataSource={yearSource} style={{ width: 150, marginLeft: 15 }} onChange={this.onChange} />
          </h2>

          <Row style={styles.formItem}>
            <Col span="24" style={styles.label}>
              <Chart height={window.innerHeight / 3} data={data} forceFit padding={[30, 40, 30, 60]}>
                <Axis name="month" />
                <Axis name="sum" />
                <Axis name="lastMonth" />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom
                  type="line"
                  position="month*sum"
                  size={2}
                  color="#2fc25b"
                  tooltip={
                    ['month*sum', (name, sum) => {
                    return {
                      name: '放款金额：',
                      value: `${sum}`,
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="month*sum"
                  size={2}
                  color="#2fc25b"
                  tooltip={
                    ['month*lastMonth', (name, lastMonth) => {
                    return {
                      name: '上月同期：',
                      value: `${lastMonth}`,
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="month*sum"
                  size={2}
                  color="#2fc25b"
                  tooltip={
                    ['sum*lastMonth', (sum, lastMonth) => {
                      const d = `${((sum - lastMonth) / lastMonth * 100).toFixed(2)}%`;
                      return {
                        name: '环比：',
                        value: lastMonth === 0 ? '无法计算' : d,
                      };
                  }]}
                />
                <Geom
                  type="line"
                  position="month*sum"
                  size={2}
                  color="#2fc25b"
                  tooltip={
                    ['month*lastYear', (name, lastYear) => {
                      return {
                        name: '去年同期：',
                        value: `${lastYear}`,
                      };
                  }]}
                />
                <Geom
                  type="line"
                  position="month*sum"
                  size={2}
                  color="#2fc25b"
                  tooltip={
                    ['sum*lastYear', (sum, lastYear) => {
                      const d = `${((sum - lastYear) / lastYear * 100).toFixed(2)}%`;
                      return {
                        name: '同比：',
                        value: lastYear === 0 ? '无法计算' : d,
                      };
                  }]}
                />
                <Geom
                  type="point"
                  position="month*sum"
                  size={4}
                  shape="circle"
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                  }}
                  color="#2fc25b"
                  tooltip={
                    ['name*sum', (name, sum) => {
                    return {
                      name: '放款金额',
                      value: `${sum}`,
                    };
                  }]}
                />
              </Chart>
            </Col>
          </Row>
        </div>
      </IceContainer>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  inputItem: {
    width: '100%',
  },
};
