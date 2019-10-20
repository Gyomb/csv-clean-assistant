import Vue from 'vue'

const modalRegistry = [
  'fileImportSettings',
  'columnSettingsEditor',
  'exportSettings',
  'loading'
]

const state = {}

modalRegistry.forEach(modalName => {
  state[modalName + 'Opened'] = false
  state[modalName + 'Parameters'] = {}
})

const mutations = {
  MODAL_OPEN (state, options) {
    let { id, parameters } = options
    if (!id) id = options
    if (typeof id !== 'string') return
    state[id + 'Opened'] = true
    Vue.set(state, id + 'Parameters', parameters || {})
  },
  MODAL_CLOSE (state, id) {
    state[id + 'Opened'] = false
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
