/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid, Message } from '@alifd/next';
import axios from 'axios';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;


export default class BaseSetting extends Component {
  static displayName = 'BaseSetting';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
      },
    };
  }

  onDragOver = () => {
    console.log('dragover callback');
  };

  onDrop = (fileList) => {
    console.log('drop callback : ', fileList);
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      // console.log(location);
      if (errors) {
        console.log('errors', errors);
        return;
      }
      const { userId, userName, authority } = global.user;
      values = {
        ...values,
        id: userId,
        username: userName,
        authority,
      };
      axios
        .post('/api/updateUser', { ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success('信息修改成功');
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  render() {
    return (
      <IceContainer>
        <IceFormBinderWrapper value={this.state.value} ref="form">
          <div style={styles.formContent}>
            <h2 style={styles.formTitle}>个人设置</h2>
            <Row style={styles.formItem}>
              <Col xxs="6" s="3" l="3" style={styles.label}>
                姓名：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="name" required max={10} message="请输入姓名">
                  <Input
                    style={styles.inputItem}
                    placeholder="请输入姓名"
                  />
                </IceFormBinder>
                <IceFormError name="name" />
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="3" l="3" style={styles.label}>
                密码：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="password" required max={16} message="请输入密码">
                  <Input
                    style={styles.inputItem}
                    placeholder="请输入密码"
                  />
                </IceFormBinder>
                <IceFormError name="password" />
              </Col>
            </Row>
          </div>
        </IceFormBinderWrapper>

        <Row style={{ marginTop: 20 }}>
          <Col offset="3">
            <Button
              type="primary"
              style={{ width: 100 }}
              onClick={this.validateAllFormField}
            >
              更新设置
            </Button>
          </Col>
        </Row>
      </IceContainer>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
    color: '#333',
  },
  inputItem: {
    width: '100%',
  },
};
