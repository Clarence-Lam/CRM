const { query, format } = require('../config/sqlModel.js');


exports.getMemberByTeamId = (value) => {
  const sql = 'SELECT*FROM member where team_id = ? and isDelete = "0"';
  return query(sql, value);
};

exports.getMemberById = (value) => {
  const sql = 'SELECT*FROM member where id = ?';
  return query(sql, value);
};

exports.getTagById = (value) => {
  const sql = 'SELECT*FROM tag where id = ?';
  return query(sql, value);
};

exports.getCustomerForSelect = (_sql) => {
  const sql = `SELECT*FROM customer where isDelete = "0" ${_sql} order by create_date desc,id desc`;
  return query(sql);
};

exports.getCustomerbyId = (value) => {
  const sql = 'SELECT*FROM customer where id = ?';
  return query(sql, value);
};

exports.getMemberbyId = (value) => {
  const sql = 'SELECT*FROM member where id = ?';
  return query(sql, value);
};

// exports.getMemberById = (value) => {
//   const sql = 'SELECT*FROM member';
//   return query(sql, value);
// };

exports.formatSql = (_sql) => {
  const sql = `SELECT*FROM customer where isDelete = "0" ${_sql} order by create_date desc,id desc`;
  return format(sql);
};

