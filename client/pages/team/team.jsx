import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Dialog, Button, Switch, Grid, Input, Message, Field } from '@alifd/next';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../components/ContainerTitle';
import axios from 'axios';
import {
  FormBinderWrapper,
  FormBinder,
  FormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;


@withRouter
export default class TeamTable extends Component {
  field = new Field(this);
  state = {
    data: [],
    visible: false,
    isFullScreen: false,
    title: '新增组别',
    rowId: '',
  };
  getData = async () => {
    let { data } = this.state;
    const res = await axios.get('/api/getTeam', {});
    data = res.data.team;

    this.setState({
      data,
    });
  };
  addTeam = (value, teamName, mark) => {
    let digTitle = '';
    let values = {};
    let rowID = '';
    if (value !== 0) {
      digTitle = '修改组别';
      mark = mark || '';
      values = {
        teamName,
        mark,
      };
      rowID = value;
    } else {
      digTitle = '新增组别';
      rowID = '0';
    }
    console.log(rowID);
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
        const { data } = this.state;

        data.splice(index, index + 1);
        this.setState({
          data,
        });
      },
    });
  };
  handleSubmit = (rowId) => {
    console.log(rowId);
    this.form.validateAll((errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }
      let url = '';
      if (rowId === '0') {
        url = '/api/addTeam';
      } else {
        url = '/api/updateTeam';
      }
      axios
        .post(url, { id: rowId, ...values })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getData();
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
          onClick={() => this.addTeam(value, row.team_name, row.mark)}
          style={{ marginRight: '10px' }}
        >
          修改
        </Button>
        {/* <Button
          onClick={() => this.handleDelete(value)}
          type="normal"
          warning
        >
          删除
        </Button> */}
      </div>
    );
  };
  async componentWillMount() {
    this.getData();
  }
  render() {
    const { data, visible, isFullScreen, title, rowId } = this.state;
    const init = this.field.init;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="组别管理"
            buttonText="添加组别"
            style={styles.title}
            onClick={() => this.addTeam(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }}>
            <Table.Column
              dataIndex="team_name"
              title="组名"
            />
            <Table.Column dataIndex="mark" title="备注" />
            {/* <Table.Column dataIndex="email" title="邮箱" />
            <Table.Column dataIndex="role" title="职位" />
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
                  <Col l="5" style={styles.formLabel}>
                    <span>组名：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="teamName" required message="请输入组别名称">
                      <Input
                        name="teamName"
                        placeholder="输入组别名称"
                        style={{ width: '150px' }}
                        {...init('teamName', { initValue: '123' })}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="teamName" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="5" style={styles.formLabel}>
                    <span>备注：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="mark">
                      <Input.TextArea placeholder="输入备注" name="mark" {...init('mark', { initValue: '' })} maxLength={200} hasLimitHint />
                    </FormBinder>
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
