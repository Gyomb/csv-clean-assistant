import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
