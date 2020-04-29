import Vue from 'vue'
import App from './App.vue';

import './../node_modules/bulma/css/bulma.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon)

import VueDND from 'awe-dnd';
Vue.use(VueDND);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
