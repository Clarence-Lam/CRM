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
  };
  getDetail = async () => {
    if (this.props.location.state) {
      const res =
        await axios.post('/api/getWorkDetail',
          {
            work_id: this.props.location.state.id,
            customer_id: this.props.location.state.customer_id,
          });
      this.setState({
        data: res.data.data,
      });
    }
  }
  async componentWillMount() {
    this.getDetail();
  }
  render() {
    const { data, visible, isFullScreen, title, rowId } = this.state;
    return (
      <div>
        <IceContainer style={styles.container}>
          <ContainerTitle
            title="进程详情"
            // buttonText="添加用户"
            style={styles.title}
            // onClick={() => this.register(0)}
          />
          <Table dataSource={data} hasBorder={false} style={{ padding: '20px' }}>
            <Table.Column
              dataIndex="name"
              title="客户名称"
            />
            <Table.Column dataIndex="interview_date" title="面谈时间" />
            <Table.Column dataIndex="income_date" title="进件时间" />
            <Table.Column dataIndex="loan_date" title="放款时间" />
            <Table.Column dataIndex="platform" title="平台" />
            <Table.Column dataIndex="product" title="产品" />
          </Table>
        </IceContainer>
      </div>

    );
  }
}

const styles = {

};
