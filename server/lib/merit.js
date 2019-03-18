const { query, format } = require('../config/sqlModel.js');
// 获取面谈量排名
exports.getWorkRanking = (startTime, endTime) => {
  const sql = 'SELECT count( DISTINCT id ) as num, member_id FROM work WHERE interview_date between ? and ? group by member_id ORDER BY num DESC limit 0 ,3';
  return query(sql, [startTime, endTime]);
};
// 获取面谈总数
exports.getWorkTotal = (startTime, endTime) => {
  const sql = 'SELECT count( DISTINCT id ) AS total FROM WORK WHERE interview_date BETWEEN ? AND ?';
  return query(sql, [startTime, endTime]);
};

// 获取进件量排名
exports.getIncomeRanking = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( income ) AS num  FROM WORK  WHERE income != "NULL" AND income_date BETWEEN ? AND ? GROUP BY member_id  ORDER BY num DESC LIMIT 0,3';
  return query(sql, [startTime, endTime]);
};
// 获取进件量总数
exports.getIncomeTotal = (startTime, endTime) => {
  const sql = 'SELECT sum( income ) AS total  FROM WORK  WHERE income != "NULL" AND income_date BETWEEN ? AND ? ';
  return query(sql, [startTime, endTime]);
};

// 获取放款金额排名
exports.getMoneyRanking = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( money ) AS num FROM workDetail WHERE money != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? GROUP BY member_id ORDER BY num DESC LIMIT 0,3';
  return query(sql, [startTime, endTime]);
};
// 获取放款金额总数
exports.getMoneyTotal = (startTime, endTime) => {
  const sql = 'SELECT sum( money ) AS total FROM workDetail WHERE money != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? ';
  return query(sql, [startTime, endTime]);
};

// 获取回款金额排名
exports.getReceivedRanking = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( received ) AS num FROM workDetail WHERE received != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? GROUP BY member_id ORDER BY num DESC LIMIT 0,3';
  return query(sql, [startTime, endTime]);
};
// 获取回款金额总数
exports.getReceivedTotal = (startTime, endTime) => {
  const sql = 'SELECT sum( received ) AS total FROM workDetail WHERE received != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? ';
  return query(sql, [startTime, endTime]);
};

// 获取返点排名
exports.getReturnPointRanking = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( return_point ) AS num FROM workDetail WHERE return_point != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? GROUP BY member_id ORDER BY num DESC LIMIT 0,3';
  return query(sql, [startTime, endTime]);
};
// 获取返点总数
exports.getReturnPointTotal = (startTime, endTime) => {
  const sql = 'SELECT sum( return_point ) AS total FROM workDetail WHERE return_point != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? ';
  return query(sql, [startTime, endTime]);
};

// 获取返利排名
exports.getRebateRanking = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( rebate ) AS num FROM workDetail WHERE rebate != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? GROUP BY member_id ORDER BY num DESC LIMIT 0,3';
  return query(sql, [startTime, endTime]);
};
// 获取返利总数
exports.getRebateTotal = (startTime, endTime) => {
  const sql = 'SELECT sum( rebate ) AS total FROM workDetail WHERE rebate != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? ';
  return query(sql, [startTime, endTime]);
};

exports.formatSql = (startTime, endTime) => {
  const sql = 'SELECT member_id, sum( money ) AS num FROM workDetail WHERE money != "NULL"  and isWork = "0" AND income_date BETWEEN ? AND ? ';
  return format(sql, [startTime, endTime]);
};

