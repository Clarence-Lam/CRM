import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Dialog, Button, Grid, Input, Message, Select, Form } from '@alifd/next';
import { withRouter } from 'react-router-dom';
import ContainerTitle from '../../../components/ContainerTitle';
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
export default class detailTable extends Component {
  state = {
    data: [],
    detailLoading: false,
  };
  getDetail = async () => {
    if (this.props.location.state) {
      this.setState({
        detailLoading: true,
      });
      const res =
        await axios.post('/api/getWorkDetail',
          {
            work_id: this.props.location.state.id,
            customer_id: this.props.location.state.customer_id,
          });
      this.setState({
        data: res.data.data,
        detailLoading: false,
      });
    }
  }
  changeDetail=(value, row) => {
    this.props.showDialog(value, row);
  }
  renderOper = (value, index, row) => {
    if (value) {
      return (
        <div>
          <Button
            type="primary"
            onClick={() => this.changeDetail(value, row)}
            style={{ marginRight: '10px' }}
          >
            修改
          </Button>
        </div>
      );
    }
  }
  async componentWillMount() {
    this.getDetail();
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  render() {
    const { data, visible, isFullScreen, title, rowId, detailLoading } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="进程详情"
            // buttonText="添加用户"
            style={styles.title}
            // onClick={() => this.register(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }} loading={detailLoading}>
            <Table.Column dataIndex="name" title="客户名称" />
            <Table.Column dataIndex="interview_date" title="面谈时间" />
            <Table.Column dataIndex="income_date" title="进件时间" />
            <Table.Column dataIndex="loan_date" title="放款时间" />
            <Table.Column dataIndex="platform" title="平台" />
            <Table.Column dataIndex="product" title="产品" />
            {global.user && global.user.authority === 'admin' && <Table.Column dataIndex="money" title="放款" />}
            {global.user && global.user.authority === 'admin' && <Table.Column dataIndex="received" title="回款" />}
            {global.user && global.user.authority === 'admin' && <Table.Column dataIndex="return_point" title="返点" />}
            {global.user && global.user.authority === 'admin' && <Table.Column dataIndex="rebate" title="返利" />}
            {global.user && global.user.authority === 'admin' && <Table.Column dataIndex="id" cell={this.renderOper} title="操作" />}
          </Table>
        </IceContainer>
      </div>

    );
  }
}

const styles = {

};
