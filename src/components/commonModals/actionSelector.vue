<template>
  <bulmaModal is-small no-overlay
    :is-active="actionSelectorIsActive"
    @close="closeModal"
  >
    <h4 class="title is-4" slot="header">Do the following:</h4>
    <bulmaField>
      <div class="select is-fullwidth">
        <select v-model="selectedAction">
          <option value="" disabled>Please select an action&hellip;</option>
          <option v-for="(option, index) in actionOptions" :key="index"
            :value="option.value"
          >
            {{option.label}}
          </option>
        </select>
      </div>
    </bulmaField>
    <!-- Action Parameters -->
    <template v-if="selectedAction === 'replace'">
      <!-- Replace parameters -->
      <bulmaField>
        <label field-label class="label">Use</label>
      </bulmaField>
      <bulmaField is-horizontal>
        <label class="radio" :disabled="matchExcluded">
          <input type="radio" v-model="replaceUseMatchPattern" :value="true" :disabled="matchExcluded"> the initial match pattern
        </label>
        <label class="radio">
          <input type="radio" v-model="replaceUseMatchPattern" :value="false"> another replace pattern
        </label>
      </bulmaField>
      <div v-if="!replaceUseMatchPattern">
        <label field-label class="label" for="replaceMatch">To replace</label>
        <div class="tabs is-centered is-small is-boxed">
          <ul>
            <li :class="{'is-active': !replaceIsRegex}"><a href="#" @click="setIsRegexOnClick($event, false)">String</a></li>
            <li :class="{'is-active': replaceIsRegex}"><a href="#" @click="setIsRegexOnClick($event, true)">Regular Expression</a></li>
          </ul>
        </div>
        <regexInput v-if="replaceIsRegex"
          placeholder="this regular expression"
          v-model="replaceReplacementRegexPattern"
        />
        <template v-else>
          <bulmaField>
            <input type="text" class="input" v-model="replaceReplacementStringPattern" placeholder="this word">
          </bulmaField>
        </template>
        <hr>
      </div>
      <bulmaField>
        <label field-label class="label" for="replaceNew">{{replaceUseMatchPattern ? 'To replace b' : 'B'}}y</label>
      </bulmaField>
      <bulmaField>
        <input class="input" name="replaceNew" type="text" placeholder="Replacement"
          v-model="replaceReplacementString"
        >
      </bulmaField>
    </template>
    <template v-if="selectedAction === 'delete'">
      <!-- Delete parameters -->
      <bulmaField>
        <label class="checkbox">
          <input type="checkbox" v-model="deleteEntireRow">
          <span> Delete the entire row</span>
        </label>
      </bulmaField>
    </template>
    <template v-if="selectedAction === 'move'">
      <!-- Move parameters -->
      <bulmaField>
        <label field-label>
          Move to column
        </label>
        <div class="select">
          <select v-model="moveMoveTo">
            <option v-for="(option, index) in columnList" :key="index"
              :value="option" :disabled="option === currentColumn"
            >
              {{option}}
            </option>
          </select>
        </div>
      </bulmaField>
      <bulmaField>
        <label class="checkbox">
          <input type="checkbox" v-model="moveForce">
          Force move action even if the destination cell is not empty
        </label>
      </bulmaField>
    </template>
    <!-- Action Parameters END -->
    <div class="container" slot="footer">
      <bulmaLevel mobile-view>
        <bulmaButton slot="left"
          label="Validate"
          purpose="success"
          @click="saveModifications"
        />
        <bulmaButton slot="right"
          label="Cancel"
          purpose="danger" apply-color-to="picto"
          picto="times" last
          @click="closeModal"
        />
      </bulmaLevel>
    </div>
  </bulmaModal>
</template>

<script>

const actionOptions = [
  { value: 'delete', label: 'Delete' },
  { value: 'replace', label: 'Modify' },
  { value: 'move', label: 'Move' }
]

const someValuesAreUndefined = (values) => {
  let aValueIsUndefined = false
  if (Array.isArray(values)) {
    for (const value of values) {
      if (typeof value === 'undefined') {
        aValueIsUndefined = true
        break
      }
    }
  } else {
    if (typeof values === 'undefined') aValueIsUndefined = true
  }
  return aValueIsUndefined
}

const defaultIfUndefined = (value, defaultValue) => {
  return someValuesAreUndefined([value]) ? defaultValue : value
}

export default {
  name: 'actionSelector',
  model: {
    prop: 'action',
    event: 'update'
  },
  data () {
    return {
      selectedAction: '',
      actionOptions,
      replaceUseMatchPattern: false,
      replaceIsRegex: true,
      replaceReplacementPattern: '',
      replaceReplacementOptions: {},
      replaceReplacementString: '',
      deleteEntireRow: false,
      moveMoveTo: '',
      moveForce: false
    }
  },
  computed: {
    actionSelectorIsActive () {
      return this.$store.state.commonModals.actionSelectorOpened || false
    },
    actionSelectorCallback () {
      return (this.$store.state.commonModals.actionSelectorParameters || {}).callback || (value => console.error(value))
    },
    actionSelectorData () {
      return (this.$store.state.commonModals.actionSelectorParameters || {}).data || {}
    },
    actionSelectorParameters () {
      return this.actionSelectorData.parameters || {}
    },
    matchExcluded () {
      return this.actionSelectorData.matchExcluded
    },
    replaceReplacementRegexPattern: {
      get () {
        return {
          pattern: this.replaceReplacementPattern,
          ...this.replaceReplacementOptions
        }
      },
      set ({ pattern, ...options }) {
        this.replaceReplacementPattern = pattern
        this.replaceReplacementOptions = options
      }
    },
    replaceReplacementStringPattern: {
      get () { return this.replaceReplacementPattern },
      set (stringPattern) {
        this.replaceReplacementPattern = stringPattern
      }
    },
    columnList () {
      const list = this.actionSelectorData.columnList
      const listIsValid = list.every(columnName => typeof columnName === 'string')
      if (!listIsValid) console.error(Error('columnList isn\'t valid'))
      return listIsValid ? list : []
    },
    currentColumn () {
      return this.actionSelectorData.currentColumn || ''
    },
    selectedActionLabel () {
      const selectedActionDetails = this.actionOptions.filter(option => option.value === this.selectedAction)
      return (selectedActionDetails[0] || {}).label
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'actionSelector')
    },
    saveModifications () {
      this.closeModal()
      this.updateSelectedAction()
    },
    updateSelectedAction () {
      let parameters = {}
      switch (this.selectedAction) {
        case 'replace':
          parameters.useMatchPattern = this.replaceUseMatchPattern || false
          parameters.isRegex = this.replaceIsRegex || false
          parameters.replacementPattern = this.replaceReplacementPattern
          parameters.replacementString = this.replaceReplacementString
          break
        case 'delete':
          parameters.entireRow = this.deleteEntireRow || false
          break
        case 'move':
          parameters.moveTo = this.moveMoveTo || this.columnList.filter(column => column !== this.currentColumn)[0]
          parameters.force = this.moveForce || false
          break
        default: console.error(Error(`Cannot update parameters for '${this.selectedAction}' action`))
      }
      this.actionSelectorCallback({
        action: this.selectedAction,
        parameters
      })
    },
    setMoveToDefault () {
      this.moveTo = this.parameters.columnList.filter(column => column !== this.currentColumn)[0]
    },
    setIsRegexOnClick (event, value) {
      event.preventDefault()
      this.replaceIsRegex = value
    },
    resetParameters () {
      switch (this.selectedAction) {
        case 'replace':
          this.replaceUseMatchPattern = defaultIfUndefined(this.actionSelectorParameters.useMatchPattern, !this.matchExcluded)
          this.replaceIsRegex = defaultIfUndefined(this.actionSelectorParameters.isRegex, false)
          this.replaceReplacementPattern = defaultIfUndefined(this.actionSelectorParameters.replacementPattern, '')
          this.replaceReplacementString = defaultIfUndefined(this.actionSelectorParameters.replacementString, '')
          break
        case 'delete':
          this.deleteEntireRow = this.actionSelectorParameters.entireRow || false
          break
        case 'move':
          this.moveMoveTo = defaultIfUndefined(this.actionSelectorParameters.moveTo, this.columnList.filter(column => column !== this.currentColumn)[0])
          this.moveForce = this.actionSelectorParameters.force || false
          break
        default: console.error(Error(`Cannot reset parameters for '${this.selectedAction}' action`))
      }
    }
  },
  watch: {
    actionSelectorIsActive: {
      handler () {
        if (this.actionSelectorIsActive) {
          this.selectedAction = this.actionSelectorData.action || ''
          if (this.selectedAction) this.resetParameters()
        }
      },
      immediate: true
    },
    selectedAction (value, oldValue) {
      if (value !== '' && value !== oldValue) {
        this.resetParameters()
      }
    }
  }
}
</script>
