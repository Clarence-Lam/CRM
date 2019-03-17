import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import Customer from './customer';
import DetailTable from './detailTable';

const { Row, Col } = Grid;

export default class detailWork extends Component {
  render() {
    console.log(this.props.location.state);
    return (
      <div>
        <Row gutter="20" wrap>
          <Col l="16">
            <DetailTable />
          </Col>
          <Col l="8">
            <Customer />
          </Col>
        </Row>
      </div>
    );
  }
}
