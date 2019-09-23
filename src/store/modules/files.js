const state = {
  list: []
}

const mutations = {
  ADD_FILE_IN_LIST (state, file) {
    state.list.push(file)
  },
  DEL_FILE_IN_LIST (state, fileKey) {
    state.list.splice(fileKey, 1)
  }
}

const actions = {
  ADD_AND_LOG_FILE ({ state, commit }, file) {
    let alreadyExist = false
    for (let existingFile of state.list) {
      if (existingFile.path === file.path) {
        alreadyExist = true
        break
      }
    }
    if (!alreadyExist) {
      commit('ADD_FILE_IN_LIST', file)
      commit('UPDATE_IMPORTEDFILES', {
        operation: 'add',
        value: file
      })
    }
  },
  DEL_AND_UNLOG_FILE ({ state, commit }, fileKey) {
    commit('DEL_FILE_IN_LIST', fileKey)
    commit('UPDATE_IMPORTEDFILES', {
      operation: 'delete',
      fileKey
    })
  }
}

export default {
  state,
  mutations,
  actions
}
