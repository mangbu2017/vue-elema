// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import './common/less/index.less';

Vue.use(VueResource);

Vue.config.productionTip = false;

// 下面代码跳过new必须赋值的规则
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    Bus: new Vue()
  },
  router,
  components: { App },
  template: '<App/>'
});
