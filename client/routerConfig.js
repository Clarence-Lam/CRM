// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import Dashboard from './pages/Dashboard';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Holidays from './pages/Holidays';
import Events from './pages/Events';
import Activites from './pages/Activites';
import Departments from './pages/Departments';
import Employee from './pages/Employee';
import AddEmployee from './pages/AddEmployee';
import Analysis from './pages/Analysis';
import Setting from './pages/Setting';
// -----
import Merit from './pages/Merit';
import Customer from './pages/Customer';
import addCustomer from './pages/Customer/components/addCustomer';
import Team from './pages/team';
import Member from './pages/member';
import User from './pages/user';
import Tag from './pages/tag';
import workTable from './pages/work/workTable';
import addWork from './pages/work/addWork';
import workDetail from './pages/work/datailWork';

const routerConfig = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/user/login',
    component: UserLogin,
  },
  {
    path: '/user/register',
    component: UserRegister,
  },
  {
    path: '/holidays',
    component: Holidays,
  },
  {
    path: '/events',
    component: Events,
  },
  {
    path: '/activites',
    component: Activites,
  },
  {
    path: '/departments',
    component: Departments,
  },
  {
    path: '/employee',
    component: Employee,
  },
  {
    path: '/add/employee',
    component: AddEmployee,
    authority: 'admin',
  },
  {
    path: '/analysis',
    component: Analysis,
  },
  {
    path: '/setting',
    component: Setting,
  },
  // --
  {
    path: '/merit',
    component: Merit,
    authority: 'admin',
  },
  {
    path: '/customer',
    component: Customer,
    authority: 'admin',
  },
  {
    path: '/add/customer',
    component: addCustomer,
    authority: 'admin',
  },
  {
    path: '/team',
    component: Team,
    authority: 'admin',
  },
  {
    path: '/member',
    component: Member,
    authority: 'admin',
  },
  {
    path: '/manage/user',
    component: User,
    authority: 'admin',
  },
  {
    path: '/tag',
    component: Tag,
    authority: 'admin',
  },
  {
    path: '/working',
    component: workTable,
    authority: '',
  },
  {
    path: '/add/work',
    component: addWork,
    authority: '',
  },
  {
    path: '/workDetail',
    component: workDetail,
    authority: '',
  },
];

export default routerConfig;
