const { query } = require('../config/sqlModel.js');

// 注册用户
exports.register = (value) => {
  const sql = 'insert into user set id=?,username=?,password=?,name=?,authority=?,create_date=?,update_date=?;';
  return query(sql, value);
};

exports.login = (value) => {
  const sql = 'SELECT*FROM USER WHERE username=?';
  return query(sql, value);
};

exports.selectTest = (value) => {
  const sql = 'SELECT*FROM USER';
  return query(sql, value);
};

exports.getUser = () => {
  const sql = 'SELECT*FROM USER WHERE username !=\'admin\' and isDelete="0"';
  return query(sql);
};

exports.deleteUser = (value) => {
  // const sql = 'DELETE FROM `USER` WHERE id =?';
  const sql = 'UPDATE USER SET isDelete = "1" WHERE id =?';
  return query(sql, value);
};

exports.updateUser = (value) => {
  const sql = 'UPDATE USER SET username=?,password=?,name=?,authority=?,update_date=? WHERE id=?';
  return query(sql, value);
};
