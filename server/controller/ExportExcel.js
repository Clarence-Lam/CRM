
const ExcleLib = require('../lib/ExportExcle.js');
const Form = require('../lib/form.js');
const excel = require('./excel.js');
const moment = require('moment');

class ExportExcle {
  async exportCustomer(ctx) {
    const { searchQuery } = ctx.request.body;

    const customerTable = [];
    let param = '';
    for (const prop in searchQuery) {
      if (Object.prototype.hasOwnProperty.call(searchQuery, prop) && (searchQuery[prop].length !== 0)) {
        // console.log(prop);
        // console.log(searchQuery[prop]);
        // console.log(typeof (searchQuery[prop]));
        if (typeof (searchQuery[prop]) === 'string') {
          param += ` and ${prop} LIKE '%${searchQuery[prop]}%'`;
        } else if (typeof (searchQuery[prop]) === 'object') {
          if (prop === 'tag') {
            searchQuery[prop].map(item => {
              param += ` and ${prop} LIKE '%${item}%'`;
              return item;
            });
          } else if (prop === 'create_date') {
            const time = searchQuery[prop];
            const startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00');
            const endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59');
            param += ` and ${prop} between '${startTime}' and '${endTime}'`;
          }
        }
      }
    }
    // if (times && times.length > 0) {
    //   const startTime = moment(times[0]).format('YYYY-MM-DD 00:00:00');
    //   const endTime = moment(times[1]).format('YYYY-MM-DD 23:59:59');
    //   param += ` and create_date between '${startTime}' and '${endTime}'`;
    // }
    await ExcleLib.formatSql(param);
    const customerData = await ExcleLib.getCustomer(param).then(result => { return result; });
    for await (const item of customerData) {
      let tag = '';
      const tagData = item.tag.split(',');
      for await (const item1 of tagData) {
        const tagName = await Form.getTagById(item1);
        console.log(tagName[0].name);
        tag += ` ${tagName[0].name}`;
      }
      tag = tag.replace(/(^\s*)|(\s*$)/g, '');
      const member = await Form.getMemberById(item.member_id);
      customerTable.push({
        name: item.name,
        id_card: item.id_card,
        phone: item.phone,
        area: item.area.split(',')[0],
        tag,
        team: member[0].team_name,
        member: member[0].member_name,
        create_date: item.create_date,
        mark: item.mark,
      });
    }
    const time = moment().format('YYYYMMDDHHmmss');
    const params = {
      title: ['客户名称', '身份证', '联系方式', '区域', '标签', '组别', '组员', '备注', '创建时间'],
      key: ['name', 'id_card', 'phone', 'area', 'tag', 'team', 'member', 'mark', 'create_date'],
      data: customerTable,
      autoWidth: true,
      filename: `${time}客户信息`,
    };
    excel.export_array_to_excel(params);

    ctx.body = {
      status: 200,
      statusText: '操作成功',
      url: `${time}客户信息.xlsx`,
    };
  }

  async exportWork(ctx) {
    const searchQuery = ctx.request.body.searchQuery;
    const workTable = [];
    let _sql = '';
    const formatStatus = {
      interview: '面谈',
      income: '进件',
      loan: '放款',
    };
    for (const prop in searchQuery) {
      if (Object.prototype.hasOwnProperty.call(searchQuery, prop) && (searchQuery[prop].length !== 0)) {
        // console.log(prop);
        // console.log(searchQuery[prop]);
        // console.log(typeof (searchQuery[prop]));
        if (typeof (searchQuery[prop]) === 'string') {
          _sql += `and ${prop} LIKE '%${searchQuery[prop]}%'`;
        } else if (typeof (searchQuery[prop]) === 'object') {
          const time = searchQuery[prop];
          const startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00');
          const endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59');
          _sql += `and ${prop} between '${startTime}' and '${endTime}'`;
        }
      }
    }
    const works = await ExcleLib.getWork(_sql);
    for await (const item of works) {
      const customer = await Form.getCustomerbyId(item.customer_id);
      const member = await Form.getMemberbyId(item.member_id);
      const customerName = customer[0].name;
      const teamName = member[0].team_name;
      const memberName = member[0].member_name;
      const status = formatStatus[item.status];
      workTable.push({
        name: customerName,
        team: teamName,
        member: memberName,
        ...item,
        status,
      });
    }


    const time = moment().format('YYYYMMDDHHmmss');
    const params = {
      title: ['进程', '客户名称', '组别', '组员', '最后修改时间', '状态', '进件数', '平台', '产品', '放款金额', '回款', '返点', '返利', '面谈时间', '进件时间', '放款时间', '备注'],
      key: ['num', 'name', 'team', 'member', 'update_date', 'status', 'income', 'platform', 'product', 'money', 'received', 'return_point', 'rebate', 'interview_date', 'income_date', 'loan_date', 'mark'],
      data: workTable,
      autoWidth: true,
      filename: `${time}进程详情`,
    };
    excel.export_array_to_excel(params);

    ctx.body = {
      status: 200,
      statusText: '操作成功',
      url: `${time}进程详情.xlsx`,
    };
  }
}

module.exports = new ExportExcle();
