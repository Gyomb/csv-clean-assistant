import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import { moveInArray } from '../../helpers/arrays'
import Vue from 'vue'
import router from '../../router'

const userData = remote.app.getPath('userData')
const userSettingsPath = path.join(userData, 'user-settings.json')

const defaultValues = {
  fileIdList: [],
  openedFile: false
}

const getUserSettings = function () {
  let userSettings = {}
  try {
    userSettings = JSON.parse(fs.readFileSync(userSettingsPath))
  } catch (error) {
    console.warn(error)
    console.log('No settings retrieved. Default will be applied.')
  }
  // ////////////////////////////
  // CHECK USER SETTINGS PROP BY PROP
  for (const prop of Object.keys(defaultValues)) {
    // if the prop doesn't exist, create it
    if (typeof (userSettings[prop]) === 'undefined') userSettings[prop] = defaultValues[prop]
  }
  return userSettings
}
// console.log(getUserSettings())

const saveUserSettings = function () {
  fs.writeFile(userSettingsPath, JSON.stringify(state, null, 2), 'utf-8', (err, data) => {
    if (err) {
      console.error(err)
      console.log('Cannot save user settings.')
    } else {
      console.log('User settings saved.')
    }
  })
}

const state = {
  ...getUserSettings()
}

const getters = {
  getUniqueId: (state) => (fileKey) => {
    return state.fileIdList[fileKey]
  },
  uniqueIdExists: (state) => (uid) => {
    return state.fileIdList.includes(uid)
  },
  getNewUniqueId: (state, getters) => () => {
    let randomId = `uid${Date.now()}${Math.round(Math.random() * 100)}`
    console.log(randomId)
    return getters.uniqueIdExists(randomId) ? getters.getNewUniqueId() : randomId
  }
}

const mutations = {
  SETTINGS_SET_PROP (state, { prop, value }) {
    state[prop] = value
    saveUserSettings()
  },
  UPDATE_FILE_ID_LIST (state, { operation, fileKey, value }) {
    if (typeof (fileKey) === 'number') {
      if (fileKey < 0) fileKey = 0
      if (fileKey > state.fileIdList.length) fileKey = state.fileIdList.length
    }
    importedFilesListUpdate()
    saveUserSettings()

    function importedFilesListUpdate () {
      switch (operation) {
        case 'add':
          fileKey = state.fileIdList.length
          // fall through
        case 'update':
          if (typeof (value) === 'undefined') {
            operation = 'delete'
            importedFilesListUpdate()
          } else {
            Vue.set(state.fileIdList, fileKey, value)
          }
          break
        case 'move':
          if (typeof (fileKey) === 'number' && typeof (value) === 'number') {
            moveInArray(state.fileIdList, fileKey, fileKey + value)
            // console.log(`[${importedFilesList[fileKey + value]}] was moved.`)
          } else {
            console.warn('One fof the parameters isn\'t in the correct format and no move can be performed')
          }
          break
        case 'delete':
          /* let removedItem = */ state.fileIdList.splice(fileKey, 1)
          // console.log(`${removedItem} is deleted.`)
          break
        default:
          break
      }
    }
  }
}

const actions = {
  REGISTER_IMPORTED_FILE ({ state, getters, commit }, { uid }) {
    return new Promise((resolve, reject) => {
      if (!getters.uniqueIdExists(uid)) {
        commit('UPDATE_FILE_ID_LIST', { operation: 'add', value: uid })
        resolve(uid)
      } else {
        reject(uid)
      }
    })
  },
  OPEN_FILE ({ getters, commit, rootState }, { fileKey, uid, forceImport = false }) {
    if (!uid) {
      uid = getters.getUniqueId(fileKey)
    }
    if (rootState.files.list[uid]) {
      commit('SETTINGS_SET_PROP', { prop: 'openedFile', value: uid })
      router.push({ name: 'csv-display', params: { forceImport } })
    } else {
      console.error(`Couldn't find file with #${uid} ID.`)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
