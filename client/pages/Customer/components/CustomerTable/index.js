import React, { Component } from 'react';
import IceContainer from '@icedesign/container';

import cloneDeep from 'lodash.clonedeep';
import PropTypes from 'prop-types';
import { Table, Dialog, Button, Pagination, Message } from '@alifd/next';
import IceLabel from '@icedesign/label';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../../../components/ContainerTitle';
import SearchFilter from '../searchForm/SearchFilter';
import axios from 'axios';
import { async } from 'q';

const defaultSearchQuery = {
  // id: '',
  name: '',
  id_card: '',
  phone: '',
  area: '',
  tag: [],
  member_id: '',
  create_date: [],
};

@withRouter
export default class CustomerTable extends Component {
  static propTypes = {
    enableFilter: PropTypes.bool,
    searchQueryHistory: PropTypes.object,
  };

  static defaultProps = {
    enableFilter: true,
    searchQueryHistory: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      searchQuery: cloneDeep(defaultSearchQuery),
      pageIndex: 1,
      total: 0,
      // dataSource: [],
      expoetLoading: false,
    };
  }

  // state = {
  //   data: [],
  //   searchQuery: cloneDeep(defaultSearchQuery),
  // };

  handleRedirect = (rowId) => {
    if (rowId === '0') {
      this.props.history.push('/add/customer');
    } else {
      this.props.history.push({
        pathname: `/add/customer/${rowId}`,
        state: {
          id: rowId,
        },
      });
    }
  };

  handleDelete = (index) => {
    Dialog.confirm({
      title: '提示',
      content: '确认删除吗',
      onOk: () => {
        this.deleteCustomerById(index);
      },
    });
  };

  deleteCustomerById= (id) => {
    this.setState({
      loading: true,
    });
    axios
      .post('/api/deleteCustomerById', { id })
      .then((response) => {
        if (response.data.status === 200) {
          Message.success(response.data.statusText);
        } else {
          Message.warning(response.data.statusText);
        }
        this.setState({
          loading: false,
        });
        this.getCustomer();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSearchSubmit = (searchQuery) => {
    // let { create_date } = searchQuery;
    // create_date = [create_date[0] && create_date[0].format('YYYY-MM-DD 00:00:00'), create_date[1] && create_date[1].format('YYYY-MM-DD 23:59:59')];
    // searchQuery.create_date = create_date;
    this.setState(
      {
        searchQuery,
        pageIndex: 1,
      },
      this.getCustomer
    );
  };
  fetchDataSource = () => {
    this.setState({
      loading: true,
    });
    console.log(this.state);
    const { createTime } = this.state.searchQuery;
    console.log(createTime[0] && createTime[0].format('YYYY-MM-DD'), createTime[1] && createTime[1].format('YYYY-MM-DD'));
  }

  renderTime = (value) => {
    return value.substring(0, 10);
  }

  renderOper = (value, index, row) => {
    if (global.user && global.user.authority === 'admin') {
      return (
        <div>
          <Button
            type="primary"
            onClick={() => this.handleRedirect(value, row)}
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
    return (
      <div>
        <Button
          type="primary"
          onClick={() => this.handleRedirect(value, row)}
          style={{ marginRight: '10px' }}
        >
          修改
        </Button>
      </div>
    );
  };
  renderPhone = (value) => {
    let authority = '';
    if (global.user && global.user.authority) {
      authority = global.user.authority;
    }
    if (authority === 'admin') {
      return value;
    }
    return `${value.substring(0, 3)}******${value.substring(9)}`;
  }

  renderTag = (value) => {
    return (
      <div>
        {value.map((item) => {
        return <IceLabel inverse={false} status="success" key={item} style={{ marginTop: '5px' }}>{item}</IceLabel>;
      })}
      </div>
    );
  }

  onPaginationChange = (pageIndex) => {
    this.setState(
      {
        pageIndex,
      },
      this.getCustomer
      // console.log(this.state)
    );
  };

  getCustomer = async () => {
    this.setState({
      loading: true,
    });
    let { data, pageIndex, searchQuery } = this.state;
    // let create_date = searchQuery.create_date;
    // create_date = [create_date[0] && create_date[0].format('YYYY-MM-DD 00:00:00'), create_date[1] && create_date[1].format('YYYY-MM-DD 23:59:59')];
    // searchQuery.create_date = create_date;
    this.setState({
      searchQuery,
    });
    await axios.post('/api/getCustomer', { pageIndex, searchQuery }).then((response) => {
      data = response.data.customer;
      const total = response.data.total;
      this.setState({
        data,
        total,
        loading: false,
      });
    }).catch((error) => {
      console.log(error);
      Message.Error('网络异常，请稍后再试。');
    });
  }

  onSearchReset =async () => {
    await this.setState({
      searchQuery: cloneDeep(defaultSearchQuery),
    });
    this.getCustomer();
  };
  onExport =async () => {
    this.setState({
      expoetLoading: true,
    });
    const searchQuery = this.state.searchQuery;
    axios.post('/api/exportCustomer', { searchQuery })
      .then((res) => { // 处理返回的文件流
        this.setState({
          expoetLoading: false,
        });
        if (res.data.status === 200) {
          window.location.href = res.data.url;
        }
      });
  };
  async componentWillMount() {
    this.getCustomer();
  }
  render() {
    const { enableFilter } = this.props;
    const { data, searchQuery, loading, pageIndex, total, expoetLoading } = this.state;
    return (
      <IceContainer style={styles.container}>
        <ContainerTitle
          title="客户列表"
          buttonText="添加客户"
          style={styles.title}
          onClick={() => this.handleRedirect('0')}
        />
        {enableFilter && (
          <SearchFilter
            value={searchQuery}
            onChange={this.onSeacrhChange}
            onSubmit={this.onSearchSubmit}
            onReset={this.onSearchReset}
            onExport={this.onExport}
            expoetLoading={expoetLoading}
          />
        )}
        {/* <Table dataSource={data} hasBorder={false} loading={loading} style={{ padding: '20px' }}>
          {this.getTableColumns().map((item) => {
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
        </Table> */}
        <Table dataSource={data} hasBorder={false} hasHeader style={{ padding: '20px' }} loading={loading} >
          <Table.Column dataIndex="name" title="客户名称" key="name" width="120px" lock />
          <Table.Column dataIndex="id_card" title="身份证" key="id_card" width={170} />
          <Table.Column dataIndex="phone" title="联系方式" cell={this.renderPhone} key="phone" width={120} />
          <Table.Column dataIndex="area" title="区域" key="area" width={80} />
          <Table.Column dataIndex="tag" title="标签" key="tag" cell={this.renderTag} width="180px" />
          <Table.Column dataIndex="team" title="组别" key="team" width={80} />
          <Table.Column dataIndex="member" title="组员" key="member" width={80} />
          <Table.Column dataIndex="create_date" title="创建时间" key="create_date" width={150} cell={this.renderTime} />
          <Table.Column dataIndex="id" title="操作" cell={this.renderOper} key="id" width="150px" lock="right" />
        </Table>
        <Pagination
          style={styles.pagination}
          current={pageIndex}
          onChange={this.onPaginationChange}
          total={total}
          pageSize={10}
        />
      </IceContainer>
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
  pagination: {
    margin: '20px',
    textAlign: 'right',
  },
  // stateText: {
  //   color: '#5584FF',
  //   border: '1px solid #5584FF',
  //   display: 'inline-block',
  //   padding: '5px 10px',
  //   background: '#fff',
  //   borderRadius: '4px',
  // },

  // link: {
  //   color: 'rgba(85, 132, 255, 0.1)',
  //   margin: '0 5px',
  //   cursor: 'pointer',
  //   textDecoration: 'none',
  // },
  // separator: {
  //   width: '1px',
  //   margin: '0 8px',
  //   height: '12px',
  //   display: 'inline-block',
  //   background: '#F7F8FA',
  //   verticalAlign: 'middle',
  // },
  // pagination: {
  //   margin: '20px 0',
  //   textAlign: 'center',
  // },
};
