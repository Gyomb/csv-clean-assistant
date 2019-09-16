import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './global-scss/bulma-overrided.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')