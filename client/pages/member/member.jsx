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
import { async } from 'q';

const { Row, Col } = Grid;
const Option = Select.Option;
const FormItem = Form.Item;


@withRouter
export default class MemberTable extends Component {
  state = {
    data: [],
    visible: false,
    isFullScreen: false,
    title: '新增组员',
    rowId: '',
    dataSource: [],
    teamName: '',
  };
  getMember = async () => {
    let { data } = this.state;
    const res = await axios.get('/api/getMember', {});
    data = res.data.member;

    this.setState({
      data,
    });
  };
  getTeam = async () => {
    let { dataSource } = this.state;
    const res = await axios.get('/api/getTeam', {});
    dataSource = [];
    res.data.team.map((item) => {
      dataSource.push({ label: item.team_name, value: item.id });
    });
    this.setState({
      dataSource,
    });
  }
  addMember = (value, memberName, mark) => {
    let digTitle = '';
    let values = {};
    let rowID = '';
    if (value !== 0) {
      digTitle = '组员修改';
      mark = mark || '';
      values = {
        memberName,
        mark,
      };
      rowID = value;
    } else {
      digTitle = '新增组员';
      rowID = '0';
    }
    this.setState({
      visible: true,
      title: digTitle,
      formValue: values,
      rowId: rowID,
    });
  };
  onChange = (value, s, item) => {
    let { teamName } = this.state;
    teamName = item.label;
    this.setState({
      teamName,
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
        axios.post('/api/deleteMember', { id: index }).then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getMember();
          }
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
      const { teamName } = this.state;
      let url = '';
      if (rowId === '0') {
        url = '/api/addMember';
      } else {
        url = '/api/updateMember';
      }
      console.log(values);
      axios
        .post(url, { id: rowId, ...values, teamName })
        .then((response) => {
          if (response.data.status === 200) {
            Message.success(response.data.statusText);
            this.setState({
              visible: false,
            });
            this.getMember();
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
          onClick={() => this.addMember(value, row.member_name, row.mark)}
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
    this.getMember();
    this.getTeam();
  }
  render() {
    const { data, visible, isFullScreen, title, rowId, dataSource } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="组员管理"
            buttonText="添加组员"
            style={styles.title}
            onClick={() => this.addMember(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }}>
            <Table.Column
              dataIndex="member_name"
              title="姓名"
            />
            <Table.Column dataIndex="team_name" title="组别" />
            <Table.Column dataIndex="mark" title="备注" />
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
                  <Col l="5" style={styles.formLabel}>
                    <span>姓名：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="memberName" required message="请输入组员姓名">
                      <Input
                        name="memberName"
                        placeholder="请输入组员姓名"
                        style={{ width: '150px' }}
                      />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="memberName" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="5" style={styles.formLabel}>
                    <span>组别：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="teamId" required message="请选择组别">
                      <Select dataSource={dataSource} onChange={this.onChange} />
                    </FormBinder>
                    <div style={styles.formErrorWrapper}>
                      <FormError name="teamId" />
                    </div>
                  </Col>
                </Row>
                <Row style={styles.formRow}>
                  <Col l="5" style={styles.formLabel}>
                    <span>备注：</span>
                  </Col>
                  <Col l="19">
                    <FormBinder name="mark">
                      <Input.TextArea placeholder="输入备注" name="mark" />
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
