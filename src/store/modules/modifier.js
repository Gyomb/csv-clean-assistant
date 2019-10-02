import Vue from 'vue'

const formatRules = function (rules) {
  return rules.map(({ exclude = false, isRegex = true, matchPattern, action, parameters }) => {
    let parametersToInject = {}
    switch (action) {
      case 'replace':
        parametersToInject.replacementString = parameters.replacementString
        if (!parameters.useMatchPattern) {
          parametersToInject.replacementPattern = parameters.isRegex ? new RegExp(parameters.replacementPattern) : parameters.replacementPattern
        }
        break
      default: return false
    }
    return {
      exclude: !!exclude,
      match: isRegex ? new RegExp(matchPattern) : matchPattern,
      action: action,
      ...parametersToInject
    }
  })
}

const cellMatch = function (string, pattern, toExclude) {
  const isMatch = pattern instanceof RegExp ? pattern.test(string) : string.includes(pattern)
  if (!toExclude && isMatch) return true
  if (toExclude && !isMatch) return true
  return false
}

const replaceAction = function (string, rule) {
  const pattern = rule.replacementPattern || rule.match
  return string.replace(pattern, rule.replacementString)
}

const state = {
  dryrun: [],
  dryrunReport: []
}

const mutations = {
  DRYRUN_REGISTER (state, newJson) {
    if (!Array.isArray(newJson)) return console.error(Error('Cannot store this modifed JSON (not an Array)'))
    Vue.set(state, 'dryrun', newJson)
  },
  DRYRUN_REPORT_REGISTER (state, report) {
    Vue.set(state, 'dryrunReport', report)
  }
}

const actions = {
  APPLY_MODIFICATION_RULES ({ commit, rootState }, { dryrunActivated = true, uid, column }) {
    return new Promise((resolve, reject) => {
      const modifiedJson = []
      const modificationReport = []
      const fileData = rootState.csv.json
      if (typeof fileData !== 'object') return reject(Error(`No JSON data imported for ${uid} file`))
      if (!Array.isArray(fileData)) return reject(Error(`JSON data imported from ${uid} file should be an Array`))
      const fileMetaData = rootState.files.list[uid]
      if (typeof fileMetaData !== 'object') return reject(Error(`${uid} file is not listed`))
      if (typeof fileMetaData.columns !== 'object') return reject(Error(`No column data registered for ${uid} file`))
      if (typeof fileMetaData.columns[column] !== 'object') return reject(Error(`No settings registered for ${uid}'s "${column}" column`))
      const modificationRules = fileMetaData.columns[column].rules
      if (typeof modificationRules !== 'object') return reject(Error(`No modification rules registered for ${uid}'s "${column}" column`))
      const rulesToApply = formatRules(modificationRules)

      // NOTE: forEach() is used here because it has better performances than map() over large set of data (10.000 and more)
      fileData.forEach(row => {
        const report = []
        const newRow = { ...row }
        let newCell = newRow[column]
        for (let ruleIndex = 0; ruleIndex < rulesToApply.length; ruleIndex++) {
          const rule = rulesToApply[ruleIndex]
          if (cellMatch(newCell, rule.match, rule.exclude)) {
            let oldCell = newCell
            switch (rule.action) {
              case 'replace': newCell = replaceAction(newCell, rule)
                break
              default: console.error(`'${rule.action}' action isn't supported `)
            }
            if (row[column] !== newCell) report.push({ ...rule, oldCell, newCell })
          }
        }
        newRow[column] = newCell
        if (row[column] !== newCell) modificationReport.push(report)
        modifiedJson.push(newRow)
      })

      commit('DRYRUN_REGISTER', modifiedJson)
      commit('DRYRUN_REPORT_REGISTER', modificationReport)
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
