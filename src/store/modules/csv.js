import { ipcRenderer, remote } from 'electron'
import Vue from 'vue'

const state = {
  loadStatus: undefined,
  content: undefined,
  newFilename: 'document',
  newPath: remote.app.getPath('documents'),
  encoding: 'utf-8'
}

const mutations = {
  CSV_STATUS_UPDATE (state, status) {
    Vue.set(state, 'loadStatus', status)
  },
  CSV_CONTENT_UPDATE (state, content) {
    if (typeof content === 'object') {
      for (const prop in content) {
        if (state[prop] !== content[prop]) {
          Vue.set(state, prop, content[prop])
        }
      }
    } else {
      Vue.set(state, 'content', content)
    }
  },
  CSV_REGISTER_NEW_FILEPATH (state, { filename, filepath }) {
    state.newFilename = filename
    state.newFilepath = filepath
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
  },
  SAVE_CSV ({ state, commit }, filename) {
    commit('CSV_STATUS_UPDATE', 'saving')
    let { json, encoding, header, delimiter } = state
    ipcRenderer.once('savedCsv', (event, content) => {
      commit('CSV_STATUS_UPDATE', 'saved')
      commit('CSV_STATUS_UPDATE', 'ready')
    })
    ipcRenderer.once('csvSaveError', (event, msg) => {
      console.error({ csvSaveError: msg })
      commit('CSV_STATUS_UPDATE', msg)
    })
    ipcRenderer.send('saveCsv', { json, encoding, header, delimiter })
  }
}

export default {
  state,
  mutations,
  actions
}
