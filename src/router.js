import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const currentViewStorageKey = 'currentView'
let firstLoad = true

const keepTracksOf = [
  'home',
  'csv-display'
]

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/csv-display/:forceImport:alreadyOpened',
      name: 'csv-display',
      props: true,
      component: () => import('./views/CsvDisplay.vue')
    },
    {
      path: '/csv-dryrun-report',
      name: 'csv-dryrun-report',
      component: () => import('./views/CsvDryrunReport.vue')
    }
  ]
})

router.afterEach(to => {
  if (keepTracksOf.includes(to.name)) localStorage.setItem(currentViewStorageKey, to.name)
})

// RELOAD CURRENT VIEW BEFORE RELOAD / QUIT
router.beforeEach((to, from, next) => {
  const lastRouteName = localStorage.getItem(currentViewStorageKey)

  const shouldRedirect = Boolean(
    to.name === 'home' &&
    lastRouteName &&
    firstLoad
  )
  firstLoad = false
  if (shouldRedirect) next({ name: lastRouteName })
  else next()
})

export default router
