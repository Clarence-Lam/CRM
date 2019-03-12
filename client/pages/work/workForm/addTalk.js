/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Dialog, Grid, Select, Input, CascaderSelect } from '@alifd/next';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;

export default class addTalk extends Component {
  static displayName = 'addTalk';

  static propTypes = {
    // visible: PropTypes.bool.isRequired,
    // rowValue: PropTypes.object.isRequired,
    // onChange: PropTypes.func,
    // onSubmit: PropTypes.func,
    // closeDialog: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      TeamMember: [],
      formValue: {},
    };
  }
  static defaultProps = {
    // onChange: () => {},
    // onSubmit: () => {},
    closeDialog: () => {},
  }

  searchCustomer = async (value) => {
    await this.getCustomerForSelect(value);
  }
  // getCustomerForSelect = async (name) => {
  //   axios
  //     .post('/api/getCustomerForSelect', { name })
  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         const customerData = response.data.customer;
  //         this.setState({ customerData });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

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
    // await this.getCustomerForSelect();
  }
  render() {
    const { visible, rowValue } = this.props;
    return (
      <div>
        <Row style={styles.formRow}>
          <Col span="6" style={styles.formLabel}>
            <span>客户称谓：</span>
          </Col>
          <Col span="18">
            <FormBinder name="customer_name" required message="请选择客户">
              {/* <Select data="rowValue.customer_id" placeholder="请选择客户" dataSource={this.state.customerData} style={{ width: '100%' }} /> */}
              <Input disabled />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="customer_name" />
            </div>
          </Col>
        </Row>
        <Row style={styles.formRow}>
          <Col span="6" style={styles.formLabel}>
            <span>组别组员：</span>
          </Col>
          <Col span="18">
            <FormBinder name="member_id" required message="请选择组别组员">
              <CascaderSelect disabled placeholder="组别组员" dataSource={this.state.TeamMember} style={{ width: '200px' }} listStyle={{ width: '150px' }} />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="member_id" />
            </div>
          </Col>
        </Row>


        <Row style={styles.formRow}>
          <Col span="6" style={styles.formLabel}>
            <span>备注：</span>
          </Col>
          <Col span="18">
            <FormBinder name="mark">
              <Input.TextArea placeholder="输入备注" name="mark" maxLength={200} hasLimitHint />
            </FormBinder>
          </Col>
        </Row>
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
    width: '400px',
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
};
