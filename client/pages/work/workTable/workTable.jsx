import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Dialog, Button, Grid, Input, Message, Select, Form } from '@alifd/next';
import IceLabel from '@icedesign/label';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../../components/ContainerTitle';
import WorkForm from '../workForm';

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
export default class workTable extends Component {
  state = {
    dataSource: [],
    loading: false,
    visible: false,
    rowValue: {},
  };

  addWork = () => {
    this.props.history.push('/add/work');
  }

  getWorking = async () => {
    let { dataSource } = this.state;
    const res = await axios.post('/api/getWorking', {});
    dataSource = res.data.workData;
    this.setState({
      dataSource,
    });
  }

  renderStatus = (value) => {
    let status = '';
    if (value === 'interview') {
      status = '面谈';
    } else if (value === 'income') {
      status = '进件';
    } else if (value === 'loan') {
      status = '放款';
    }
    return (
      <div>
        <IceLabel inverse={false} status="success" key={value} style={{ marginTop: '5px' }}>{status}</IceLabel>
      </div>
    );
  }

  changeWork = (value, row) => {
    this.setState({
      visible: true,
      rowValue: row,
    });
  }

  closeDialog = () => {
    this.setState({
      visible: false,
    });
  }

  renderOper = (value, index, row) => {
    return (
      <div>
        <Button
          type="primary"
          onClick={() => this.changeWork(value, row)}
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
  }

  TableColumns = [
    {
      title: '进程量',
      dataIndex: 'num',
      key: 'num',
      lock: true,
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      lock: true,
      width: 100,
    },
    {
      title: '组别',
      dataIndex: 'teamName',
      key: 'teamName',
      lock: true,
      width: 100,
    },
    {
      title: '组员',
      dataIndex: 'memberName',
      key: 'memberName',
      lock: true,
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'lastTime',
      key: 'lastTime',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      cell: this.renderStatus,
      width: 100,
    },
    {
      title: '进件数',
      dataIndex: 'income',
      key: 'income',
      width: 100,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      width: 100,
    },
    {
      title: '放款金额',
      dataIndex: 'money',
      key: 'money',
      width: 100,
    },
  ]

  putTableColumns = () => {
    if (global.user && global.user.authority !== 'guest') {
      this.TableColumns.push({
        title: '回款',
        dataIndex: 'received',
        key: 'received',
        width: 100,
      }, {
        title: '返点',
        dataIndex: 'returnPoint',
        key: 'returnPoint',
        width: 100,
      }, {
        title: '返利',
        dataIndex: 'rebate',
        key: 'rebate',
        width: 100,
      });
    }
    this.TableColumns.push({
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      cell: this.renderOper,
      width: 200,
      lock: 'right',
    });
  }

  async componentWillMount() {
    this.putTableColumns();
    this.getWorking();
    console.log(this.state);
  }
  render() {
    const { dataSource, loading, visible, rowValue } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="进程管理"
            buttonText="添加进程"
            style={styles.title}
            onClick={() => this.addWork()}
          />
          <Table dataSource={dataSource} hasBorder={false} loading={loading} style={{ padding: '20px' }}>
            {this.TableColumns.map((item) => {
            return (
              <Table.Column
                title={item.title}
                dataIndex={item.dataIndex}
                key={item.key}
                sortable={item.sortable || false}
                cell={item.cell}
                width={item.width || 'auto'}
                lock={item.lock}
              />
            );
          })}
          </Table>
        </IceContainer>
        <WorkForm
          visible={visible}
          rowValue={rowValue}
          closeDialog={this.closeDialog}
        />
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
