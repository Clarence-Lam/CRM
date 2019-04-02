const CustomerModel = require('../lib/customer');
const Form = require('./form');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const moment = require('moment');
const session = require('koa-session-minimal');

class CustyomerController {
  async getCustomer(ctx) {
    const authority = ctx.session.authority;
    const userId = ctx.session.userId;
    let param = '';
    if (authority === 'guest') {
      param = `and user_id ='${userId}' `;
    }

    const searchQuery = ctx.request.body.searchQuery;
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

    const pageNum = parseInt(ctx.request.body.pageIndex || 1, 10);// 页码
    const end = 10; // 默认页数
    const start = (pageNum - 1) * end;
    const limit = [start, end];
    // await CustomerModel.formatSql(param, limit);
    const customerData = await CustomerModel.getCustomer(param, limit).then(result => { return result; });
    const total = await CustomerModel.getCustomerTotal(param).then(result => { return result; });
    const data = [];
    for await (const item of customerData) {
      const tag = [];
      const tagData = item.tag.split(',');
      for await (const item1 of tagData) {
        const tagName = await Form.getTagById(item1);
        tag.push(tagName);
        // return Promise.resolve(item1);
      }
      const member = await Form.getMemberById(item.member_id);
      data.push({
        id: item.id,
        name: item.name,
        id_card: item.id_card,
        phone: item.phone,
        area: item.area.split(',')[0],
        tag,
        team: member[0].team_name,
        member: member[0].member_name,
        create_date: item.create_date,
      });
      // return Promise.resolve(item);
    }
    ctx.body = {
      status: 200,
      statusText: 'ok',
      customer: data,
      total: total[0].count,
    };
  }

  async addCustomer(ctx) {
    const { name, id_card, phone, member_id, mark } = ctx.request.body;
    const user_id = ctx.session.userId;
    let { area, tag } = ctx.request.body;

    const results = await CustomerModel.getCustomerByIdcard(id_card);
    if (results[0].count !== 0) {
      ctx.body = {
        status: 201,
        statusText: '当前客户信息已存在，请勿重复录入。',
      };
    } else {
      const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
      area = `${area[0]},${area[1]}`;
      let tagData = '';
      for (let i = 0; i < tag.length; i++) {
        if (i === 0) {
          tagData = tag[i];
        } else {
          tagData += (`,${tag[i]}`);
        }
      }
      const uuid = uuidv1();
      const post = { id: uuid, name, id_card, phone, member_id, user_id, area, tag: tagData, mark, create_date: datetime, update_date: datetime };
      await CustomerModel.addCustomer(post).then(result => {
        ctx.body = {
          status: 200,
          statusText: '录入客户信息成功',
          customer: result,
          row: {
            id: uuid,
            name,
            member_id,
          },
        };
      });
    }

    // CustomerModel.formatSql(post);
  }
  async getCustomerById(ctx) {
    const { id } = ctx.request.body;

    const result = await CustomerModel.getCustomerById(id);
    // const childrenData = await Form.getMemberById().then(result => { return result; });
    ctx.body = {
      status: 200,
      statusText: '获取客户信息成功',
      customer: result,
    };


    // CustomerModel.formatSql(post);
  }

  async updateCustomer(ctx) {
    const { id, name, id_card, phone, member_id, mark, tag, user_id } = ctx.request.body;
    let { area } = ctx.request.body;

    const results = await CustomerModel.getCustomerByIdcard(id_card);
    if (results[0].count === 0) {
      ctx.body = {
        status: 201,
        statusText: '查无当前客户信息，请重新选择。',
      };
    } else {
      const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
      area = `${area[0]},${area[1]}`;
      let tagData = '';
      for (let i = 0; i < tag.length; i++) {
        if (i === 0) {
          tagData = tag[i];
        } else {
          tagData += (`,${tag[i]}`);
        }
      }
      const post = { name, id_card, phone, member_id, area, tag: tagData, mark, update_date: datetime, user_id };
      await CustomerModel.updateCustomer(post, id).then(result => {
        ctx.body = {
          status: 202,
          statusText: '客户信息修改成功',
          customer: result,
        };
      });
    }
  }
  async deleteCustomerById(ctx) {
    const { id } = ctx.request.body;

    await CustomerModel.deleteCustomerById(id).then(result => {
      ctx.body = {
        status: 200,
        statusText: '成功删除客户',
        customer: result,
      };
    });
  }
}
module.exports = new CustyomerController();
