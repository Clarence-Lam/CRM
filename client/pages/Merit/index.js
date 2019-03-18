

import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import Interview from './components/interview';
import Income from './components/income';
import Money from './components/money';
import Received from './components/received';
import Returnpoint from './components/returnpoint';
import Rebate from './components/rebate';
import Axios from 'axios';

const { Row, Col } = Grid;

export default class Merit extends Component {
  state = {
    isAdmin: false,
  };
  getSession = async () => {
    await Axios
      .get('api/getSession')
      .then((response) => {
        if (response.status === 200) {
          const { authority } = response.data;
          if (authority === 'admin') {
            this.setState({
              isAdmin: true,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async componentWillMount() {
    await this.getSession();
  }
  render() {
    return (
      <div>
        <Row gutter="20" wrap>
          <Col l="8">
            <Interview />
          </Col>
          <Col l="8">
            <Income />
          </Col>
          <Col l="8">
            <Money />
          </Col>
        </Row>
        { this.state.isAdmin &&
          <Row gutter="20" wrap>
            <Col l="8">
              <Received />
            </Col>
            <Col l="8">
              <Returnpoint />
            </Col>
            <Col l="8">
              <Rebate />
            </Col>
          </Row>
        }
      </div>
    );
  }
}
