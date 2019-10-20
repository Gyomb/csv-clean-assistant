import { ipcRenderer, remote } from 'electron'
import { promises as fsp } from 'fs'
import path from 'path'
import Vue from 'vue'
import { moveInArray } from '@/helpers/arrays'

const userData = remote.app.getPath('userData')
const importedFolder = path.join(userData, 'imported-files')

const state = {
  loadStatus: undefined,
  content: undefined,
  newFilename: 'document',
  newPath: path.join(remote.app.getPath('documents'), 'document.csv'),
  saveMode: 'newfile',
  encoding: 'utf-8',
  delimiter: '',
  header: [],
  json: []
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
  JSON_UPDATE (state, { row, col, value }) {
    Vue.set(state.json[row], col, value)
  },
  JSON_OVERWRITE (state, json) {
    Vue.set(state, 'json', json)
  },
  HEADER_REPOSITION (state, { heading, newPos }) {
    const oldPos = state.header.indexOf(heading)
    if (oldPos !== newPos) moveInArray(state.header, oldPos, newPos)
  }
}

const actions = {
  MODIFY_CELL ({ commit, dispatch, rootState }, { row, col, value }) {
    commit('JSON_UPDATE', { row, col, value })
    dispatch('SAVE_IMPORTED_CSV', rootState.userSettings.openedFile)
  },
  IMPORT_CSV ({ commit, rootState }, uid) {
    let filepath = rootState.files.list[uid].path
    let parameters = rootState.files.list[uid].importParameters || {}
    commit('CSV_STATUS_UPDATE', 'analyzing')
    commit('MODAL_OPEN', {
      id: 'loading',
      parameters: {
        message: `Importing ${rootState.files.list[uid].name}…`
      }
    })
    ipcRenderer.once('analyzedCsv', (event, content) => {
      commit('CSV_CONTENT_UPDATE', content)
      commit('CSV_STATUS_UPDATE', 'ready')
      commit('MODAL_CLOSE', 'loading')
    })
    ipcRenderer.once('csvReadError', (event, msg) => {
      console.error({ csvReadError: msg })
      commit('CSV_STATUS_UPDATE', msg)
      commit('MODAL_CLOSE', 'loading')
    })
    ipcRenderer.send('analyzeCsv', { uid, filepath, parameters })
  },
  OPEN_IMPORTED_CSV ({ commit, rootState }, uid) {
    commit('MODAL_OPEN', {
      id: 'loading',
      parameters: {
        message: `Opening ${rootState.files.list[uid].name}…`
      }
    })
    let importedFilePath = path.join(importedFolder, uid + '-decoded.json')
    return new Promise((resolve, reject) => {
      fsp.readFile(importedFilePath, 'utf-8')
        .then(content => {
          commit('CSV_CONTENT_UPDATE', { ...JSON.parse(content) })
          commit('MODAL_CLOSE', 'loading')
          resolve(content)
        })
        .catch(err => {
          commit('MODAL_CLOSE', 'loading')
          reject(err)
        })
    })
  },
  SAVE_IMPORTED_CSV ({ state, commit, rootState }, uid) {
    let importedFilePath = path.join(importedFolder, uid + '-decoded.json')
    let { header, delimiter, json } = state
    commit('MODAL_OPEN', {
      id: 'loading',
      parameters: {
        message: `Saving modifications to ${rootState.files.list[uid].name}…`
      }
    })
    return fsp.writeFile(importedFilePath, JSON.stringify({ header, delimiter, json }), 'utf-8')
      .then(commit('MODAL_CLOSE', 'loading'))
      .catch(err => {
        commit('MODAL_CLOSE', 'loading')
        console.error(err)
      })
  },
  REPLACE_AND_SAVE_ROWS ({ commit, dispatch }, { uid, newJson }) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(newJson)) return reject(Error('Provided data isn\t an Array of rows'))
      commit('JSON_OVERWRITE', newJson)
      return dispatch('SAVE_IMPORTED_CSV', uid)
    })
  },
  EXPORT_CSV ({ state, commit, getters }, uid) {
    const exportDetails = getters.getFileExportDetails(uid)
    commit('CSV_STATUS_UPDATE', 'exporting')
    commit('MODAL_OPEN', {
      id: 'loading',
      parameters: {
        message: `Exporting to ${exportDetails.exportPath} (${exportDetails.exportMode})…`
      }
    })
    ipcRenderer.once('exportedCsv', (event, content) => {
      commit('CSV_STATUS_UPDATE', 'exported')
      commit('CSV_STATUS_UPDATE', 'ready')
      commit('MODAL_CLOSE', 'loading')
    })
    ipcRenderer.once('csvExportError', (event, msg) => {
      console.error('csvExportError:', msg)
      commit('CSV_STATUS_UPDATE', msg)
      commit('MODAL_CLOSE', 'loading')
      commit('MODAL_OPEN', {
        id: 'alert',
        parameters: {
          source: 'CSV export failed',
          message: msg.code === 'EEXIST'
            ? `Cannot write on ${msg.path} (${msg.code})`
            : msg
        }
      })
    })
    ipcRenderer.send('exportCsv', {
      ...state,
      ...exportDetails
    })
  }
}

export default {
  state,
  mutations,
  actions
}
