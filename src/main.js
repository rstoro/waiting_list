import Vue from 'vue';
import App from './App.vue';

import './../node_modules/bulma/css/bulma.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle, faList);
Vue.component('font-awesome-icon', FontAwesomeIcon)

import { Vue2Dragula } from 'vue2-dragula';
Vue.use(Vue2Dragula);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
