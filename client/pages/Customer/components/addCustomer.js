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
import customerCss from './style/addCustomer.css';

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
      name: '',
    },
    area: [],
    teamMember: [],
    title: '新增客户',
  };

  formChange = (value) => {
    console.log(value);
  };
  onChangeArea = (value, data) => {
    let area = this.state;
    area = [data.label, value];
    this.setState({ area });
  };

  handleSubmit = () => {
    this.form.validateAll((errors, values) => {
      console.log(this.state);
      if (errors) {
        console.log('errors', errors);
        return;
      }

      const { area } = this.state;
      values.area = area;

      let url = '/api/addCustomer';
      let id = '';
      if (this.props.location.state) {
        url = '/api/updateCustomer';
        id = this.props.location.state.id;
      }
      axios
        .post(url, { id, ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Toast.success(response.data.statusText);
            const customerId = response.data.row.id;
            const customerName = response.data.row.name;
            this.props.history.push({
              pathname: `/add/work/${customerId}`,
              state: {
                customerId,
                customerName,
              },
            });
          } else if (response.data.status === 202) {
            Toast.success(response.data.statusText);
            this.props.history.push('/customer');
          } else {
            Toast.warning(response.data.statusText);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  checkIDCard = (rule, values, callback) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(values) === false) {
      callback('请输入正确的身份证');
    } else {
      callback();
    }
  }
  checkMobile = (rule, values, callback) => {
    const reg = /^1[34578]\d{9}$/;
    if (reg.test(values) === false) {
      callback('请输入正确的手机号码');
    } else {
      callback();
    }
  }

  getTeamMember = async () => {
    let { TeamMember } = this.state;
    const res = await axios.get('/api/getTeamMember', {});
    TeamMember = res.data.teamMember;
    this.setState({
      TeamMember,
    });
  };
  getTag = async () => {
    let { tagData } = this.state;
    const res = await axios.get('/api/getTagForSelect', {});
    tagData = res.data.tag;
    this.setState({
      tagData,
    });
  }
  getCustomerById = async () => {
    if (this.props.location.state) {
      await axios.post('/api/getCustomerById', { id: this.props.location.state.id })
        .then((response) => {
          const { id, name, id_card, phone, member_id, area, tag, mark } = response.data.customer[0];
          const areaNum = area.split(',');
          const tagData = tag.split(',');
          this.setState({
            formValue: {
              id, name, id_card, phone, member_id, area: areaNum[1], tag: tagData, mark: mark || '',
            },
            area: [areaNum[0], areaNum[1]],
            title: '修改客户信息',
          });
          console.log(this.state);
        }).catch((error) => {
          console.log(error);
          Message.error('网络异常，请稍后再试。');
        });
    }
  }

  async componentWillMount() {
    this.getTag();
    this.getTeamMember();
    this.getCustomerById();
  }
  render() {
    const { TeamMember, tagData, title } = this.state;

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
            <h2 style={styles.formTitle}>{title}</h2>
            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>客户称谓：</span>
              </Col>
              <Col l="6">
                <FormBinder name="name" required message="请输入客户称谓">
                  <Input
                    name="name"
                    placeholder="请输入客户称谓"
                    style={{ width: '100%' }}
                  />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="name" />
                </div>
              </Col>
            </Row>

            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>身份证：</span>
              </Col>
              <Col l="6">
                <FormBinder
                  validator={this.checkIDCard}
                  name="id_card"
                  required
                  message="请输入正确的身份证"
                >
                  <Input
                    maxLength={18}
                    placeholder="请输入身份证"
                    style={{ width: '100%' }}
                  />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="id_card" />
                </div>
              </Col>
            </Row>

            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>联系方式：</span>
              </Col>
              <Col l="6">
                <FormBinder name="phone" required message="请输入正确的手机号码" validator={this.checkMobile}>
                  <Input
                    maxLength={11}
                    placeholder="请输入联系方式"
                    style={{ width: '100%' }}
                  />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="phone" />
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
                <span>区域：</span>
              </Col>
              <Col l="6">
                <FormBinder name="area" required message="请选择区域">
                  <CascaderSelect placeholder="区域" dataSource={city} style={{ width: '100%' }} listStyle={{ width: '150px' }} onChange={this.onChangeArea} />
                </FormBinder>
                <div style={styles.formErrorWrapper}>
                  <FormError name="area" />
                </div>
              </Col>
            </Row>
            <Row style={styles.formRow}>
              <Col l="2" style={styles.formLabel}>
                <span>客户标签：</span>
              </Col>
              <Col l="6" >
                <div className="tagBox">
                  <FormBinder name="tag" required message="请选择标签">
                    <CheckboxGroup value={this.state.value} dataSource={tagData} onChange={this.onChange} style={{ width: '100%' }} />
                  </FormBinder>
                  <div style={styles.formErrorWrapper}>
                    <FormError name="tag" />
                  </div>
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
