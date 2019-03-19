/* 放款金额 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid } from '@alifd/next';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from 'bizcharts';
import Axios from 'axios';

import gold from '../../../static/gold.PNG';
import two from '../../../static/two.PNG';
import three from '../../../static/three.PNG';


const { Row, Col } = Grid;


export default class rebate extends Component {
  static displayName = 'rebate';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
    };
  }
  getRebate = async () => {
    Axios.get('/api/getRebate').then(res => {
      const data = res.data.rebate;
      const total = res.data.total;
      this.setState({
        data,
        total,
      });
    });
  }

  async componentWillMount() {
    this.getRebate();
  }

  render() {
    const imageMap = {
      1: `${gold}`,
      2: `${two}`,
      3: `${three}`,
    };
    const scale = {
      vote: {
        min: 0,
      },
    };
    const { data, total } = this.state;
    return (
      <IceContainer>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>返利</h2>

          <Row style={styles.formItem}>
            <Col xxs="6" s="6" l="6" style={styles.label}>
                总量：
            </Col>
            <Col s="12" l="10">
              <span>{total}</span>
            </Col>
          </Row>

          <Row style={styles.formItem}>
            <Col span="24" style={styles.label}>
              <Chart
                height={window.innerHeight / 2}
                data={data}
                padding={[60, 20, 40, 60]}
                scale={scale}
                forceFit
                placeholder
              >
                {/* <Axis
                  name="vote"
                  labels={null}
                  title={null}
                  line={null}
                  tickLine={null}
                /> */}
                <Axis name="vote" label={null} visible={false} />
                <Axis name="name" />
                <Geom
                  type="interval"
                  position="name*vote"
                  color={['name', ['#336666', '#996633', '#CCCC33', '#daf0fd']]}
                />
                <Tooltip />
                <Geom
                  type="point"
                  position="name*vote"
                  size={60}
                  shape={[
                    'index',
                    function (index) {
                      return ['image', imageMap[index]];
                    },
                  ]}
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
    marginBottom: 25,
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
