const mysql = require('mysql');
const config = require('../config/index.js');

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
  timezone: config.database.timezone,
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (MysqlError, rows) => {
          if (MysqlError) {
            reject(MysqlError);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

// 编辑初始化数据库
const createCustomer =
  `CREATE TABLE if not exists customer
  (
  id CHAR(255),
  name CHAR(255),
  id_card CHAR(255) UNIQUE ,
  phone CHAR(255),
  member_id CHAR(255),
  user_id VARCHAR(255),
  area CHAR(255),
  tag VARCHAR(1000),
  mark VARCHAR(255),
  create_date DATETIME,
  update_date DATETIME,
  isDelete CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );`;
const createTag =
  `CREATE TABLE if not exists tag
  (
  id CHAR(255),
  name CHAR(255),
  isDelete CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );
  `;
const createTeam =
  `CREATE TABLE if not exists team
  (
  id CHAR(255),
  team_name CHAR(255) NOT NULL,
  mark VARCHAR(255),
  create_date DATETIME,
  update_date DATETIME,
  isDelete CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );`;
const createUser =
  `CREATE TABLE if not exists user
  (
  id CHAR(255),
  username CHAR(255) NOT NULL UNIQUE ,
  password CHAR(255) NOT NULL,
  name CHAR(255) NOT NULL,
  authority VARCHAR(255),
  create_date DATETIME,
  update_date DATETIME,
  isDelete CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );`;
const createMember =
  `CREATE TABLE if not exists member
  (
  id CHAR(255),
  team_id CHAR(255) NOT NULL,
  team_name CHAR(255),
  member_name CHAR(255) NOT NULL,
  mark VARCHAR(255),
  create_date DATETIME,
  update_date DATETIME,
  isDelete CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );`;
const createWork =
  `CREATE TABLE if not exists work
  (
  id CHAR(255),
  customer_id CHAR(255) NOT NULL,
  member_id VARCHAR(255),
  user_id VARCHAR(255),
  status VARCHAR(255),
  num INT DEFAULT 0,
  income INT,
  platform CHAR(255),
  product CHAR(255),
  money INT,
  received INT,
  return_point INT,
  rebate INT,
  mark VARCHAR(255),
  create_date DATETIME,
  update_date DATETIME,
  interview_date DATETIME,
  income_date DATETIME,
  loan_date DATETIME,
  isWork CHAR DEFAULT '0',
  PRIMARY KEY (id)
  );`;

const createhistory =
`CREATE TABLE if not exists history
  (
  id CHAR(255),
  customer_id CHAR(255) NOT NULL,
  member_id VARCHAR(255),
  user_id VARCHAR(255),
  status VARCHAR(255),
  income INT,
  platform CHAR(255),
  product CHAR(255),
  money INT,
  received INT,
  return_point INT,
  rebate INT,
  create_date DATETIME,
  update_date DATETIME,
  PRIMARY KEY (id)
  );`;

const creatWorkDetail =
  `CREATE TABLE if not exists workDetail
  (
    id VARCHAR(255),
    work_id VARCHAR(255),
    member_id VARCHAR(255),
    customer_id VARCHAR(255),
    status VARCHAR(255),
    income INT,
    platform VARCHAR(255),
    product VARCHAR(255),
    money INT,
    received INT,
    return_point INT,
    rebate INT,
    mark VARCHAR(255),
    interview_date DATETIME,
    income_date DATETIME,
    loan_date DATETIME,
    create_date DATETIME,
    update_date DATETIME,
    isWork CHAR DEFAULT '0',
    PRIMARY KEY (id)
  );`;
const forignKey1 = 'ALTER TABLE member ADD FOREIGN KEY team_id_idxfk (team_id) REFERENCES team (id);';
const insertAdmin = 'insert into user set id=?,username=?,password=?,name=?,authority=?,create_date=?,update_date=?;';
const createTable = (sql) => {
  return query(sql, []);
};

// 建表
createTable(createCustomer);
createTable(createTag);
createTable(createTeam);
createTable(createUser);
createTable(createMember);
createTable(createWork);
createTable(createhistory);
createTable(creatWorkDetail);
// createTable(forignKey1);


const format = (sql, values) => {
  const formatSql = mysql.format(sql, values);
  console.log(formatSql);
  return sql;
};

exports.query = query;
exports.format = format;

