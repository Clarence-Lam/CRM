const Work = require('../lib/work.js');
const Form = require('../lib/form.js');
const Customer = require('../lib/customer.js');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

class WorkController {
  async addWork(ctx) {
    const { customer_id, member_id, mark, isAdd } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const uuid = uuidv1();
    const user_id = ctx.session.userId;
    const work = new WorkController();

    let num = (await work.getCustomerNum(customer_id));
    if (isAdd) {
      num += 1;
    }
    const post = { id: uuid, customer_id, member_id, user_id, create_date: datetime, num, update_date: datetime, status: 'interview', interview_date: datetime, mark };
    await Work.addWork(post).then(result => {
      work.setUnworkByCustomer(customer_id, uuid);
      ctx.body = {
        status: 200,
        statusText: '操作成功',

      };
      return result;
    });
  }

  async toWork(ctx) {
    const { customer_id, member_id, mark, isAdd, work_id, num } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const uuid = uuidv1();
    const user_id = ctx.session.userId;
    const work = new WorkController();

    // let num = (await work.getCustomerNum(customer_id));
    // if (isAdd) {
    //   num += 1;
    // }
    const post = { id: uuid, customer_id, member_id, user_id, income: null, platform: null, product: null, income_date: null, update_date: datetime, status: 'interview', interview_date: datetime, mark, num };
    await work.updateWork(work_id, post);
    ctx.body = {
      status: 200,
      statusText: '操作成功',

    };
  }

  // 设置原有的客户进程为结束
  async setUnworkByCustomer(id, uuid) {
    await Work.setUnworkBycustomer(id, uuid);
  }

  async getCustomerNum(id) {
    const result = await Work.getCustomerNum(id);
    return (result.length > 0) ? result[0].num : 0;
  }
  /**
 *
 * @param {*} ctx
 *
 * 好复杂好复杂
 * 一：先查询是否现有，现有则查询放款时间，放款时间存在其中一个平台，则只显示该平台
 * 二：无现有则查询历史，有历史则显示现有
 * 三：无现有无历史，则为新增面谈，并排除非搜索字段
 *
 */
  async getWorking(ctx) {
    const authority = ctx.session.authority;
    let _sql = '';
    let dateSql = '';
    let historySql = '';
    if (authority === 'guest') {
      const userId = ctx.session.userId;
      _sql += `and user_id = "${userId}"`;
    }

    const searchQuery = ctx.request.body.searchQuery;
    let searchHistory = false;
    for (const prop in searchQuery) {
      if (Object.prototype.hasOwnProperty.call(searchQuery, prop) && (searchQuery[prop].length !== 0)) {
        // console.log(prop);
        // console.log(searchQuery[prop]);
        // console.log(typeof (searchQuery[prop]));
        if (typeof (searchQuery[prop]) === 'string') {
          if (prop === 'platform' || prop === 'product') {
            searchHistory = true;
            historySql += `and ${prop} LIKE '%${searchQuery[prop]}%'`;
            dateSql += `and ${prop} LIKE '%${searchQuery[prop]}%'`;
          } else {
            _sql += `and ${prop} LIKE '%${searchQuery[prop]}%'`;
          }
        } else if (typeof (searchQuery[prop]) === 'object') {
          searchHistory = true;
          const time = searchQuery[prop];
          const startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00');
          const endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59');

          dateSql += `and ${prop} between '${startTime}' and '${endTime}'`;
          historySql += `and ${prop} between '${startTime}' and '${endTime}'`;
        }
      }
    }
    const pageNum = parseInt(ctx.request.body.pageIndex || 1, 10);// 页码
    const end = 10; // 默认页数
    const start = (pageNum - 1) * end;
    const limit = [start, end];
    const workData = await Work.getWork(_sql, limit);
    let total = await Work.getWorkTotal(_sql);
    const data = [];
    for await (const item of workData) {
      const customer = await Form.getCustomerbyId(item.customer_id);
      const member = await Form.getMemberbyId(item.member_id);
      const details = await Work.getDetailByWorkid(item.id, dateSql);
      const historys = await Work.getDetailByCustomerid(item.customer_id, historySql);
      const customerName = customer[0].name;
      const phone = customer[0].phone;
      const id_card = customer[0].id_card;
      const teamName = member[0].team_name;
      const memberName = member[0].member_name;
      const lastTime = item.update_date.substring(0, 10);
      let platform = [];
      let product = [];
      let incomeForm = [];
      let money = 0;
      let received = 0;
      let return_point = 0;
      let rebate = 0;
      for await (const detail of details) {
        incomeForm.push({
          platform: detail.platform,
          product: detail.product,
          id: detail.id,
          money: detail.money === null ? undefined : detail.money,
          received: detail.received === null ? undefined : detail.received,
          return_point: detail.return_point === null ? undefined : detail.return_point,
          rebate: detail.rebate === null ? undefined : detail.rebate,
        });
        platform.push(detail.platform);
        product.push(detail.product);
        money += detail.money;
        received += detail.received;
        return_point += detail.return_point;
        rebate += detail.rebate;
      }
      money = money === 0 ? '' : money;
      received = received === 0 ? '' : received;
      return_point = return_point === 0 ? '' : return_point;
      rebate = rebate === 0 ? '' : rebate;
      if (details.length > 0) {
        console.log('查询当前进程');
        data.push({
          ...item,
          customerName,
          teamName,
          memberName,
          lastTime,
          incomeForm,
          platform,
          product,
          money,
          received,
          return_point,
          rebate,
          phone,
          id_card,
          mark: item.mark || '',
        });
      } else if (historys.length > 0) {
        console.log('查询历史进程');
        const nowDetails = await Work.getDetailByWorkid(item.id, '');
        platform = [];
        product = [];
        incomeForm = [];
        money = 0;
        received = 0;
        return_point = 0;
        rebate = 0;
        for await (const nowDetail of nowDetails) {
          incomeForm.push({
            platform: nowDetail.platform,
            product: nowDetail.product,
            id: nowDetail.id,
            money: nowDetail.money === null ? undefined : nowDetail.money,
            received: nowDetail.received === null ? undefined : nowDetail.received,
            return_point: nowDetail.return_point === null ? undefined : nowDetail.return_point,
            rebate: nowDetail.rebate === null ? undefined : nowDetail.rebate,
          });
          platform.push(nowDetail.platform);
          product.push(nowDetail.product);
          money += nowDetail.money;
          received += nowDetail.received;
          return_point += nowDetail.return_point;
          rebate += nowDetail.rebate;
        }
        money = money === 0 ? '' : money;
        received = received === 0 ? '' : received;
        return_point = return_point === 0 ? '' : return_point;
        rebate = rebate === 0 ? '' : rebate;
        data.push({
          ...item,
          customerName,
          teamName,
          memberName,
          lastTime,
          incomeForm,
          platform,
          product,
          money,
          received,
          return_point,
          rebate,
          phone,
          id_card,
          mark: item.mark || '',
        });
      } else {
        console.log('查询特殊进程');
        const interviewWork = await Work.getWorkbyInterview(item.id, historySql);
        if (interviewWork.length > 0) {
          data.push({
            ...item,
            customerName,
            teamName,
            memberName,
            lastTime,
            phone,
            id_card,
            mark: item.mark || '',
            incomeForm: [],
            platform: [],
            product: [],
          });
        }
      }
    }
    const limitData = data.slice((pageNum - 1) * end, (pageNum + 9) * end);
    total = data.length;
    ctx.body = {
      status: 200,
      statusText: '查询成功',
      workData: limitData,
      total,
    };
  }
  // async getWorking(ctx) {
  //   const authority = ctx.session.authority;
  //   let _sql = '';
  //   let dateSql = '';
  //   if (authority === 'guest') {
  //     const userId = ctx.session.userId;
  //     _sql += `and user_id = "${userId}"`;
  //   }

  //   const searchQuery = ctx.request.body.searchQuery;
  //   for (const prop in searchQuery) {
  //     if (Object.prototype.hasOwnProperty.call(searchQuery, prop) && (searchQuery[prop].length !== 0)) {
  //       // console.log(prop);
  //       // console.log(searchQuery[prop]);
  //       // console.log(typeof (searchQuery[prop]));
  //       if (typeof (searchQuery[prop]) === 'string') {
  //         _sql += `and ${prop} LIKE '%${searchQuery[prop]}%'`;
  //       } else if (typeof (searchQuery[prop]) === 'object') {
  //         const time = searchQuery[prop];
  //         const startTime = moment(time[0]).format('YYYY-MM-DD 00:00:00');
  //         const endTime = moment(time[1]).format('YYYY-MM-DD 23:59:59');
  //         if (prop === 'interview_date') {
  //           _sql += `and ${prop} between '${startTime}' and '${endTime}'`;
  //         } else {
  //           dateSql += `and ${prop} between '${startTime}' and '${endTime}'`;
  //         }
  //       }
  //     }
  //   }
  //   const pageNum = parseInt(ctx.request.body.pageIndex || 1, 10);// 页码
  //   const end = 10; // 默认页数
  //   const start = (pageNum - 1) * end;
  //   const limit = [start, end];
  //   const workData = await Work.getWork(_sql, limit);
  //   const total = await Work.getWorkTotal(_sql);
  //   const data = [];
  //   for await (const item of workData) {
  //     const customer = await Form.getCustomerbyId(item.customer_id);
  //     const member = await Form.getMemberbyId(item.member_id);
  //     const details = await Work.getDetailByWorkid(item.id, dateSql);
  //     const customerName = customer[0].name;
  //     const phone = customer[0].phone;
  //     const id_card = customer[0].id_card;
  //     const teamName = member[0].team_name;
  //     const memberName = member[0].member_name;
  //     const lastTime = item.update_date.substring(0, 10);
  //     const platform = [];
  //     const product = [];
  //     const incomeForm = [];
  //     let money = 0;
  //     let received = 0;
  //     let return_point = 0;
  //     let rebate = 0;
  //     for await (const detail of details) {
  //       incomeForm.push({
  //         platform: detail.platform,
  //         product: detail.product,
  //         id: detail.id,
  //         money: detail.money === null ? undefined : detail.money,
  //         received: detail.received === null ? undefined : detail.received,
  //         return_point: detail.return_point === null ? undefined : detail.return_point,
  //         rebate: detail.rebate === null ? undefined : detail.rebate,
  //       });
  //       platform.push(detail.platform);
  //       product.push(detail.product);
  //       money += detail.money;
  //       received += detail.received;
  //       return_point += detail.return_point;
  //       rebate += detail.rebate;
  //     }
  //     money = money === 0 ? '' : money;
  //     received = received === 0 ? '' : received;
  //     return_point = return_point === 0 ? '' : return_point;
  //     rebate = rebate === 0 ? '' : rebate;
  //     if (details.length > 0) {
  //       data.push({
  //         ...item,
  //         customerName,
  //         teamName,
  //         memberName,
  //         lastTime,
  //         incomeForm,
  //         platform,
  //         product,
  //         money,
  //         received,
  //         return_point,
  //         rebate,
  //         phone,
  //         id_card,
  //         mark: item.mark || '',
  //       });
  //     } else {
  //       data.push({
  //         ...item,
  //         customerName,
  //         teamName,
  //         memberName,
  //         lastTime,
  //         phone,
  //         id_card,
  //         mark: item.mark || '',
  //         incomeForm: [],
  //         platform: [],
  //         product: [],
  //       });
  //     }
  //   }

  //   ctx.body = {
  //     status: 200,
  //     statusText: '查询成功',
  //     workData: data,
  //     total: total[0].count,
  //   };
  // }

  // 设置为进件
  async toIncome(ctx) {
    const { work_id, status, income, incomeForm, mark, interview_date, member_id, customer_id, num } = ctx.request.body;

    const work = new WorkController();
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    let platform = '';
    let product = '';

    await work.setDetailUnwork(work_id);
    incomeForm.forEach((value, key) => {
      if (key === 0) {
        platform += value.platform;
        product += value.product;
      } else {
        platform += `,${value.platform}`;
        product += `,${value.product}`;
      }
      work.addIncome({ work_id, status, income, platform: value.platform, product: value.product, customer_id, member_id, interview_date, income_date: time, create_date: time, update_date: time, mark });
    });
    await work.updateWork(work_id, { status, update_date: time, platform, product, mark, income, income_date: time, member_id, num });
    ctx.body = {
      status: 200,
      statusText: '修改成功',
    };
  }

  async toLoan(ctx) {
    const { work_id, status, incomeForm, mark, member_id, num } = ctx.request.body;
    const work = new WorkController();

    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    let moneys = 0;
    let rebates = 0;
    let receiveds = 0;
    let return_points = 0;
    let platforms = '';
    let products = '';
    for await (const iterator of incomeForm) {
      const { id, money, rebate, received, return_point, platform, product } = iterator;
      const res = await work.getDetailbyId(id);
      let post = { money, rebate, received, return_point, mark, update_date: time, platform, product, member_id };
      if ((money && res.money !== money)
      || (rebate && res.rebate !== rebate)
      || (received && res.received !== received)
      || (return_point && res.return_point !== return_point)) {
        post = { money, rebate, received, return_point, mark, update_date: time, loan_date: time, platform, product, member_id };
      }
      moneys += iterator.money ? iterator.money : 0;
      rebates += iterator.rebate ? iterator.rebate : 0;
      receiveds += iterator.received ? iterator.received : 0;
      return_points += iterator.return_point ? iterator.return_point : 0;
      await work.updateWorkDetail(id, post);
    }
    incomeForm.forEach((value, key) => {
      if (key === 0) {
        platforms += value.platform;
        products += value.product;
      } else {
        platforms += `,${value.platform}`;
        products += `,${value.product}`;
      }
    });
    await work.updateWork(work_id, { status, update_date: time, mark, num, loan_date: time, money: moneys, rebate: rebates, received: receiveds, return_point: return_points, member_id, platform: platforms, product: products });
    ctx.body = {
      status: 200,
      statusText: '修改成功',
    };
  }

  async getWorkDetail(ctx) {
    const { work_id, customer_id } = ctx.request.body;
    const works = await Work.getAllDetailbyCustomerId(customer_id);
    const data = [];
    for await (const prop of works) {
      const customer = await Customer.getCustomerById(prop.customer_id);
      if (prop.status === 'interview') {
        data.push({
          name: customer[0].name,
          interview_date: prop.interview_date.substring(0, 10),
        });
      } else {
        const details = await Work.getDetailByWorkid(prop.id, '');
        for await (const detail of details) {
          data.push({
            id: detail.id,
            name: customer[0].name,
            interview_date: detail.interview_date && detail.interview_date.substring(0, 10),
            income_date: detail.income_date && detail.income_date.substring(0, 10),
            loan_date: detail.loan_date && detail.loan_date.substring(0, 10),
            platform: detail.platform,
            product: detail.product,
            money: detail.money,
            received: detail.received,
            return_point: detail.return_point,
            rebate: detail.rebate,
          });
        }
      }
    }
    ctx.body = {
      status: 200,
      statusText: '获取详情成功',
      data,
    };
  }

  async getIncomeForm(ctx) {
    const { id } = ctx.request.body;
    const details = await Work.getDetailByWorkid(id, '');
    const incomeForm = [];
    for await (const detail of details) {
      incomeForm.push({
        platform: detail.platform,
        product: detail.product,
        id: detail.id,
        money: detail.money === null ? undefined : detail.money,
        received: detail.received === null ? undefined : detail.received,
        return_point: detail.return_point === null ? undefined : detail.return_point,
        rebate: detail.rebate === null ? undefined : detail.rebate,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '修改成功',
      incomeForm,
    };
  }

  async changeDetail(ctx) {
    const { id, income_date, interview_date, money, platform, product, rebate, received, return_point, loan_date } = ctx.request.body;
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const post = { income_date, interview_date, loan_date, money, platform, product, rebate, received, return_point, update_date: time };
    const work = new WorkController();
    await work.updateWorkDetail(id, post);
    const res = await work.getDetailbyId(id);
    if (res.length !== null) {
      const results = await Work.getDetailByWorkid(res.work_id, '');
      let moneys = 0;
      let rebates = 0;
      let receiveds = 0;
      let return_points = 0;
      const platforms = [];
      const products = [];
      for await (const item of results) {
        moneys += item.money ? item.money : 0;
        rebates += item.rebate ? item.rebate : 0;
        receiveds += item.received ? item.received : 0;
        return_points += item.return_point ? item.return_point : 0;
        platforms.push(item.platform);
        products.push(item.product);
      }
      const _platform = platforms.join(',');
      const _product = products.join(',');
      const posts = { income_date, interview_date, loan_date, money: moneys, platform: _platform, product: _product, rebate: rebates, received: receiveds, return_point: return_points, update_date: time };
      work.updateWork(res.work_id, posts);
    }

    ctx.body = {
      status: 200,
      statusText: '修改成功',
    };
  }

  // 更改work表的信息
  async updateWork(id, value) {
    await Work.updateWork(id, value);
  }
  // 更新workDetail信息
  async updateWorkDetail(id, value) {
    await Work.updateWorkDetail(id, value);
  }
  // 新增进件信息
  async addIncome(value) {
    const id = uuidv1();
    value = {
      ...value, id,
    };
    await Work.addIncomeInDetail(value);
    return id;
  }
  // 将原有detail设置为1
  async setDetailUnwork(value) {
    await Work.setDetailUnwork(value);
  }
  // 根据detailID查询
  async getDetailbyId(value) {
    const res = await Work.getDetailbyId(value);
    return res[0];
  }
}
module.exports = new WorkController();
