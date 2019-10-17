import Vue from 'vue'

const modalRegistry = [
  'fileImportSettings'
]

const state = {}

modalRegistry.forEach(modalName => {
  state[modalName + 'Opened'] = false
  state[modalName + 'Parameters'] = {}
})

const mutations = {
  MODAL_OPEN (state, { id, parameters }) {
    state[id + 'Opened'] = true
    Vue.set(state, id + 'Parameters', parameters)
  },
  MODAL_CLOSE (state, id) {
    console.log(state)
    state[id + 'Opened'] = false
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
