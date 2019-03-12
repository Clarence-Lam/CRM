const { query, format } = require('../config/sqlModel.js');


exports.addWork = (values) => {
  const sql = 'insert into work set ?';
  return query(sql, values);
};

exports.setUnworkBycustomer = id => {
  const sql = `update work set isWork = "1" where isWork = "0" and customer_id = "${id}"`;
  return query(sql);
};


exports.getCustomerNum = (values) => {
  const sql = `select * from work where customer_id = "${values}" and isWork = "0"`;
  return query(sql, values);
};

exports.getWork = (values) => {
  const sql = 'select * from work where isWork = "0"';
  return query(sql, values);
};

exports.formatSql = (values) => {
  const sql = `select num from work where customer_id = "${values}" and isWork = "0"`;
  return format(sql, values);
};
