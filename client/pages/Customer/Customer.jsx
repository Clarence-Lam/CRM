import React, { Component } from 'react';
import CustomerTable from './components/CustomerTable';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <CustomerTable />
      </div>
    );
  }
}
