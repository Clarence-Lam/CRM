const Setting = require('../lib/setting.js');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

class TeamController {
  async addTeam(ctx) {
    const { teamName, mark } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Setting.addTeam([uuidv1(), teamName, mark, datetime, datetime]).then(result => {
      console.log(result);
      ctx.body = {
        status: 200,
        statusText: '新增组别成功',
      };
    });
  }

  async getTeam(ctx) {
    await Setting.getTeam().then(result => {
      ctx.body = {
        status: 200,
        statusText: '查询组别成功',
        team: result,
      };
    });
  }

  async updateTeam(ctx) {
    const { teamName, mark, id } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Setting.updateTeam([teamName, mark, datetime, id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '组别更新成功',
        team: result,
      };
    });
  }

  async addMember(ctx) {
    const { teamId, teamName, memberName, mark } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Setting.addMember([uuidv1(), teamId, teamName, memberName, mark, datetime, datetime]).then(result => {
      console.log(result);
      ctx.body = {
        status: 200,
        statusText: '新增组员成功',
      };
    });
  }

  async getMember(ctx) {
    await Setting.getMember().then(result => {
      ctx.body = {
        status: 200,
        statusText: '查询组员成功',
        member: result,
      };
    });
  }

  async updateMember(ctx) {
    const { teamId, teamName, memberName, mark, id } = ctx.request.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Setting.updateMember([teamId, teamName, memberName, mark, datetime, id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '组员更新成功',
        team: result,
      };
    });
  }

  async deleteMember(ctx) {
    const { id } = ctx.request.body;
    await Setting.deleteMember([id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '组员成功删除',
        team: result,
      };
    });
  }

  async addTag(ctx) {
    const { name } = ctx.request.body;
    const post = { id: uuidv1(), name };
    await Setting.addTag(post).then(result => {
      console.log(result);
      ctx.body = {
        status: 200,
        statusText: '新增标签成功',
      };
    });
  }

  async getTag(ctx) {
    await Setting.getTag().then(result => {
      ctx.body = {
        status: 200,
        statusText: '查询标签成功',
        tag: result,
      };
    });
  }


  async updateTag(ctx) {
    const { id, name } = ctx.request.body;
    // Setting.formatSql('UPDATE tag SET name = ? WHERE id =?', [name, id]);
    await Setting.updateTag([name, id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '更新标签成功',
        team: result,
      };
    });
  }

  async deleteTag(ctx) {
    const { id } = ctx.request.body;
    await Setting.deleteTag([id]).then(result => {
      ctx.body = {
        status: 200,
        statusText: '标签成功删除',
        team: result,
      };
    });
  }
  async deleteTeam(ctx) {
    const { id } = ctx.request.body;
    const member = await Setting.getMemberByTeamId([id]);
    await Setting.formatSql([id]);
    console.log(member);
    console.log(member.length);
    if (member.length === 0) {
      await Setting.deleteTeam([id]).then(result => {
        ctx.body = {
          status: 200,
          statusText: '组别成功删除',
          team: result,
        };
      });
    } else {
      ctx.body = {
        status: 201,
        statusText: '当前组别存在组员，请先删除组员或修改组员归属。',
      };
    }
  }
}

module.exports = new TeamController();
