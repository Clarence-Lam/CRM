import axios from 'axios';
import { createBrowserHistory } from 'history';
import { Message } from '@alifd/next';

const history = createBrowserHistory();

axios.interceptors.response.use((response) => {
  // Do something with response data
  if (response.data.status === 403) {
    // console.log(router.hashRouter);
    // HashRouter.push('/user/login');
    Message.success('登陆超时，请重新登陆');
    // this.props.history.push('/api/lgoin');
    history.push('/#/user/login');
    location.reload();
  } else {
    return response;
  }
}, (error) => {
  // Do something with response error
  return Promise.reject(error);
});
