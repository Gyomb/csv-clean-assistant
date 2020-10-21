import Vue from 'vue'
import { transposeArrayOfObjects } from '@/helpers/arrays'

const state = {
  metadata: {}
}

const addingColumnToATableObject = function (tableObj, columnName, columnCells) {
  Vue.set(tableObj, columnName, {
    columnHash: '',
    cells: Array.isArray(columnCells) ? columnCells : []
  })
}

const mutations = {
  METADATA_DUMP (state, metadataCopy) {
    Object.keys(metadataCopy).forEach(prop => Vue.set(state.metadata, prop, metadataCopy.prop))
  },
  METADATA_ERASE (state) {
    state.metadata = {}
  },
  METADATA_ADD_COLUMN (state, columnNameOrColumnObj) {
    const columnName = typeof columnNameOrColumnObj === 'object' ? columnNameOrColumnObj.columnName : columnNameOrColumnObj
    const columnCells = typeof columnNameOrColumnObj === 'object' ? columnNameOrColumnObj.columnCells : []
    const forcePush = typeof columnNameOrColumnObj === 'object' ? columnNameOrColumnObj.forcePush : false
    if (typeof state.metadata[columnName] === 'object' && !forcePush) return console.error('METADATA_ADD_COLUMN: ' + columnName + ' already exists. Use the forcePush option to overwrite it.')
    addingColumnToATableObject(state.metadata, columnName, columnCells)
  },
  METADATA_SET_COLUMN_CONTENT (state, { columnName, columnCells }) {
    if (!Array.isArray(columnCells)) return console.error('METADATA_SET_COLUMN_CONTENT: Please provide a valid Array as columnCells')
    if (typeof state.metadata[columnName] !== 'object') {
      addingColumnToATableObject(state.metadata, columnName, columnCells)
    } else {
      Vue.set(state.metadata[columnName], 'cells', columnCells)
    }
  },
  METADATA_SET_CELLVALUE (state, { columnName, rowIndex, value }) {
    if (typeof state.metadata?.[columnName]?.cells?.[rowIndex] !== 'undefined') {
      state.metadata[columnName].cells[rowIndex] = value
    } else {
      return console.error('METADATA_SET_CELLVALUE: Please provide a valid columnName (' + columnName + ') and rowIndex (' + rowIndex + ')')
    }
  }
}

const actions = {
  METADATA_INITIALIZE ({ commit }, { csvJson, savedMetadata }) {
    return new Promise((resolve, reject) => {
      commit('METADATA_ERASE')
      if (savedMetadata) {
        commit('METADATA_DUMP', savedMetadata)
      } else {
        const transposedJson = transposeArrayOfObjects(csvJson)
        Object.keys(transposedJson).forEach(columnName => commit('METADATA_SET_COLUMN_CONTENT', { columnName, columnCells: transposedJson[columnName] }))
      }
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
