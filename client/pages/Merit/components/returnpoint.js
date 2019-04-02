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


export default class returnPoint extends Component {
  static displayName = 'returnPoint';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
    };
  }
  getReturnPoint = async () => {
    Axios.get('/api/getReturnPoint').then(res => {
      const data = res.data.returnPoint;
      const total = res.data.total;
      this.setState({
        data,
        total,
      });
    });
  }

  async componentWillMount() {
    this.getReturnPoint();
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
    const color = {
      1: '#99CCCC',
      2: '#FF9900',
      3: '#336699',
    };
    const { data, total } = this.state;
    return (
      <IceContainer>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>返点</h2>

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
                height={window.innerHeight / 4}
                data={data}
                padding={[60, 20, 20, 60]}
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
                  color={['index', function (index) {
                    return color[index];
                  }]}
                  tooltip={['name*vote', (name, vote) => {
                    return {
                      name: '金额',
                      value: `${vote}`,
                    };
                  }]}
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
                  tooltip={false}
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
