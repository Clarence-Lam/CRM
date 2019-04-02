/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@alifd/next';
import CustomForm from './index';
import axios from 'axios';
import city from './../../../../static/city.json';

export default class SearchFilter extends Component {
  static displayName = 'SearchFilter';

  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onExport: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    onReset: () => {},
    onExport: () => {},
  }

  state = {
    showAdvancedFields: false,
    tagData: [],
    TeamMember: [],
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
    this.formConfig[5].componentProps.dataSource = TeamMember;
    this.setState({
      TeamMember,
    });
  };

  formConfig = [
    {
      label: '客户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户名称',
      },
      formBinderProps: {
        name: 'name',
        required: false,
        message: '请输入客户名称',
      },
    },
    {
      label: '身份证',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证',
      },
      formBinderProps: {
        name: 'id_card',
        required: false,
        message: '请输入身份证',
      },
    },
    {
      label: '联系方式',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式',
      },
      formBinderProps: {
        name: 'phone',
      },
    },
    {
      label: '区域',
      component: 'CSelect',
      advanced: true,
      componentProps: {
        placeholder: '请选择区域',
        dataSource: city,
      },
      formBinderProps: {
        name: 'area',
      },
    },
    {
      label: '标签',
      component: 'Multiple',
      advanced: true,
      componentProps: {
        placeholder: '请选择标签',
        dataSource: this.state.tagData,
      },
      formBinderProps: {
        name: 'tag',
      },
    },
    {
      label: '组别组员',
      component: 'CSelect',
      advanced: true,
      componentProps: {
        placeholder: '请选择',
        dataSource: [],
      },
      formBinderProps: {
        name: 'member_id',
      },
    },
    {
      label: '创建时间',
      component: 'RangePicker',
      advanced: true,
      componentProps: {
        placeholder: '请选择日期',
      },
      formBinderProps: {
        name: 'create_date',
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
    this.getTag();
    this.getTeamMember();
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
