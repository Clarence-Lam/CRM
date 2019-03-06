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
export default class tagTable extends Component {
  state = {
    data: [],
    visible: false,
    isFullScreen: false,
    title: '新增标签',
    rowId: '',
  };
  getTag = async () => {
    let { data } = this.state;
    const res = await axios.get('/api/getTag', {});
    data = res.data.tag;

    this.setState({
      data,
    });
  };
  addTag = (value, row) => {
    let digTitle = '';
    let values = {};
    let rowID = '';
    if (value !== 0) {
      digTitle = '修改标签';
      rowID = value;
      const { name } = row;
      values = {
        name,
      };
    } else {
      digTitle = '新增标签';
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
        axios.post('/api/deleteTag', { id: index }).then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getTag();
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
        url = '/api/addTag';
      } else {
        url = '/api/updateTag';
      }
      axios
        .post(url, { id: rowId, ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getTag();
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
          onClick={() => this.addTag(value, row)}
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
  async componentWillMount() {
    this.getTag();
  }
  render() {
    const { data, visible, isFullScreen, title, rowId } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="标签管理"
            buttonText="新增标签"
            style={styles.title}
            onClick={() => this.addTag(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }}>
            <Table.Column
              dataIndex="name"
              title="标签"
            />
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
                    <span>名称：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="name" required message="请输入标签">
                      <Input
                        name="name"
                        placeholder="请输入标签"
                        style={{ width: '150px' }}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="name" />
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
