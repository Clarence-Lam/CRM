import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Dialog, Button, Grid, Input, Message, Select, Form } from '@alifd/next';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../components/ContainerTitle';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const Option = Select.Option;
const FormItem = Form.Item;


@withRouter
export default class userTable extends Component {
  state = {
    data: [],
    visible: false,
    isFullScreen: false,
    title: '新增用户',
    rowId: '',
  };
  getUser = async () => {
    let { data } = this.state;
    const res = await axios.get('/api/getUser', {});
    data = res.data.user;

    this.setState({
      data,
    });
  };
  register = (value, row) => {
    let digTitle = '';
    let values = {};
    let rowID = '';
    if (value !== 0) {
      digTitle = '修改信息';
      rowID = value;
      const { name, username, authority } = row;
      values = {
        name,
        username,
        authority,
      };
    } else {
      digTitle = '新增用户';
      rowID = '0';
    }
    this.setState({
      visible: true,
      title: digTitle,
      formValue: values,
      rowId: rowID,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  handleDelete = (index) => {
    Dialog.confirm({
      title: '提示',
      content: '确认删除吗',
      onOk: () => {
        axios.post('/api/deleteUser', { id: index }).then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getUser();
          }
        });
      },
    });
  };
  handleSubmit = (rowId) => {
    this.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      let url = '';
      if (rowId === '0') {
        url = '/api/register';
      } else {
        url = '/api/updateUser';
      }
      console.log(values);
      axios
        .post(url, { id: rowId, ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getUser();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  renderOper = (value, index, row) => {
    return (
      <div>
        <Button
          type="primary"
          onClick={() => this.register(value, row)}
          style={{ marginRight: '10px' }}
        >
          修改
        </Button>
        <Button
          onClick={() => this.handleDelete(value)}
          type="normal"
          warning
        >
          删除
        </Button>
      </div>
    );
  };
  renderAuth =(value) => {
    return value === 'user' ? '母账号' : '子账号';
  }
  async componentWillMount() {
    this.getUser();
  }
  render() {
    const { data, visible, isFullScreen, title, rowId } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="用户管理"
            buttonText="添加用户"
            style={styles.title}
            onClick={() => this.register(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }}>
            <Table.Column
              dataIndex="username"
              title="账号"
            />
            <Table.Column dataIndex="name" title="用户名" />
            <Table.Column dataIndex="authority" title="权限" cell={this.renderAuth} />
            {/* <Table.Column dataIndex="role" title="职位" />
            <Table.Column dataIndex="joinTime" title="入职时间" /> */}
            <Table.Column dataIndex="id" title="操作" cell={this.renderOper} />
          </Table>
        </IceContainer>


        <div>
          <Dialog title={title}
            visible={visible}
            isFullScreen={isFullScreen}
            onCancel={this.onClose}
            onOk={() => this.handleSubmit(rowId)}
            onClose={this.onClose}
            footerActions={['cancel', 'ok']}
          >
            <div style={{ width: '300px' }}>
              <FormBinderWrapper
                ref={(form) => {
                  this.form = form;
                }}
                value={this.state.formValue}
                onChange={this.formChange}
              >
                <Row style={styles.formRow}>
                  <Col l="6" style={styles.formLabel}>
                    <span>账号：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="username" required message="请输入账号">
                      <Input
                        name="username"
                        placeholder="请输入账号"
                        style={{ width: '150px' }}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="username" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="6" style={styles.formLabel}>
                    <span>密码：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="password" required message="请输入密码">
                      <Input
                        name="password"
                        placeholder="请输入密码"
                        style={{ width: '150px' }}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="password" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="6" style={styles.formLabel}>
                    <span>用户名：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="name" required message="请输入用户名">
                      <Input
                        name="name"
                        placeholder="请输入用户名"
                        style={{ width: '150px' }}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="name" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="6" style={styles.formLabel}>
                    <span>权限：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="authority" required message="请选择权限">
                      <Select style={{ width: '150px' }}>
                        <Select.Option value="user">母账号</Select.Option>
                        <Select.Option value="guest">子账号</Select.Option>
                      </Select>
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="authority" />
                    </div>
                  </Col>
                </Row>
              </FormBinderWrapper>
            </div>

          </Dialog>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '0',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '24px',
    height: '24px',
    border: '1px solid #eee',
    background: '#eee',
    borderRadius: '50px',
  },
  name: {
    marginLeft: '15px',
    color: '#314659',
    fontSize: '14px',
  },
  link: {
    cursor: 'pointer',
    color: '#1890ff',
  },
  edit: {
    marginRight: '5px',
  },
  formLabel: {
    textAlign: 'right',
    lineHeight: '1.7rem',
    paddingRight: '10px',
  },
  formRow: {
    marginBottom: '20px',
  },
};
