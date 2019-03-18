const Merit = require('../lib/merit.js');
const Form = require('../lib/form.js');
const moment = require('moment');

class FormController {
  async getInterview(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const merits = await Merit.getWorkRanking(startTime, endTime);
    const total = await Merit.getWorkTotal(startTime, endTime);
    const interview = [];
    let index = 0;
    for await (const merit of merits) {
      const memberName = await Form.getMemberById(merit.member_id);
      interview.push({
        vote: merit.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      interview,
      total: total[0].total,
    };
  }
  async getIncome(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const incomes = await Merit.getIncomeRanking(startTime, endTime);
    const total = await Merit.getIncomeTotal(startTime, endTime);
    const incomeData = [];
    let index = 0;
    for await (const income of incomes) {
      const memberName = await Form.getMemberById(income.member_id);
      incomeData.push({
        vote: income.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      incomeData,
      total: total[0].total,
    };
  }

  async getMoney(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const moneys = await Merit.getMoneyRanking(startTime, endTime);
    const total = await Merit.getMoneyTotal(startTime, endTime);
    const money = [];
    let index = 0;
    for await (const item of moneys) {
      const memberName = await Form.getMemberById(item.member_id);
      money.push({
        vote: item.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      money,
      total: total[0].total,
    };
  }

  async getReceived(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const receiveds = await Merit.getReceivedRanking(startTime, endTime);
    const total = await Merit.getReceivedTotal(startTime, endTime);
    const received = [];
    let index = 0;
    for await (const item of receiveds) {
      const memberName = await Form.getMemberById(item.member_id);
      received.push({
        vote: item.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      received,
      total: total[0].total,
    };
  }

  async getReturnPoint(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const returnPoints = await Merit.getReturnPointRanking(startTime, endTime);
    const total = await Merit.getReturnPointTotal(startTime, endTime);
    const returnPoint = [];
    let index = 0;
    for await (const item of returnPoints) {
      const memberName = await Form.getMemberById(item.member_id);
      returnPoint.push({
        vote: item.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      returnPoint,
      total: total[0].total,
    };
  }

  async getRebate(ctx) {
    const startTime = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    const rebates = await Merit.getRebateRanking(startTime, endTime);
    const total = await Merit.getRebateTotal(startTime, endTime);
    const rebate = [];
    let index = 0;
    for await (const item of rebates) {
      const memberName = await Form.getMemberById(item.member_id);
      rebate.push({
        vote: item.num,
        name: memberName[0].member_name,
        index: ++index,
      });
    }
    ctx.body = {
      status: 200,
      statusText: '查询面谈成功',
      rebate,
      total: total[0].total,
    };
  }
}

module.exports = new FormController();
