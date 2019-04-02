import React, { Component } from 'react';
import { Grid, Dialog, Input, DatePicker, NumberPicker, Message } from '@alifd/next';
import Customer from './customer';
import DetailTable from './detailTable';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;

export default class detailWork extends Component {
  state = {
    visible: false,
  }
  submitForm = () => {
    this.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      console.log(values);
      axios.post('/api/changeDetail', { ...values }).then(response => {
        if (response.data.status === 200) {
          Message.success(response.data.statusText);
          this.child.getDetail();
        }
        this.onClose();
      }).catch(error => {
        console.log(error);
      });
    });
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  }
  showDialog = (value, row) => {
    const fotmatRow = {};
    for (const item in row) {
      if (Object.prototype.hasOwnProperty.call(row, item) && (row[item] !== null)) {
        fotmatRow[item] = row[item];
      }
    }
    this.setState({
      visible: true,
      formValue: fotmatRow,
    });
  }
  render() {
    return (
      <div>
        <Row gutter="20" wrap>
          <Col l="16">
            <DetailTable showDialog={this.showDialog} onRef={r => this.child = r} />
          </Col>
          <Col l="8">
            <Customer />
          </Col>
        </Row>
        <Dialog
          title="修改进程信息"
          visible={this.state.visible}
          onOk={this.submitForm.bind(this, 'okClick')}
          onCancel={this.onClose.bind(this, 'cancelClick')}
          onClose={this.onClose}
          shouldUpdatePosition
        >
          <div>
            <FormBinderWrapper
              ref={(form) => {
                  this.form = form;
                }}
              value={this.state.formValue}
            >
              <Row style={styles.formRow}>
                <Col span="3" style={styles.formLabel}>
                  <span>客户名称：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="name" required message="请填写客户名称">
                    <Input disabled />
                  </FormBinder>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>平台：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="platform" required message="请填写平台">
                    <Input />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name="platform" style={styles.formError} />
                  </div>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>产品：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="product" required message="请填写产品">
                    <Input />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name="product" style={styles.formError} />
                  </div>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col span="3" style={styles.formLabel}>
                  <span>面谈时间：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="interview_date" message="请选择面谈时间">
                    <DatePicker disabled={this.state.formValue && !this.state.formValue.interview_date} />
                  </FormBinder>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>进件时间：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="income_date" message="请选择进件时间">
                    <DatePicker disabled={this.state.formValue && !this.state.formValue.income_date} />
                  </FormBinder>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>放款时间：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="loan_date" message="请选择放款时间">
                    <DatePicker disabled={this.state.formValue && !this.state.formValue.loan_date} />
                  </FormBinder>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col span="3" style={styles.formLabel}>
                  <span>放款金额：</span>
                </Col>
                <Col span="5" >
                  <FormBinder name="money" message="请填写放款金额" type="number">
                    <NumberPicker disabled={this.state.formValue && !this.state.formValue.loan_date} min={0} style={{ width: '97%' }} />
                  </FormBinder>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>回款金额：</span>
                </Col>
                <Col span="5" >
                  <FormBinder disabled name="received" message="请填写回款金额" type="number">
                    <NumberPicker disabled={this.state.formValue && !this.state.formValue.loan_date} min={0} style={{ width: '97%' }} />
                  </FormBinder>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>返点：</span>
                </Col>
                <Col span="5" >
                  <FormBinder disabled name="return_point" message="请填写返点" type="number">
                    <NumberPicker disabled={this.state.formValue && !this.state.formValue.loan_date} min={0} style={{ width: '97%' }} />
                  </FormBinder>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col span="3" style={styles.formLabel}>
                  <span>返利：</span>
                </Col>
                <Col span="5" >
                  <FormBinder disabled name="rebate" message="请填写返利" type="number">
                    <NumberPicker disabled={this.state.formValue && !this.state.formValue.loan_date} min={0} style={{ width: '97%' }} />
                  </FormBinder>
                </Col>
              </Row>
            </FormBinderWrapper>
          </div>
        </Dialog>
      </div>
    );
  }
}
const styles = {
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  formLabel: {
    textAlign: 'right',
    lineHeight: '1.7rem',
    paddingRight: '10px',
  },
  formRow: {
    marginBottom: '20px',
    width: '1000px',
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
};
