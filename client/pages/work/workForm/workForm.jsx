/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Dialog, Grid, Select, Message, Loading } from '@alifd/next';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';
import AddTalk from './addTalk';
import Income from './income';

const { Row, Col } = Grid;

export default class WorkForm extends Component {
  static displayName = 'WorkForm';

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    rowValue: PropTypes.object.isRequired,
    // onChange: PropTypes.func,
    // onSubmit: PropTypes.func,
    closeDialog: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      formValue: {},
    };
  }
  static defaultProps = {
    // onChange: () => {},
    // onSubmit: () => {},
    closeDialog: () => {},
  }


  onClose = reason => {
    console.log(reason);

    const { closeDialog } = this.props;
    closeDialog();
  };

  renderForm() {
    const { status } = this.state.formValue;
    if (status === 'interview') {
      return (<AddTalk rowValue={this.props.rowValue} />);
    } else if (status === 'income') {
      return (
        <Income rowValue={this.props.rowValue}
          formValue={this.state.formValue}
          addForm={this.addForm}
          removeForm={this.removeForm}
        />);
    } else if (status === 'loan') {
      return (<div>3</div>);
    }
  }

  submitForm = () => {
    this.form.validateAll((errors, values) => {
      console.log(values);
      if (errors) {
        console.log('errors', errors);
        return;
      }
      console.log('验证通过');
      let url = '';
      let data = {};
      if (values.status === 'interview') {
        url = '/api/addWork';
        data = {
          customer_id: this.props.rowValue.customer_id,
          isAdd: false,
        };
      } else if (values.status === 'income') {
        url = '';
      } else if (values.status === 'loan') {
        url = '';
      }
      axios.post(url, { ...values, ...data }).then(response => {
        if (response.data.status === 200) {
          Message.success(response.data.statusText);
        }
      }).catch(error => {

      });
    });
  }

  changeStatus = (value) => {
    let ind = {};
    if (value === 'interview') {
      ind = {};
    } else if (value === 'income') {
      ind = {
        income: this.props.rowValue.income || 1,
        incomeForm: [{}],
      };
    } else if (value === 'loan') {
      ind = {};
    }
    this.setState({
      formValue: {
        status: value,
        customer_name: this.props.rowValue.customerName,
        member_id: this.props.rowValue.member_id,
        mark: this.props.rowValue.mark,
        ...ind,
      },
    });
  }

  // add income form
  addForm = () => {
    const { formValue } = this.state;
    formValue.incomeForm.push({});
    this.setState({ formValue });
  }
  // remove income form
  removeForm = (index) => {
    const { formValue } = this.state;
    const i = index || -1;
    formValue.incomeForm.splice(i, 1);
    this.setState({
      incomeValue: this.state.incomeValue,
    });
  }

  async componentWillMount() {
    console.log('reder前');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formValue: {
        status: nextProps.rowValue.status,
        customer_name: nextProps.rowValue.customerName,
        member_id: nextProps.rowValue.member_id,
        mark: nextProps.rowValue.mark,
      },
    });
  }


  render() {
    const { visible, rowValue } = this.props;
    return (
      <Dialog
        title="修改进程"
        visible={visible}
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
              <Col span="6" style={styles.formLabel}>
                <span>状态：</span>
              </Col>
              <Col span="18" >
                <FormBinder name="status" required message="请选择状态">
                  <Select style={{ width: '150px' }} defaultValue={rowValue.status} onChange={this.changeStatus}>
                    <Select.Option value="interview">面谈</Select.Option>
                    <Select.Option value="income">进件</Select.Option>
                    <Select.Option value="loan">放款</Select.Option>
                  </Select>
                </FormBinder>
              </Col>
            </Row>
            {this.renderForm()}
          </FormBinderWrapper>
        </div>
      </Dialog>
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
    minWidth: '210px',
  },
  formErrorWrapper: {
    marginTop: '5px',
  },
};
