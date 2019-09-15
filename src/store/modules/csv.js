import { ipcRenderer } from 'electron'

const state = {}

const mutations = {}

const actions = {
  ANALYZE_CSV (context, path) {
    ipcRenderer.once('analyzedCsv', (event, path) => {
      console.log('analyzedCsv', path)
    })
    ipcRenderer.once('csvReadError', (event, msg) => {
      console.error('csvReadError', msg)
    })
    ipcRenderer.send('analyzeCsv', path)
  }
}

export default {
  state,
  mutations,
  actions
}
