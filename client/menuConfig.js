// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  // {
  //   name: '反馈',
  //   path: 'https://github.com/alibaba/ice',
  //   external: true,
  //   newWindow: true,
  //   icon: 'message',
  // },
  // {
  //   name: '帮助',
  //   path: 'https://alibaba.github.io/ice',
  //   external: true,
  //   newWindow: true,
  //   icon: 'bangzhu',
  // },
];

const asideMenuConfig = [
  // {
  //   name: '工作台',
  //   path: '/dashboard',
  //   icon: 'home2',
  // },
  // {
  //   name: '数据概览',
  //   path: '/analysis',
  //   icon: 'chart',
  // },
  // {
  //   name: '员工列表',
  //   path: '/employee',
  //   icon: 'person',
  // },
  // {
  //   name: '部门列表',
  //   path: '/departments',
  //   icon: 'cascades',
  // },
  // {
  //   name: '请假记录',
  //   path: '/holidays',
  //   icon: 'copy',
  // },
  // {
  //   name: '待办事项',
  //   path: '/events',
  //   icon: 'edit2',
  // },
  // {
  //   name: '动态列表',
  //   path: '/activites',
  //   icon: 'activity',
  // },
  {
    name: '功勋榜',
    path: '/merit',
    icon: 'activity',
  },
  {
    name: '客户信息',
    path: '/customer',
    icon: 'person',
  },
  {
    name: '客户进程',
    path: '/working',
    icon: 'cascades',
  },
  {
    name: '设置', // 一级导航名称
    path: '/setting', // 一级导航路径
    icon: 'shezhi', // 一级导航图标
    authority: 'admin', // 一级导航权限配置
    children: [
      {
        name: '组别管理', // 二级导航名称
        path: '/team', // 二级导航路径
        authority: 'admin', // 二级导航权限配置
      },
      {
        name: '组员管理',
        path: '/member',
        authority: 'admin',
      },
      {
        name: '用户管理',
        path: '/manage/user',
        authority: 'admin',
      },
      {
        name: '标签管理',
        path: '/tag',
        authority: 'admin',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
