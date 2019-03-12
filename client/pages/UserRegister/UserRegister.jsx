/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Input, Button, Message } from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import IceIcon from '@icedesign/foundation-symbol';
import axios from 'axios';

@withRouter
class UserRegister extends Component {
  static displayName = 'UserRegister';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        username: '',
        password: '',
        authority: '',
      },
    };
  }

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  checkPasswd2 = (rule, values, callback, stateValues) => {
    if (!values) {
      callback('请输入正确的密码');
    } else if (values && values !== stateValues.passwd) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  handleSubmit = () => {
    this.refs.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      axios
        .post('/api/register', { ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <h4 style={styles.title}>注 册</h4>
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            <div style={styles.formItem}>
              <IceIcon type="person" size="small" style={styles.inputIcon} />
              <IceFormBinder name="username" required message="请输入正确的用户名">
                <Input placeholder="用户名" style={styles.inputCol} />
              </IceFormBinder>
              <IceFormError name="username" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="person" size="small" style={styles.inputIcon} />
              <IceFormBinder
                name="name"
                required
                message="请输入正确的账号名称"
              >
                <Input
                  maxLength={20}
                  placeholder="账号名称"
                  style={styles.inputCol}
                />
              </IceFormBinder>
              <IceFormError name="name" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="lock" size="small" style={styles.inputIcon} />
              <IceFormBinder
                name="password"
                required
              >
                <Input
                  htmlType="password"
                  placeholder="至少8位密码"
                  style={styles.inputCol}
                />
              </IceFormBinder>
              <IceFormError name="password" />
            </div>

            <div style={styles.formItem}>
              <IceIcon type="person" size="small" style={styles.inputIcon} />
              <IceFormBinder
                name="authority"
                required
              >
                <Input
                  placeholder="权限"
                  style={styles.inputCol}
                />
              </IceFormBinder>
              <IceFormError name="authority" />
            </div>

            <div className="footer">
              <Button
                type="primary"
                onClick={this.handleSubmit}
                style={styles.submitBtn}
              >
                注 册
              </Button>
              <Link to="/user/login" style={styles.tips}>
                使用已有账户登录
              </Link>
            </div>
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '400px',
    padding: '40px',
    background: '#fff',
    borderRadius: '6px',
    zIndex: 9,
  },
  title: {
    margin: '0 0 40px',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '28px',
    fontWeight: '500',
    textAlign: 'center',
  },
  formItem: {
    position: 'relative',
    marginBottom: '20px',
  },
  inputIcon: {
    position: 'absolute',
    left: '8px',
    top: '8px',
    color: '#666',
  },
  inputCol: {
    width: '100%',
    paddingLeft: '20px',
  },
  submitBtn: {
    width: '100%',
  },
  tips: {
    marginTop: '20px',
    display: 'block',
    textAlign: 'center',
  },
};

export default UserRegister;
