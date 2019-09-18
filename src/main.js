import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './global-scss/bulma-overrided.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'

Vue.config.productionTip = false

const requireComponent = require.context(
  './components/atomic-ui',
  true, // Whether or not to look in subfolders
  /\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
