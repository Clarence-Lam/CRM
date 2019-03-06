const { query, format } = require('../config/sqlModel.js');


exports.getMemberByTeamId = (value) => {
  const sql = 'SELECT*FROM member where team_id = ?';
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

// exports.getMemberById = (value) => {
//   const sql = 'SELECT*FROM member';
//   return query(sql, value);
// };

exports.formatSql = (sql, value) => {
  return format(sql, value);
};

