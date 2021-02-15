import Vue from 'vue';
import App from './App.vue';
import config from '../public/config.json';

// NOTE: we are customizing the scss in WaitingList.vue
// bulma
//import './../node_modules/bulma/css/bulma.css';

// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChartBar, faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faChartBar, faCheck, faBan, faUser, faUsers, faPhone, faAngleDown, faAngleRight, faClock, faTrashAlt, faEnvelope, faExclamationCircle, faList);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// dragula
import { Vue2Dragula } from 'vue2-dragula';
Vue.use(Vue2Dragula);

// config
Vue.config.productionTip = false;
    
// custom config
Vue.prototype.$waitingListConfig = config;
    
// create vue
new Vue({
  render: h => h(App),
}).$mount('#app');
