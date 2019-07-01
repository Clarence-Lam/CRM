const { query, format } = require('../config/sqlModel.js');

exports.addTeam = (value) => {
  const sql = 'INSERT INTO team SET id=?,team_name=?,mark=?,create_date=?,update_date=?;';
  return query(sql, value);
};

exports.getTeam = () => {
  const sql = 'SELECT*FROM team where isDelete = "0" ORDER BY create_date DESC';
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
  const sql = 'SELECT*FROM member where isDelete = "0" ORDER BY create_date DESC';
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
  const sql = 'UPDATE member SET isDelete = "1" WHERE id = ?';
  return query(sql, value);
};

exports.getTag = (value) => {
  const sql = 'SELECT * FROM tag where isDelete = "0"';
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
  const sql = 'UPDATE tag SET isDelete = "1" WHERE id =?';
  return query(sql, value);
};
exports.getMemberByTeamId = (value) => {
  const sql = 'select * from member WHERE team_id =? and isDelete = "0"';
  return query(sql, value);
};
exports.deleteTeam = (value) => {
  const sql = 'UPDATE team SET isDelete = "1" WHERE id =?';
  return query(sql, value);
};

exports.updateTeamNameInMember = (teamName, id) => {
  const sql = `UPDATE member SET team_name = "${teamName}" WHERE team_id ="${id}"`;
  return query(sql);
};

exports.formatSql = (value) => {
  const sql = 'select * from member WHERE id =? and isDelete = "0"';
  return format(sql, value);
};

