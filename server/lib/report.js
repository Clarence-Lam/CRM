const { query, format } = require('../config/sqlModel.js');

exports.getMonthSum = (param) => {
  const sql = `SELECT DATE_FORMAT(loan_date,'%Y-%m') AS MONTH,SUM(${param}) as SUM FROM workDetail WHERE isWork='0' GROUP BY DATE_FORMAT(loan_date,'%Y-%m');`;
  return query(sql);
};

exports.formatSql = (param) => {
  const sql = `SELECT*FROM customer where isDelete = '0' ${param} order by create_date desc, id desc`;
  return format(sql);
};

