import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const currentViewStorageKey = 'currentView'
let firstLoad = true
let csvDisplayFirstLoad = true

const keepTracksOf = [
  'home',
  'csv-display'
]

function openImportedCsvAndContinue (next) {
  let fileUid = store.state.userSettings.openedFile
  store.dispatch('OPEN_IMPORTED_CSV', fileUid)
    .then(next())
    .catch(error => {
      if (error.code) {
        store.dispatch('IMPORT_CSV', fileUid)
          .then(next())
      } else {
        console.error(error)
        next(false)
      }
    })
}

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
      beforeEnter (to, from, next) {
        if (csvDisplayFirstLoad) {
          csvDisplayFirstLoad = false
          openImportedCsvAndContinue(next)
        } else if (to.params.forceImport) {
          let fileUid = store.state.userSettings.openedFile
          store.dispatch('IMPORT_CSV', fileUid)
            .then(next())
            .catch(error => {
              console.error(error)
              next(false)
            })
        } else if (to.params.alreadyOpened) {
          next()
        } else {
          openImportedCsvAndContinue(next)
        }
      },
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
