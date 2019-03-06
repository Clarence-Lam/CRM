

import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import Interview from './components/interview';
import Income from './components/income';
import Money from './components/money';
import Received from './components/received';
import Returnpoint from './components/returnpoint';
import Rebate from './components/rebate';

const { Row, Col } = Grid;

export default class Merit extends Component {
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
      </div>
    );
  }
}
