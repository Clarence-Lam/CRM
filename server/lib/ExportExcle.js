const { query, format } = require('../config/sqlModel.js');

exports.getCustomer = (param) => {
  const sql = `SELECT*FROM customer where isDelete = '0' ${param} order by create_date desc, id desc`;
  return query(sql);
};
exports.getWork = (param) => {
  const sql = `SELECT*FROM work WHERE id !='NULL' ${param} order by create_date desc, id desc`;
  return query(sql);
};

exports.formatSql = (param) => {
  const sql = `SELECT*FROM customer where isDelete = '0' ${param} order by create_date desc, id desc`;
  return format(sql);
};

