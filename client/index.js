import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createHashHistory } from 'history';
import moment from 'moment';
// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import '@alifd/next/reset.scss';
import router from './router';


// 引入基础配置文件
import configureStore from './configureStore';
import LanguageProvider from './components/LocaleProvider';
import { getLocale } from './utils/locale';


moment.locale('zh-cn');

const initialState = {};
const history = createHashHistory();
const store = configureStore(initialState, history);
const locale = getLocale();
const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(
  <LanguageProvider locale="zh-CN">
    <Provider store={store}>
      <ConnectedRouter history={history}>{router}</ConnectedRouter>
    </Provider>
  </LanguageProvider>,
  ICE_CONTAINER
);
