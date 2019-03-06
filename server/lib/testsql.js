const sqlModel = require('../config/sqlModel.js');

exports.selectTest = (value) => {
  const sql = 'select * FROM customer';
  return sqlModel.query(sql, value);
};
