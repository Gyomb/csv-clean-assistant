import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/csv-loading',
      name: 'csv-loading',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/CsvLoading.vue')
    },
    {
      path: '/csv-display',
      name: 'csv-display',
      component: () => import('./views/CsvDisplay.vue')
    },
    {
      path: '/csv-dryrun-report',
      name: 'csv-dryrun-report',
      component: () => import('./views/CsvDryrunReport.vue')
    }
  ]
})
