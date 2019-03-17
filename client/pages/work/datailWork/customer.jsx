import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import cloneDeep from 'lodash.clonedeep';
import { Table, Dialog, Button, Grid, Input, Message, Select, Form, Pagination } from '@alifd/next';
import IceLabel from '@icedesign/label';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../../components/ContainerTitle';
import SearchForm from '../searchForm/searchWork';
import WorkForm from '../workForm';

import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;


@withRouter
export default class workTable extends Component {
  state = {
  };

  goback = () => {
    this.props.history.push('/working');
  }

  renderContent = () => {
    if (this.props.location.state) {
      return (
        <div>
          <Row style={styles.rowStyle}>
            <Col span="6">
              <span>客户称谓：</span>
            </Col>
            <Col span="16">
              <span>{this.props.location.state.customerName}</span>
            </Col>
          </Row>
          <Row style={styles.rowStyle}>
            <Col span="6">
              <span>身份证：</span>
            </Col>
            <Col span="16">
              <span>{this.props.location.state.id_card}</span>
            </Col>
          </Row>
          <Row style={styles.rowStyle}>
            <Col span="6">
              <span>联系方式：</span>
            </Col>
            <Col span="16">
              <span>{this.props.location.state.phone}</span>
            </Col>
          </Row>
          <Row style={styles.rowStyle}>
            <Col span="6">
              <span>组别：</span>
            </Col>
            <Col span="16">
              <span>{this.props.location.state.teamName}</span>
            </Col>
          </Row>
          <Row style={styles.rowStyle}>
            <Col span="6">
              <span>组员：</span>
            </Col>
            <Col span="16">
              <span>{this.props.location.state.memberName}</span>
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div style={{ margin: '20px' }}>请返回重新选择进程</div>);
  }

  async componentWillMount() {
    console.log('1');
  }
  render() {
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="客户信息"
            buttonText="返回"
            style={styles.title}
            onClick={() => this.goback()}
          />
          {this.renderContent()}
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  rowStyle: {
    marginTop: '10px',
  },
};
