const userController = require('./controller/user');
const settingController = require('./controller/setting');
const customerController = require('./controller/customer');
const FormController = require('./controller/form');
const WorkController = require('./controller/working');

module.exports = (router) => {
  // 查看登录信息

  router.prefix('/api');
  router
    .post('/test', userController.test)
  // user
    .get('/getSession', userController.getSession)
    .get('/profile', userController.profile)
    .post('/login', userController.login)
    .post('/register', userController.register)
    .post('/logout', userController.logout)
    .get('/getUser', userController.getUser)
    .post('/deleteUser', userController.deleteUser)
    .post('/updateUser', userController.updateUser)
  // setting
    .post('/addTeam', settingController.addTeam)
    .post('/updateTeam', settingController.updateTeam)
    .get('/getTeam', settingController.getTeam)
    .post('/addMember', settingController.addMember)
    .post('/updateMember', settingController.updateMember)
    .post('/deleteMember', settingController.deleteMember)
    .get('/getMember', settingController.getMember)

    .get('/getTag', settingController.getTag)
    .post('/addTag', settingController.addTag)
    .post('/updateTag', settingController.updateTag)
    .post('/deleteTag', settingController.deleteTag)
    // customer
    .post('/getCustomer', customerController.getCustomer)
    .post('/getCustomerById', customerController.getCustomerById)
    .post('/addCustomer', customerController.addCustomer)
    .post('/updateCustomer', customerController.updateCustomer)
    .post('/deleteCustomerById', customerController.deleteCustomerById)
    // form
    .get('/getTeamMember', FormController.getTeamMember)
    .get('/getTagForSelect', FormController.getTagForSelect)
    .post('/getCustomerForSelect', FormController.getCustomerForSelect)
    // work
    .post('/addWork', WorkController.addWork)
    .post('/toIncome', WorkController.toIncome)
    .post('/toLoan', WorkController.toLoan)
    .post('/getWorking', WorkController.getWorking)
    .post('/getWorkDetail', WorkController.getWorkDetail);
};
