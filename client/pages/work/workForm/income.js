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

export default class income extends Component {
  static displayName = 'income';

  static propTypes = {
    // visible: PropTypes.bool.isRequired,
    // rowValue: PropTypes.object.isRequired,
    // onChange: PropTypes.func,
    // onSubmit: PropTypes.func,
    // closeDialog: PropTypes.func,
    addForm: PropTypes.func,
    removeForm: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      TeamMember: [],
      incomeValue: {
        items: [{
          name: 1,
        }],
      },
    };
  }
  static defaultProps = {
    // onChange: () => {},
    // onSubmit: () => {},
    // closeDialog: () => {},
    addForm: () => {},
    removeForm: () => {},
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

  //-------------------
  addItem = () => {
    const { addForm } = this.props;
    addForm();
  };

  formChange = value => {
    // 说明：
    //  1. 表单是双向通行的，所有表单的响应数据都会同步更新 value
    //  2. 这里 setState 只是为了实时展示当前表单数据的演示使用
    this.setState({ incomeValue: value });
  };

  changeItem = () => {
    const items = this.state.incomeValue.items;
    this.setState({
      incomeValue: {
        ...this.state.incomeValue,
        items,
      },
    });
  };

  removeItem = (index) => {
    this.state.incomeValue.items.splice(index, 1);
    this.setState({
      incomeValue: this.state.incomeValue,
    });
  }
  //-------------------


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
            <span>进件数：</span>
          </Col>
          <Col span="18">
            <FormBinder name="income" required message="请填写进件数">
              <NumberPicker min={1} type="inline" name="income" editable={false} onChange={this.changeIncome} />
            </FormBinder>
            <div style={styles.formErrorWrapper}>
              <FormError name="income" />
            </div>
          </Col>
        </Row>
        <ArticleList
          items={this.props.formValue.incomeForm}
          addItem={this.addItem}
          removeItem={this.removeItem}
          validateAllFormField={this.validateAllFormField}
        />

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
class ArticleList extends Component {
  render() {
    const greater = this.props.items.length > 1;
    return (
      <div>
        {this.props.items.map((item, index) => {
          return (
            <div key={index}>
              <Row style={styles.formRow}>
                <Col span="6" style={styles.formLabel}>
                  <span>平台{greater ? (index + 1) : ''}：</span>
                </Col>
                <Col span="18">
                  <FormBinder required message="请输入平台名称" name={`incomeForm[${index}].platform`} >
                    <Input />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name={`incomeForm[${index}].platform`} style={styles.formError} />
                  </div>

                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col span="6" style={styles.formLabel}>
                  <span>产品{greater ? (index + 1) : ''}：</span>
                </Col>
                <Col span="18">
                  <FormBinder name={`incomeForm[${index}].product`} required message="请输入产品名称" >
                    <Input />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name={`incomeForm[${index}].product`} style={styles.formError} />
                  </div>
                </Col>
                {/* <Col>
                  <Button type="secondary" onClick={this.props.removeItem.bind(this, index)}>删除</Button>
                </Col> */}
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
    width: '400px',
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
};
