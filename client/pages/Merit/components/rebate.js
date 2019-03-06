/* 返利 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid } from '@alifd/next';


const { Row, Col } = Grid;


export default class Interview extends Component {
  static displayName = 'Interview';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <IceContainer>
        <div style={styles.formContent}>
          <h2 style={styles.formTitle}>放款金额</h2>

          <Row style={styles.formItem}>
            <Col xxs="6" s="6" l="6" style={styles.label}>
                总量：
            </Col>
            <Col s="12" l="10">
              <span>125</span>
            </Col>
          </Row>

          <Row style={styles.formItem}>
            <Col xxs="6" s="6" l="6" style={styles.label}>
                第一名：
            </Col>
            <Col s="12" l="10">
              <span>125</span>
            </Col>
          </Row>

          <Row style={styles.formItem}>
            <Col xxs="6" s="6" l="6" style={styles.label}>
                第二名：
            </Col>
            <Col s="12" l="10">
              <span>125</span>
            </Col>
          </Row>

          <Row style={styles.formItem}>
            <Col xxs="6" s="6" l="6" style={styles.label}>
                第三名：
            </Col>
            <Col s="12" l="10">
              <span>125</span>
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
