/* eslint react/no-string-refs:0, array-callback-return:0, react/forbid-prop-types:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox,
  Input,
  Button,
  Grid,
  Select,
  DatePicker,
  CascaderSelect,
} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

class searchForm extends Component {
  static displayName = 'searchForm';
  state = {
    data: [],
  }
  static propTypes = {
    value: PropTypes.object.isRequired,
    config: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func,
    formChange: PropTypes.func,
    handleReset: PropTypes.func,
    handleExport: PropTypes.func,
    extraContent: PropTypes.element,
  };

  static defaultProps = {
    extraContent: null,
    handleReset: () => {},
    handleSubmit: () => {},
    formChange: () => {},
    handleExport: () => {},
  };

  formChange = (value) => {
    this.props.formChange(value);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      this.props.handleSubmit(errors, values);
    });
  };

  renderInput = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <Input {...item.componentProps} style={{ width: '80%' }} />
          </IceFormBinder>
          <div style={styles.formError}>
            <IceFormError name={item.formBinderProps.name} />
          </div>
        </div>
      </Col>
    );
  };

  renderCheckbox = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <IceFormBinder {...item.formBinderProps}>
            <Checkbox {...item.componentProps}>{item.label}</Checkbox>
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderDatePicker = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <RangePicker {...item.componentProps} style={{ width: '80%' }} format="YYYY-MM-DD" />
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderSelect = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <Select {...item.componentProps} style={{ width: '80%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderMultiple1 = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            <Select mode="multiple" {...item.componentProps} style={{ width: '80%' }} />
            {/* <Select {...item.componentProps} style={{ width: '100%' }} /> */}
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  rendercSelect = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            {/* <Select {...item.componentProps} style={{ width: '100%' }} /> */}
            <CascaderSelect {...item.componentProps} style={{ width: '80%' }} listStyle={{ width: '150px' }} />

          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderSearchSelect = (item) => {
    return (
      <Col l="8" key={item.label}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.label}：</span>
          <IceFormBinder {...item.formBinderProps}>
            {/* <Select {...item.componentProps} style={{ width: '100%' }} /> */}
            {/* <CascaderSelect {...item.componentProps} style={{ width: '80%' }} listStyle={{ width: '150px' }} /> */}
            <Select showSearch placeholder="请选择客户" filterLocal {...item.componentProps} style={{ width: '80%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };
  renderFromItem = (config) => {
    return config.map((item) => {
      if (item.component === 'Input') {
        return this.renderInput(item);
      } else if (item.component === 'Checkbox') {
        return this.renderCheckbox(item);
      } else if (item.component === 'Select') {
        return this.renderSelect(item);
      } else if (item.component === 'RangePicker') {
        return this.renderDatePicker(item);
      } else if (item.component === 'CSelect') {
        return this.rendercSelect(item);
      } else if (item.component === 'Multiple') {
        return this.renderMultiple1(item);
      } else if (item.component === 'SearchSelect') {
        return this.renderSearchSelect(item);
      }
    });
  };


  handleChange(value, data, extra) {
    console.log(value, data, extra);
  }

  render() {
    const { value, config, extraContent, handleReset, handleExport, expoetLoading } = this.props;

    return (
      <div style={styles.formContainer}>
        <IceFormBinderWrapper
          value={value}
          onChange={this.formChange}
          ref="form"
        >
          <div style={styles.formItems}>
            <Row wrap gutter={40} style={styles.row}>
              {this.renderFromItem(config)}
            </Row>
            <div style={styles.buttons}>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={this.handleSubmit}
              >
                搜 索
              </Button>
              <Button type="normal" onClick={handleReset}>
                重 置
              </Button>
              {
                global.user && global.user.authority === 'admin' &&
                <Button type="secondary" onClick={handleExport} style={{ marginLeft: '10px' }} loading={expoetLoading}>
                导 出
                </Button>
              }
            </div>
            {extraContent}
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  formContainer: {
    position: 'relative',
    background: '#fff',
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  formLabel: {
    minWidth: '70px',
  },
  buttons: {
    margin: '10px 0 20px',
    textAlign: 'center',
  },
  row: {
    margin: '0',
  },
};

export default searchForm;
