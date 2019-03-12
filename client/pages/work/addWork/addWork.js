import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Input, Button, Message, Select, CascaderSelect, Checkbox } from '@alifd/next';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';
import axios from 'axios';
import { async } from 'q';
import city from '../../../static/city.json';

// const customerCss = require('./style/addCustomer.css');
// import customerCss from './style/addCustomer.css';

const { Row, Col } = Grid;
const Toast = Message;
const { Group: CheckboxGroup } = Checkbox;
export default class AddCustomer extends Component {
  constructor(props, context) {
    super(props, context);
    console.info(props);
    console.info(context);
  }
  state = {
    formValue: {
      customer_id: '',
    },
    customerData: [],
    TeamMember: [],
  };

  handleSubmit = () => {
    this.form.validateAll((errors, values) => {
      console.log(this.state);
      if (errors) {
        console.log('errors', errors);
        return;
      }
      const isAdd = true;
      axios
        .post('/api/addWork', { isAdd, ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Toast.success(response.data.statusText);
            this.props.history.push('/working');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  getCustomerForSelect = async (name) => {
    // id = '3bf66ea0-40f2-11e9-9082-21d63c61208d';
    // name = '测';
    axios
      .post('/api/getCustomerForSelect', { name })
      .then((response) => {
        if (response.data.status === 200) {
          const customerData = response.data.customer;
          this.setState({ customerData });

          if (this.props.location.state) {
            const { formValue } = this.setState;
            const customer_id = this.props.location.state.customerId;
            // const customerName = this.props.location.state.customerName;
            this.setState({
              formValue: {
                customer_id,
              },
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  searchCustomer = async (value) => {
    await this.getCustomerForSelect(value);
  }

  getTeamMember = async () => {
    let { TeamMember } = this.state;
    const res = await axios.get('/api/getTeamMember', {});
    TeamMember = res.data.teamMember;
    this.setState({
      TeamMember,
    });
  };

  async componentWillMount() {
    await this.getTeamMember();
    await this.getCustomerForSelect();
  }
  render() {
    const { TeamMember } = this.state;
    return (
      <IceContainer style={styles.form}>
        <FormBinderWrapper
          ref={(form) => {
            this.form = form;
          }}
          value={this.state.formValue}
          onChange={this.formChange}
        >
          <div style={styles.formContent}>
            <h2 style={styles.formTitle}>新增进程</h2>
            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>客户称谓：</span>
              </Col>
              <Col l="6">
                <FormBinder name="customer_id" required message="请选择客户">
                  <Select showSearch placeholder="请选择客户" filterLocal={false} dataSource={this.state.customerData} onSearch={this.searchCustomer} style={{ width: '100%' }} />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="customer_id" />
                </div>
              </Col>
            </Row>

            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>组别组员：</span>
              </Col>
              <Col l="6">
                <FormBinder name="member_id" required message="请选择组别组员">
                  <CascaderSelect placeholder="组别组员" dataSource={TeamMember} style={{ width: '100%' }} listStyle={{ width: '150px' }} />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="member_id" />
                </div>
              </Col>
            </Row>


            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>备注：</span>
              </Col>
              <Col l="6">
                <FormBinder name="mark">
                  <Input.TextArea placeholder="输入备注" name="mark" maxLength={200} hasLimitHint />
                </FormBinder>
              </Col>
            </Row>
            <Row>
              <Col offset="2">
                <Button onClick={this.handleSubmit} type="primary">
                  确认
                </Button>
              </Col>
            </Row>
          </div>
        </FormBinderWrapper>
      </IceContainer>
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
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
};
