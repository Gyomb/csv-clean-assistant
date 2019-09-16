import { ipcRenderer } from 'electron'
import Vue from 'vue'

const state = {
  csvRequestStatus: undefined,
  csvContent: undefined,
  encoding: 'utf-8'
}

const mutations = {
  CSV_STATUS_UPDATE (state, status) {
    Vue.set(state, 'csvRequestStatus', status)
  },
  CSV_CONTENT_UPDATE (state, content) {
    if(typeof content === 'object') {
      for (const prop in content) {
        if(state[prop] !== content[prop]) {
          Vue.set(state, prop, content[prop])
        }
      }
    } else {
      Vue.set(state, 'csvContent', content)
    }
  }
}

const actions = {
  ANALYZE_CSV ({ commit }, path) {
    commit('CSV_STATUS_UPDATE', 'analyzing')
    ipcRenderer.once('analyzedCsv', (event, content) => {
      commit('CSV_CONTENT_UPDATE', content)
      commit('CSV_STATUS_UPDATE', 'ready')
    })
    ipcRenderer.once('csvReadError', (event, msg) => {
      console.error({ csvReadError: msg })
      commit('CSV_STATUS_UPDATE', msg)
    })
    ipcRenderer.send('analyzeCsv', path)
  }
}

export default {
  state,
  mutations,
  actions
}
