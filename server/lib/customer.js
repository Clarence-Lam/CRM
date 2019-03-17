const { query, format } = require('../config/sqlModel.js');

exports.getCustomer = (param, limit) => {
  const sql = `SELECT*FROM customer where isDelete = '0' ${param} order by create_date desc, id desc limit ${limit[0]}, ${limit[1]} `;
  return query(sql);
};
exports.getCustomerTotal = (param) => {
  const sql = `SELECT COUNT(*) AS count FROM customer where isDelete = '0' ${param}`;
  return query(sql);
};
exports.addCustomer = (values) => {
  const sql = 'INSERT INTO customer SET ?';
  return query(sql, values);
};
exports.getCustomerByIdcard = (values) => {
  const sql = 'SELECT COUNT(*) AS count FROM customer where id_card = ? ';
  return query(sql, values);
};
exports.getCustomerById = (values) => {
  const sql = 'SELECT * FROM customer where id = ? ';
  return query(sql, values);
};
exports.updateCustomer = (values, id) => {
  const sql = `UPDATE customer SET  ? where id = '${id}' `;
  return query(sql, values);
};
exports.deleteCustomerById = (id) => {
  // const sql = 'DELETE FROM customer WHERE id = ?';
  const sql = `UPDATE customer SET  isDelete = '1' where id = '${id}' `;
  return query(sql, id);
};

exports.formatSql = (param, limit) => {
  const sql = `SELECT*FROM customer where isDelete = '0' ${param} order by create_date desc, id desc limit ${limit[0]}, ${limit[1]} `;
  (format(sql, param));
};
