import { remote } from 'electron'
import fs from 'fs'
import path from 'path'
import { moveInArray } from '../../helpers/arrays'
import Vue from 'vue'

const userData = remote.app.getPath('userData')
const userSettingsPath = path.join(userData, 'user-settings.json')

const defaultValues = {
  importedFiles: [],
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
}

const mutations = {
  SETTINGS_SET_PROP (state, { prop, value }) {
    state[prop] = value
    saveUserSettings()
  },
  UPDATE_IMPORTEDFILES (state, { operation, fileKey, value }) {
    let importedFilesList = state.importedFiles
    if (typeof (fileKey) === 'number') {
      if (fileKey < 0) fileKey = 0
      if (fileKey > importedFilesList.length) fileKey = importedFilesList.length
    }
    importedFilesListUpdate()
    saveUserSettings()

    function importedFilesListUpdate () {
      switch (operation) {
        case 'add':
          fileKey = importedFilesList.length
          // fall through
        case 'update':
          if (typeof (value) === 'undefined') {
            operation = 'delete'
            importedFilesListUpdate()
          } else {
            Vue.set(importedFilesList, fileKey, value)
          }
          break
        case 'move':
          if (typeof (fileKey) === 'number' && typeof (value) === 'number') {
            moveInArray(importedFilesList, fileKey, fileKey + value)
            // console.log(`[${importedFilesList[fileKey + value]}] was moved.`)
          } else {
            console.warn('One fof the parameters isn\'t in the correct format and no move can be performed')
          }
          break
        case 'delete':
          /* let removedItem = */ importedFilesList.splice(fileKey, 1)
          // console.log(`${removedItem} is deleted.`)
          break
        default:
          break
      }
    }
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
