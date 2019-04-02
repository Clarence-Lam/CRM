/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@alifd/next';
import CustomForm from '../../Customer/components/searchForm/index';
import axios from 'axios';

export default class searchWork extends Component {
  static displayName = 'searchWork';

  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    onReset: () => {},
  }

  state = {
    showAdvancedFields: false,
    tagData: [],
    TeamMember: [],
    customerData: [],
  };

  /**
   * 提交回调函数
   */
  handleSubmit = (errors, value) => {
    if (errors) {
      console.log({ errors });
      return;
    }

    this.props.onSubmit(value);
  };

  /**
   * 高级搜索
   */
  handleAdvancedSearch = () => {
    const { showAdvancedFields } = this.state;
    this.setState({
      showAdvancedFields: !showAdvancedFields,
    });
  };

  /**
   * 渲染按钮
   */
  renderExtraContent = () => {
    return (
      <Button text style={styles.extraContent} onClick={this.handleAdvancedSearch}>
        高级搜索{' '}
        <Icon
          size="xs"
          type={this.state.showAdvancedFields ? 'arrow-up' : 'arrow-down'}
        />
      </Button>
    );
  };

  getTag = async () => {
    let { tagData } = this.state;
    const res = await axios.get('/api/getTagForSelect', {});
    tagData = res.data.tag;
    this.formConfig[4].componentProps.dataSource = tagData;
    this.setState({
      tagData,
    });
  };

  getTeamMember = async () => {
    let { TeamMember } = this.state;
    const res = await axios.get('/api/getTeamMember', {});
    TeamMember = res.data.teamMember;
    this.formConfig[2].componentProps.dataSource = TeamMember;
    this.setState({
      TeamMember,
    });
  };

  getCustomer = async () => {
    let { customerData } = this.state;
    const res = await axios.post('/api/getCustomerForSelect');
    customerData = res.data.customer;
    this.formConfig[0].componentProps.dataSource = customerData;
    this.setState({
      customerData,
    });
    console.log(this.state);
  };

  formConfig = [
    {
      label: '客户名称',
      component: 'SearchSelect',
      componentProps: {
        placeholder: '请输入客户名称',
        dataSource: this.state.customerData,
      },
      formBinderProps: {
        name: 'customer_id',
        required: false,
        message: '请输入客户名称',
      },
    },
    {
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        dataSource: [{
          value: 'interview',
          label: '面谈',
        }, {
          value: 'income',
          label: '进件',
        }, {
          value: 'loan',
          label: '放款',
        }],
      },
      formBinderProps: {
        name: 'status',
        required: false,
        message: '请选择状态',
      },
    },
    {
      label: '组别组员',
      component: 'CSelect',
      componentProps: {
        placeholder: '请选择',
        dataSource: [],
      },
      formBinderProps: {
        name: 'member_id',
      },
    },
    {
      label: '面谈时间',
      component: 'RangePicker',
      advanced: true,
      componentProps: {
        placeholder: '请选择日期',
      },
      formBinderProps: {
        name: 'interview_date',
      },
    },
    {
      label: '进件时间',
      component: 'RangePicker',
      advanced: true,
      componentProps: {
        placeholder: '请选择日期',
      },
      formBinderProps: {
        name: 'income_date',
      },
    },
    {
      label: '放款时间',
      component: 'RangePicker',
      advanced: true,
      componentProps: {
        placeholder: '请选择日期',
      },
      formBinderProps: {
        name: 'loan_date',
      },
    },
    {
      label: '平台',
      component: 'Input',
      advanced: true,
      componentProps: {
        placeholder: '请输入平台',
      },
      formBinderProps: {
        name: 'platform',
      },
    },
    {
      label: '产品',
      component: 'Input',
      advanced: true,
      componentProps: {
        placeholder: '请输入产品',
      },
      formBinderProps: {
        name: 'product',
      },
    },
    // {
    //   label: '签订时间',
    //   component: 'RangePicker',
    //   advanced: true,
    //   componentProps: {
    //     placeholder: '请选择日期',
    //   },
    //   formBinderProps: {
    //     name: 'signTime',
    //   },
    // },
    // {
    //   label: '终止时间',
    //   component: 'RangePicker',
    //   advanced: true,
    //   componentProps: {
    //     placeholder: '请选择日期',
    //     size: 'large',
    //   },
    //   formBinderProps: {
    //     name: 'endTime',
    //   },
    // },
    // {
    //   label: '合同状态',
    //   component: 'Select',
    //   advanced: true,
    //   componentProps: {
    //     placeholder: '请选择',
    //     dataSource: [],
    //   },
    //   formBinderProps: {
    //     name: 'state',
    //   },
    // },
    // {
    //   label: '合同类型',
    //   component: 'Select',
    //   advanced: true,
    //   componentProps: {
    //     placeholder: '请选择',
    //     dataSource: [
    //       { label: '主合同', value: 'primary' },
    //       { label: '变更合同', value: 'change' },
    //     ],
    //   },
    //   formBinderProps: {
    //     name: 'type',
    //   },
    // },
    // {
    //   label: '查询我批准的合同',
    //   component: 'Checkbox',
    //   advanced: true,
    //   componentProps: {},
    //   formBinderProps: {
    //     name: 'checkbox',
    //   },
    // },
  ];

  async componentWillMount() {
    this.getTeamMember();
    this.getCustomer();
  }

  render() {
    const { value, onChange, onReset, onExport, expoetLoading } = this.props;
    const { showAdvancedFields } = this.state;

    const config = showAdvancedFields ? this.formConfig : (
      this.formConfig.filter(item => !item.advanced)
    );

    return (
      <CustomForm
        config={config}
        value={value}
        formChange={onChange}
        handleSubmit={this.handleSubmit}
        handleReset={onReset}
        extraContent={this.renderExtraContent()}
        handleExport={onExport}
        expoetLoading={expoetLoading}
      />
    );
  }
}

const styles = {
  extraContent: {
    position: 'absolute',
    right: '15px',
    bottom: '10px',
  },
};
