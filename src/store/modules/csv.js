import { ipcRenderer } from 'electron'

const state = {}

const mutations = {}

const actions = {
  ANALYZE_CSV (context, path) {
    ipcRenderer.on('analyzedCsv', (event, path) => {
      console.log(path) // affiche "pong"
    })
    ipcRenderer.on('csvReadError', (event, msg) => {
      console.error(msg) // affiche "pong"
    })
    ipcRenderer.send('analyzeCsv', path)
  }
}

export default {
  state,
  mutations,
  actions
}
