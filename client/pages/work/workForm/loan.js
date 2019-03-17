/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Dialog, Grid, Select, Input, CascaderSelect, NumberPicker } from '@alifd/next';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;

export default class loan extends Component {
  static displayName = 'loan';

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
      TeamMember: [],
    };
  }
  static defaultProps = {
    // onChange: () => {},
    // onSubmit: () => {},
    // closeDialog: () => {},
  }

  getTeamMember = async () => {
    let { TeamMember } = this.state;
    const res = await axios.get('/api/getTeamMember', {});
    TeamMember = res.data.teamMember;
    this.setState({
      TeamMember,
    });
  };

  changeIncome = (value, e) => {
    if (e.triggerType === 'up') {
      const { addForm } = this.props;
      addForm();
    } else if (e.triggerType === 'down') {
      const { removeForm } = this.props;
      removeForm();
    }
  }


  async componentWillMount() {
    await this.getTeamMember();
    // await this.getCustomerForSelect();
  }
  render() {
    const { visible, rowValue } = this.props;
    console.log(this.props);
    return (
      <div>
        <Row style={styles.formRow}>
          <Col span="3" style={styles.formLabel}>
            <span>客户称谓：</span>
          </Col>
          <Col span="5">
            <FormBinder name="customer_name" required message="请选择客户">
              <Input disabled />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="customer_name" />
            </div>
          </Col>
          <Col span="3" style={styles.formLabel}>
            <span>组别组员：</span>
          </Col>
          <Col span="5">
            <FormBinder name="member_id" required message="请选择组别组员">
              <CascaderSelect disabled placeholder="组别组员" dataSource={this.state.TeamMember} style={{ width: '200px' }} listStyle={{ width: '150px' }} />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="member_id" />
            </div>
          </Col>
          <Col span="3" style={styles.formLabel}>
            <span>进件数：</span>
          </Col>
          <Col span="5">
            <FormBinder name="income" required message="请填写进件数">
              <Input disabled style={{ with: '50px' }} />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="income" />
            </div>
          </Col>
        </Row>
        <LoanList
          items={this.props.formValue.incomeForm}
          addItem={this.addItem}
          removeItem={this.removeItem}
          validateAllFormField={this.validateAllFormField}
        />

        <Row style={styles.formRow}>
          <Col span="3" style={styles.formLabel}>
            <span>备注：</span>
          </Col>
          <Col span="13">
            <FormBinder name="mark">
              <Input.TextArea placeholder="输入备注" name="mark" maxLength={200} hasLimitHint style={{ width: '100%' }} />
            </FormBinder>
          </Col>
        </Row>
      </div>
    );
  }
}
class LoanList extends Component {
  render() {
    const greater = this.props.items.length > 1;
    return (
      <div>
        {this.props.items.map((item, index) => {
          return (
            <div key={index}>
              <Row style={styles.formRow} wrap>
                <Col span="3" style={styles.formLabel}>
                  <span>平台{greater ? (index + 1) : ''}：</span>
                </Col>
                <Col span="5">
                  <FormBinder required message="请输入平台名称" name={`incomeForm[${index}].platform`} >
                    <Input disabled />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name={`incomeForm[${index}].platform`} style={styles.formError} />
                  </div>

                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>产品{greater ? (index + 1) : ''}：</span>
                </Col>
                <Col span="5">
                  <FormBinder name={`incomeForm[${index}].product`} required message="请输入产品名称" >
                    <Input disabled />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name={`incomeForm[${index}].product`} style={styles.formError} />
                  </div>
                </Col>
                <Col span="3" style={styles.formLabel}>
                  <span>金额{greater ? (index + 1) : ''}：</span>
                </Col>
                <Col span="5">
                  <FormBinder name={`incomeForm[${index}].money`} message="请输入金额" type="number">
                    <NumberPicker min={0} style={{ width: '97%' }} />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name={`incomeForm[${index}].money`} style={styles.formError} />
                  </div>
                </Col>
                {
                  global.user.authority !== 'guest' &&
                  <div style={styles.loanCsontents}>
                    <Col span="3" style={styles.formLabel}>
                      <span>回款{greater ? (index + 1) : ''}：</span>
                    </Col>
                    <Col span="5">
                      <FormBinder name={`incomeForm[${index}].received`} message="请输入回款金额" type="number">
                        <NumberPicker min={0} style={{ width: '97%' }} />
                      </FormBinder>
                      <div style={styles.formErrorWrapper}>
                        <FormError name={`incomeForm[${index}].received`} style={styles.formError} />
                      </div>
                    </Col>
                    <Col span="3" style={styles.formLabel}>
                      <span>返点{greater ? (index + 1) : ''}：</span>
                    </Col>
                    <Col span="5">
                      <FormBinder name={`incomeForm[${index}].return_point`} message="请输入返点金额" type="number">
                        <NumberPicker min={0} style={{ width: '97%' }} />
                      </FormBinder>
                      <div style={styles.formErrorWrapper}>
                        <FormError name={`incomeForm[${index}].return_point`} style={styles.formError} />
                      </div>
                    </Col>
                    <Col span="3" style={styles.formLabel}>
                      <span>返利{greater ? (index + 1) : ''}：</span>
                    </Col>
                    <Col span="5">
                      <FormBinder name={`incomeForm[${index}].rebate`} message="请输入返利金额" type="number">
                        <NumberPicker min={0} style={{ width: '97%' }} />
                      </FormBinder>
                      <div style={styles.formErrorWrapper}>
                        <FormError name={`incomeForm[${index}].rebate`} style={styles.formError} />
                      </div>
                    </Col>
                  </div>
                }
              </Row>
            </div>
          );
        })}
        {/* <div style={styles.buttons}>
          <Button type="secondary" onClick={this.props.addItem}>新 增</Button>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={this.props.validateAllFormField}>
            校 验
          </Button>
        </div> */}
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
  loanCsontents: {
    display: 'contents',
  },
};
