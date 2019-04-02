const { query, format } = require('../config/sqlModel.js');


exports.addWork = (values) => {
  const sql = 'insert into work set ?';
  return query(sql, values);
};

exports.setUnworkBycustomer = (id, newID) => {
  const sql = `update work set isWork = "1" where isWork = "0" and customer_id = "${id}" and id != "${newID}"`;
  return query(sql);
};


exports.getCustomerNum = (values) => {
  const sql = `select * from work where customer_id = "${values}" and isWork = "0"`;
  return query(sql, values);
};

exports.getWork = (values, limit) => {
  // const sql = `select * from work where isWork = "0" ${values} order by update_date desc, id desc limit ${limit[0]}, ${limit[1]}`;
  const sql = `select * from work where isWork = "0" ${values} order by update_date desc, id desc`;
  return query(sql);
};

exports.getWorkTotal = (values) => {
  const sql = `SELECT COUNT(*) AS count from work where isWork = "0" ${values}`;
  return query(sql);
};

exports.getDetailByWorkid = (values, dateSql) => {
  const sql = `select * from workDetail where isWork = "0" and work_id = ? ${dateSql}`;
  return query(sql, values);
};
// 按照客户id查找历史
exports.getDetailByCustomerid = (values, historySql) => {
  const sql = `select * from workDetail where isWork = "0" and customer_id = ? ${historySql}`;
  return query(sql, values);
};
// 按照workID并interview_date查找work
exports.getWorkbyInterview = (values, historySql) => {
  const sql = `select * from work where id = ? ${historySql}`;
  return query(sql, values);
};

exports.updateWork = (id, values) => {
  const sql = `update work set ? where id = '${id}'`;
  return query(sql, values);
};

exports.addIncomeInDetail = (values) => {
  const sql = 'insert into workDetail set ?';
  return query(sql, values);
};

exports.setDetailUnwork = (values) => {
  const sql = 'update workDetail set isWork = "1" where work_id = ? ';
  return query(sql, values);
};

exports.updateWorkDetail = (id, values) => {
  const sql = `update workDetail set ? where id = '${id}' `;
  return query(sql, values);
};

exports.getAllDetailbyCustomerId = (id) => {
  const sql = 'select * from work where customer_id = ? order by update_date desc, id desc';
  return query(sql, id);
};

exports.getDetailbyId = (id) => {
  const sql = 'select * from workDetail where id = ?';
  return query(sql, id);
};

exports.formatSql = (id, values) => {
  const sql = `update workDetail set ? where id = '${id}' `;
  return format(sql, values);
};
