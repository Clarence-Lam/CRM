

import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import MoneyReport from './components/moneyReport';
import ReturnReport from './components/returnReport';
// import Axios from 'axios';

const { Row, Col } = Grid;

export default class Reports extends Component {
  // state = {
  //   isAdmin: false,
  // };
  // getSession = async () => {
  //   await Axios
  //     .get('api/getSession')
  //     .then((response) => {
  //       if (response.status === 200) {
  //         const { authority } = response.data;
  //         if (authority === 'admin') {
  //           this.setState({
  //             isAdmin: true,
  //           });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  // async componentWillMount() {
  //   await this.getSession();
  // }
  render() {
    return (
      <div>
        <Row gutter="20" wrap>
          <Col l="24">
            <MoneyReport />
          </Col>
        </Row>
        <Row>
          <Col l="24">
            <ReturnReport />
          </Col>
        </Row>
      </div>
    );
  }
}
