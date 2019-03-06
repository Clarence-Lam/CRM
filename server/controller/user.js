const userService = require('../service/user');
const userModel = require('../lib/user.js');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const moment = require('moment');
const session = require('koa-session-minimal');

const SALT_WORK_FACTOR = 10;

class UserController {
  async profile(ctx) {
    // const res = await userService.profile();
    // ctx.body = res.data;
    ctx.body = {
      status: 403,
      statusText: '未登陆',
    };
  }

  async getSession(ctx) {
    // const res = await userService.profile();
    // ctx.body = res.data;
    ctx.body = {
      isLogin: ctx.session.isLogin,
      userId: ctx.session.userId,
      userName: ctx.session.userName,
      name: ctx.session.name,
      authority: ctx.session.authority,
    };
  }

  async login(ctx) {
    const { username, password } = ctx.request.body;
    // console.log(username);
    // console.log(password);
    await userModel.login([username]).then(result => {
      if (result.length !== 0) {
        result.map((item) => {
          const hash = item.password;
          if (bcrypt.compareSync(password, hash)) {
            ctx.session.isLogin = true;
            ctx.session.userName = username;
            ctx.session.userId = item.id;
            ctx.session.name = item.name;
            ctx.session.authority = item.authority;
            ctx.body = {
              status: 200,
              statusText: 'ok',
              currentAuthority: 'user',
              user: item.username,
              name: item.name,
              authority: item.authority,
              userId: item.id,
            };
          } else {
            ctx.body = {
              status: 400,
              statusText: '帐号或密码错误',
              currentAuthority: 'guest',
            };
          }
          return item;
        });
      } else {
        ctx.body = {
          status: 400,
          statusText: '帐号或密码错误',
          currentAuthority: 'guest',
        };
      }
    });
    // console.log(uuidv1());
    // if (username === 'admin' && password === 'admin') {
    //   ctx.body = {
    //     status: 200,
    //     statusText: 'ok',
    //     currentAuthority: 'admin',
    //   };
    // } else if (username === 'user' && password === 'user') {
    //   ctx.body = {
    //     status: 200,
    //     statusText: 'ok',
    //     currentAuthority: 'user',
    //   };
    // } else {
    //   ctx.body = {
    //     status: 401,
    //     statusText: 'unauthorized',
    //     currentAuthority: 'guest',
    //   };
    // }
  }

  async register(ctx) {
    // bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => { // 密码加密
    //   if (err) console.log(err);

    //   bcrypt.hash('123', salt, (error, hash) => {
    //     if (error) console.log(error);

    //     // this.password = hash;
    //     console.log(hash);
    //   });
    // });
    const name = ctx.request.body.name;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const authority = ctx.request.body.authority;
    // bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    //   bcrypt.hash(password, salt, (error, hash) => {
    //     // Store hash in your password DB.
    //     if (error) console.log(error);

    //     // await userModel.register().then(result => {

    //     // });
    //     console.log(hash);
    //     password = hash;
    //     return hash;
    //   });
    // });
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    const hash = bcrypt.hashSync(password, salt);
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await userModel.register([uuidv1(), username, hash, name, authority, datetime, datetime]).then(result => {
      console.log(result);
    });
    console.log(hash);

    bcrypt.compare(password, '$2b$10$ahM202HU9Q./Og1xfCgOpeZtaP.jbJab9ZqCFxpAdVMKv05GjFtgy', (err, res) => {
      // res == true
      console.log(res);
    });
    // bcrypt.compareSync(password, hash);
    ctx.body = {
      status: 200,
      statusText: 'ok',
      currentAuthority: authority,
    };
  }

  async getUser(ctx) {
    await userModel.getUser().then(result => {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        user: result,
      };
    });
  }

  async deleteUser(ctx) {
    const id = ctx.request.body.id;
    await userModel.deleteUser(id).then(result => {
      ctx.body = {
        status: 200,
        statusText: '删除成功',
        result,
      };
    });
  }

  async updateUser(ctx) {
    const { id, username, password, name, authority } = ctx.request.body;
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    const hash = bcrypt.hashSync(password, salt);
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await userModel.updateUser([username, hash, name, authority, datetime, id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '修改用户成功',
        result,
      };
    });
    const userId = ctx.session.userId;
    if (userId === id) {
      ctx.session.name = name;
    }
  }

  async logout(ctx) {
    ctx.session.isLogin = false;
    ctx.session.userName = '';
    ctx.session.userId = '';
    ctx.session.name = '';
    ctx.session.authority = '';
    ctx.body = {
      status: 200,
      statusText: 'ok',
      currentAuthority: '',
    };
  }

  async test(ctx) {
    await userModel.selectTest().then(result => {
      result.map((item) => {
        console.log('111111');
        console.log(item.id);
        console.log(item.username);
        console.log(item.password);
        return item;
      });
      ctx.body = {
        res: result,
        test: ctx.query,
        test2: ctx.querystring,
        test3: ctx.request.query,
        test4: ctx.request.querystring,
        ctx1: ctx,
        request: ctx.request,
        response: ctx.response,
        body: ctx.request.body.abc,
        session1: ctx.session,
      };
    });
    // ctx.body = {
    //   status: 200,
    //   statusText: 'ok',
    //   currentAuthority: 'guest',
    //   test: ctx.query,
    //   test2: ctx.querystring,
    //   test3: ctx.request.query,
    //   test4: ctx.request.querystring,
    //   ctx1: ctx,
    // };
  }
}

module.exports = new UserController();
