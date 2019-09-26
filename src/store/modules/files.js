import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import Vue from 'vue'

const userData = remote.app.getPath('userData')
const fileListPath = path.join(userData, 'file-list.json')

const defaultValues = {
  list: {}
}

const state = {
  ...getSavedFilesState()
}

const getters = {
  getFileFromFileKey: (state, getters) => (fileKey) => {
    return state.list[getters.getUniqueId(fileKey)]
  }
}

const mutations = {
  ADD_FILE_IN_LIST (state, { uid, file }) {
    Vue.set(state.list, uid, file)
    saveFilesState()
  },
  DEL_FILE_IN_LIST (state, uid) {
    Vue.delete(state.list, uid)
    saveFilesState()
  },
  UPDATE_FILE_COLUMN_SETTINGS (state, { uid, heading, settings }) {
    if (state.file[uid]) {
      if (typeof state.file[uid].columns !== 'object') Vue.set(state.file[uid], 'columns', {})
      Vue.set(state.file[uid].columns, heading, settings)
    }
  }
}

const actions = {
  ADD_AND_LOG_FILE ({ state, getters, commit, dispatch }, file) {
    let alreadyExist = false
    for (const fileUid in state.list) {
      if (state.list[fileUid].path === file.path) {
        alreadyExist = true
        break
      }
    }
    if (!alreadyExist) {
      let uid = getters.getNewUniqueId()
      dispatch('REGISTER_IMPORTED_FILE', { uid })
        .then(uid => {
          commit('ADD_FILE_IN_LIST', { uid, file })
        })
        .catch(err => console.error(err))
    }
  },
  DEL_AND_UNLOG_FILE ({ state, getters, commit }, fileKey) {
    let uid = getters.getUniqueId(fileKey)
    commit('DEL_FILE_IN_LIST', uid)
    commit('UPDATE_FILE_ID_LIST', {
      operation: 'delete',
      fileKey
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

function getSavedFilesState () {
  let filesState = {}
  try {
    filesState = JSON.parse(fs.readFileSync(fileListPath))
  } catch (error) {
    console.warn(error)
    console.log('No settings retrieved. Default will be applied.')
  }
  // ////////////////////////////
  // CHECK USER SETTINGS PROP BY PROP
  for (const prop of Object.keys(defaultValues)) {
    // if the prop doesn't exist, create it
    if (typeof (filesState[prop]) === 'undefined') filesState[prop] = defaultValues[prop]
  }
  return filesState
}
// console.log(getUserSettings())

function saveFilesState () {
  fs.writeFile(fileListPath, JSON.stringify(state, null, 2), 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      console.log('Cannot save user settings.')
    } else {
      console.log('User settings saved.')
    }
  })
}
