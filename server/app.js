const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const respond = require('koa-respond');
const logger = require('koa-logger');
const serve = require('koa-static');
const path = require('path');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/index.js');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

require('./router')(router);

const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
};

// 定义允许直接访问的url
const allowpage = ['/', '/css/index.css', '/js/index.js', '/login', '/api/login', '/api/register'];
// 拦截
function localFilter(ctx, next) {
  // console.log(ctx.session);
  console.log(ctx.originalUrl);
  const url = ctx.originalUrl;
  if (allowpage.indexOf(url) > -1) {
    console.log('当前地址可直接访问');
    return next();
  } else if (ctx.session && ctx.session.isLogin && ctx.session.userName) {
    console.log('正常访问');
    return next();
  }
  ctx.body = {
    status: 403,
    statusText: '未登陆',
  };
}

app
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(respond())
  .use(session({
    key: 'USER_SID', // cookie 中存储 session-id 时的键名, 默认为 koa:sess
    cookie: { // 与 cookie 相关的配置
      domain: 'localhost', // 写 cookie 所在的域名
      path: '/', // 写 cookie 所在的路径
      maxAge: 1000 * 60 * 60 * 0.5, // cookie 有效时长
      httpOnly: true, // 是否只用于 http 请求中获取
      overwrite: false, // 是否允许重写
    },
    store: new MysqlStore(sessionMysqlConfig),
  }))
  .use(async (ctx, next) => {
    await localFilter(ctx, next);
    // await next();
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), 'build')))
  // .use(session({
  //   key: 'USER_SID',
  //   store: new MysqlStore(sessionMysqlConfig),
  // }))
// .use(session({
//   key: 'session-id', // cookie 中存储 session-id 时的键名, 默认为 koa:sess
//   cookie: { // 与 cookie 相关的配置
//     domain: 'localhost', // 写 cookie 所在的域名
//     path: '/', // 写 cookie 所在的路径
//     maxAge: 1000 * 30, // cookie 有效时长
//     httpOnly: true, // 是否只用于 http 请求中获取
//     overwrite: false, // 是否允许重写
//   },
// }))

  .listen(port, () => {
    console.log('The server is running at:');
    console.log(
      `    - Local:  http://localhost:${port}`
    );
  });
