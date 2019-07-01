const Report = require('../lib/report.js');

class ReportController {
  async getMoneyReport(ctx) {
    const { value, year, type } = ctx.request.body;
    const report = new ReportController();
    let data = [];
    switch (value) {
      case 1:
        data = await report.search12month(year, type);
        break;

      default:
        console.log('搜索过去12个月');
        data = await report.search12month(0, type);
        break;
    }
    ctx.body = {
      status: 200,
      statusText: '查询历史成功',
      data,
    };
  }

  async search12month(year, query) {
    const report = new ReportController();
    let monthArr = [];
    if (year === 0) {
      monthArr = report.getMonth();
    } else {
      monthArr = report.getMonthOfYear(year);
    }
    const sumData = await Report.getMonthSum(query);
    const data = [];
    const allMonthMap = report.listToMap(sumData);
    for (const month of monthArr) {
      let isMonth = true;
      const lastYear = report.getLastYear(month);
      const lastMonth = report.getLastMonth(month);
      for (const item of sumData) {
        if (item.MONTH === month) {
          data.push({
            month: item.MONTH,
            sum: item.SUM ? item.SUM : 0,
            lastYear: allMonthMap[lastYear] ? allMonthMap[lastYear] : 0,
            lastMonth: allMonthMap[lastMonth] ? allMonthMap[lastMonth] : 0,
          });
          isMonth = false;
          break;
        }
      }
      if (isMonth) {
        data.push({
          month,
          sum: 0,
          lastYear: allMonthMap[lastYear] ? allMonthMap[lastYear] : 0,
          lastMonth: allMonthMap[lastMonth] ? allMonthMap[lastMonth] : 0,
        });
      }
    }
    return data;
  }


  getMonth() {
    const dataArr = [];
    const data = new Date();
    data.setMonth(data.getMonth() + 1, 1);// 获取到当前月份,设置月份
    for (let i = 0; i < 12; i++) {
      data.setMonth(data.getMonth() - 1);// 每次循环一次 月份值减1
      let m = data.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      dataArr.push(`${data.getFullYear()}-${m}`);
    }
    return dataArr.reverse();
  }

  getMonthOfYear(year) {
    const dataArr = [];
    const data = new Date(`${year}-12`);
    data.setMonth(data.getMonth() + 1, 1);// 获取到当前月份,设置月份
    for (let i = 0; i < 12; i++) {
      data.setMonth(data.getMonth() - 1);// 每次循环一次 月份值减1
      let m = data.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      dataArr.push(`${data.getFullYear()}-${m}`);
    }
    return dataArr.reverse();
  }

  listToMap(list) {
    const map = {};
    for (const index in list) {
      if (Object.prototype.hasOwnProperty.call(list, index) && (list[index].MONTH !== null)) {
        map[list[index].MONTH] = list[index].SUM;
      }
    }
    return map;
  }
  getLastYear(month) {
    let m = new Date(month).getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    return `${new Date(month).getFullYear() - 1}-${m}`;
  }
  getLastMonth(month) {
    let m = new Date(month).getMonth();
    m = m < 10 ? `0${m}` : m;
    return `${new Date(month).getFullYear()}-${m}`;
  }
}

module.exports = new ReportController();
