import { ipcRenderer, remote } from 'electron'
import { promises as fsp } from 'fs'
import path from 'path'
import Vue from 'vue'

const userData = remote.app.getPath('userData')
const importedFolder = path.join(userData, 'imported-files')

const state = {
  loadStatus: undefined,
  content: undefined,
  newFilename: 'document',
  newPath: path.join(remote.app.getPath('documents'), 'document.csv'),
  saveMode: 'newfile',
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
  CSV_SAVE_DATA_UPDATE (state, { filename, filepath, saveMode }) {
    if (filename) state.newFilename = filename
    if (filepath) state.newPath = filepath
    if (saveMode) state.saveMode = saveMode
  }
}

const actions = {
  IMPORT_CSV ({ commit, rootState }, uid) {
    let filepath = rootState.files.list[uid].path
    commit('CSV_STATUS_UPDATE', 'analyzing')
    ipcRenderer.once('analyzedCsv', (event, content) => {
      commit('CSV_CONTENT_UPDATE', content)
      commit('CSV_STATUS_UPDATE', 'ready')
    })
    ipcRenderer.once('csvReadError', (event, msg) => {
      console.error({ csvReadError: msg })
      commit('CSV_STATUS_UPDATE', msg)
    })
    ipcRenderer.send('analyzeCsv', { uid, filepath })
  },
  OPEN_IMPORTED_CSV ({ commit }, uid) {
    let importedFilePath = path.join(importedFolder, uid + '-decoded.json')
    return new Promise((resolve, reject) => {
      fsp.readFile(importedFilePath, 'utf-8')
        .then(content => {
          commit('CSV_CONTENT_UPDATE', { ...JSON.parse(content) })
          resolve(content)
        })
        .catch(err => reject(err))
    })
  },
  SAVE_CSV ({ state, commit }, { filename, filepath }) {
    if (filename && filepath) commit('CSV_SAVE_DATA_UPDATE', { filename, filepath })
    commit('CSV_STATUS_UPDATE', 'saving')
    ipcRenderer.once('savedCsv', (event, content) => {
      commit('CSV_STATUS_UPDATE', 'saved')
      commit('CSV_STATUS_UPDATE', 'ready')
    })
    ipcRenderer.once('csvSaveError', (event, msg) => {
      console.error({ csvSaveError: msg })
      commit('CSV_STATUS_UPDATE', msg)
    })
    ipcRenderer.send('saveCsv', state)
  }
}

export default {
  state,
  mutations,
  actions
}
