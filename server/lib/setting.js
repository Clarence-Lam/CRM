const { query, format } = require('../config/sqlModel.js');

exports.addTeam = (value) => {
  const sql = 'INSERT INTO team SET id=?,team_name=?,mark=?,create_date=?,update_date=?;';
  return query(sql, value);
};

exports.getTeam = () => {
  const sql = 'SELECT*FROM team ORDER BY create_date DESC';
  return query(sql);
};

exports.updateTeam = (value) => {
  const sql = `UPDATE team 
  SET team_name = ?,
  mark = ?,
  update_date = ?
  WHERE
    id = ?`;
  return query(sql, value);
};

exports.addMember = (value) => {
  const sql = 'INSERT INTO member SET id=?,team_id=?,team_name=?,member_name=?,mark=?,create_date=?,update_date=?;';
  return query(sql, value);
};

exports.getMember = () => {
  const sql = 'SELECT*FROM member ORDER BY create_date DESC';
  return query(sql);
};

exports.updateMember = (value) => {
  const sql = `UPDATE member 
  SET team_id = ?,
  team_name = ?,
  member_name = ?,
  mark = ?,
  update_date = ?
  WHERE
    id = ?`;
  return query(sql, value);
};

exports.deleteMember = (value) => {
  const sql = 'DELETE FROM member WHERE id = ?';
  return query(sql, value);
};

exports.getTag = (value) => {
  const sql = 'SELECT * FROM tag';
  return query(sql, value);
};

exports.addTag = (value) => {
  const sql = 'INSERT INTO tag SET ?';
  return query(sql, value);
};

exports.updateTag = (value) => {
  const sql = 'UPDATE tag SET name = ? WHERE id =?';
  return query(sql, value);
};
exports.deleteTag = (value) => {
  const sql = 'DELETE FROM tag WHERE id = ?';
  return query(sql, value);
};

exports.formatSql = (sql, value) => {
  return format(sql, value);
};

