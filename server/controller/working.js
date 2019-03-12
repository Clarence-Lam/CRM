const Work = require('../lib/work.js');
const Form = require('../lib/form.js');
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
    await work.setUnworkByCustomer(customer_id);
    const post = { id: uuid, customer_id, member_id, user_id, create_date: datetime, num, update_date: datetime, status: 'interview', interview_date: datetime, mark };
    await Work.addWork(post).then(result => {
      ctx.body = {
        status: 200,
        statusText: '操作成功',

      };
      return result;
    });
  }

  // 设置原有的客户进程为结束
  async setUnworkByCustomer(id) {
    await Work.setUnworkBycustomer(id);
  }

  async getCustomerNum(id) {
    const result = await Work.getCustomerNum(id);
    return (result.length > 0) ? result[0].num : 0;
  }

  async getWorking(ctx) {
    // TODO work search
    const post = {};

    const authority = ctx.session.authority;
    let _sql = '';
    if (authority === 'guest') {
      const userId = ctx.session.userId;
      _sql += `and user_id = "${userId}"`;
    }

    const workData = await Work.getWork(_sql);
    const data = [];
    for await (const item of workData) {
      const customer = await Form.getCustomerbyId(item.customer_id);
      const member = await Form.getMemberbyId(item.member_id);
      const customerName = customer[0].name;
      const teamName = member[0].team_name;
      const memberName = member[0].member_name;
      const lastTime = item.update_date.substring(0, 10);
      data.push({
        ...item,
        customerName,
        teamName,
        memberName,
        lastTime,
      });
    }

    ctx.body = {
      status: 200,
      statusText: '查询成功',
      workData: data,
    };
  }
}
module.exports = new WorkController();
