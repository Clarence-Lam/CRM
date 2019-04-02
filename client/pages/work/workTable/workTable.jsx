import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import cloneDeep from 'lodash.clonedeep';
import { Table, Dialog, Button, Grid, Input, Message, Select, Form, Pagination } from '@alifd/next';
import IceLabel from '@icedesign/label';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../../components/ContainerTitle';
import SearchForm from '../searchForm/searchWork';
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

const defaultSearchQuery = {
  // id: '',
  name: '',
  status: '',
  platform: '',
  product: '',
  member_id: '',
  interview_date: [],
  income_date: [],
  loan_date: [],
};

@withRouter
export default class workTable extends Component {
  state = {
    dataSource: [],
    loading: false,
    visible: false,
    rowValue: {},
    searchQuery: cloneDeep(defaultSearchQuery),
    pageIndex: 1,
    total: 0,
    expoetLoading: false,
  };

  addWork = () => {
    this.props.history.push('/add/work');
  }

  getWorking = async () => {
    this.setState({
      loading: true,
    });
    let { dataSource, pageIndex, searchQuery } = this.state;
    const res = await axios.post('/api/getWorking', { pageIndex, searchQuery });
    dataSource = res.data.workData;
    this.setState({
      dataSource,
      loading: false,
      total: res.data.total,
    });
  }

  changeLoading = () => {
    this.setState({
      loading: !this.state.loading,
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
          onClick={() => this.getDetail(value, row)}
          type="secondary"
          warning
        >
          查看详情
        </Button>
      </div>
    );
  }

  renderPlatformProduct = (value, index, row) => {
    let s = '';
    if (value) {
      value.forEach((item, key) => {
        if (key === 0) {
          s += item;
        } else {
          s += `,${item}`;
        }
      });
    }
    return (
      <div>
        {s}
      </div>
    );
  }

  onSearchSubmit = (searchQuery) => {
    this.setState(
      {
        searchQuery,
        pageIndex: 1,
      },
    );
    this.getWorking();
  }
  onSearchReset =async () => {
    await this.setState({
      searchQuery: cloneDeep(defaultSearchQuery),
    });
    this.getWorking();
  };

  getDetail = (value, row) => {
    this.props.history.push({
      pathname: `/workDetail/${value}`,
      state: {
        id: value,
        customerName: row.customerName,
        teamName: row.teamName,
        memberName: row.memberName,
        phone: row.phone,
        id_card: row.id_card,
        customer_id: row.customer_id,
      },
    });
  }

  onPaginationChange = (pageIndex) => {
    this.setState(
      {
        pageIndex,
      },
      this.getWorking
      // console.log(this.state)
    );
  };
  onExport =async () => {
    this.setState({
      expoetLoading: true,
    });
    const searchQuery = this.state.searchQuery;
    axios.post('/api/exportWork', { searchQuery })
      .then((res) => { // 处理返回的文件流
        this.setState({
          expoetLoading: false,
        });
        if (res.data.status === 200) {
          window.location.href = res.data.url;
        } else if (res.data.status === 403) {
          Message.success('登陆超时，请重新登陆');
          history.push('/#/user/login');
          location.reload();
        }
      }).catch(err => {
        console.log(err);
        // Message.warning('网络异常，请稍后再试');
      });
  };

  TableColumns = [
    {
      title: '进程量',
      dataIndex: 'num',
      key: 'num',
      lock: true,
      width: 80,
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
      width: 70,
    },
    {
      title: '组员',
      dataIndex: 'memberName',
      key: 'memberName',
      lock: true,
      width: 70,
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
      width: 60,
    },
    {
      title: '进件数',
      dataIndex: 'income',
      key: 'income',
      width: 70,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      cell: this.renderPlatformProduct,
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
      cell: this.renderPlatformProduct,
      width: 150,
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
        dataIndex: 'return_point',
        key: 'return_point',
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
  }
  render() {
    const { dataSource, loading, visible, rowValue, searchQuery, pageIndex, total, expoetLoading } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="进程管理"
            buttonText="添加进程"
            style={styles.title}
            onClick={() => this.addWork()}
          />
          <SearchForm
            value={searchQuery}
            onChange={this.onSeacrhChange}
            onSubmit={this.onSearchSubmit}
            onReset={this.onSearchReset}
            expoetLoading={expoetLoading}
            onExport={this.onExport}
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
          <Pagination
            style={styles.pagination}
            current={pageIndex}
            onChange={this.onPaginationChange}
            total={total}
            pageSize={10}
          />
        </IceContainer>
        <WorkForm
          visible={visible}
          rowValue={rowValue}
          closeDialog={this.closeDialog}
          getWorking={this.getWorking}
          changeLoading={this.changeLoading}
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
  pagination: {
    margin: '20px',
    textAlign: 'right',
  },
};
