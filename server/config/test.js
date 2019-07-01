const { query, format } = require('../config/sqlModel.js');

async function updateDate() {
  // const sql = 'SELECT * FROM customer ';
  // return query(sql);
  // const customerData = await query(sql).then(result => { return result; });
  // console.log(customerData);

  const custArr = ['kkkk', '315', '测试客户'];
  const date = '2018-04-15';
  for await (const item of custArr) {
    const sql = `SELECT * FROM customer where name = '${item}'`;
    const customerData = await query(sql).then(result => { return result; });
    console.log(customerData[0].id);
    const post = { create_date: date, update_date: date, interview_date: date, income_date: date, loan_date: date };
    const updateWork = `UPDATE work SET ? where customer_id = '${customerData[0].id}'`;
    const updateDetail = `UPDATE workDetail SET ? where customer_id = '${customerData[0].id}'`;
    query(updateWork, post);
    query(updateDetail, post);
  }
}
updateDate();

