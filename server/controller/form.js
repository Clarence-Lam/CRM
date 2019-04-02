const Setting = require('../lib/setting.js');
const Form = require('../lib/form.js');

class FormController {
  async getTagForSelect(ctx) {
    await Setting.getTag().then(result => {
      const data = [];
      result.map((item) => {
        data.push({
          value: item.id,
          label: item.name,
        });
        return item;
      });
      ctx.body = {
        status: 200,
        statusText: '查询标签成功',
        tag: data,
      };
    });
  }
  async getUsers(ctx) {
    await Form.getUser().then(result => {
      const data = [];
      result.map((item) => {
        data.push({
          value: item.id,
          label: item.name,
        });
        return item;
      });
      ctx.body = {
        status: 200,
        statusText: '查询用户成功',
        users: data,
      };
    });
  }

  async getTeamMember(ctx) {
    const team = await Setting.getTeam().then(result => { return result; });
    const data = [];
    await Promise.all(team.map(async item => {
      const childrenData = await Form.getMemberByTeamId(item.id).then(result => { return result; });
      const children = [];
      childrenData.map((items) => {
        children.push({
          value: items.id,
          label: items.member_name,
        });
        return items;
      });
      data.push({
        value: item.id,
        label: item.team_name,
        children,
      });
      return Promise.resolve(item);
    }));
    ctx.body = {
      status: 200,
      statusText: '查询组别组员成功',
      teamMember: data,
    };
  }

  // async getTeamMember(ctx) {
  //   const team = await Setting.getTeam().then(result => { return result; });
  //   const childrenData = await Form.getMemberById().then(result => { return result; });
  //   const data = [];
  //   team.map((item) => {
  //     const children = [];
  //     childrenData.map((items) => {
  //       if (items.team_id === item.id) {
  //         children.push({
  //           value: items.id,
  //           label: items.member_name,
  //         });
  //       }
  //       return items;
  //     });
  //     data.push({
  //       value: item.id,
  //       label: item.team_name,
  //       children,
  //     });
  //     console.log(data);
  //     return item;
  //   });
  //   console.log(data);
  //   ctx.body = {
  //     status: 200,
  //     statusText: '查询组别组员成功',
  //     teamMember: data,
  //   };
  // }

  async getTagById(id) {
    const tag = await Form.getTagById(id).then(result => {
      return result[0].name;
    });
    // console.log(tag);
    return tag;
  }

  async getMemberById(id) {
    const member = await Form.getMemberById(id).then(result => {
      return result;
    });
    // console.log(member);
    return member;
  }
  // 新增进程获取客户id
  async getCustomerForSelect(ctx) {
    const { id, name } = ctx.request.body;
    const { authority, userId } = ctx.session;
    let sql = '';
    if (authority === 'guest') {
      sql += `and user_id = "${userId}"`;
    }
    if (id) {
      sql += `and id = "${id}"`;
    }
    if (name) {
      sql += `and name like "%${name}%"`;
    }
    await Form.getCustomerForSelect(sql).then(result => {
      const customer = [];
      for (const item of result) {
        customer.push({
          value: item.id,
          label: item.name,
          member_id: item.member_id,
        });
      }
      ctx.body = {
        status: 200,
        statusText: 'ok',
        customer,
      };
    });
  }
}

module.exports = new FormController();
