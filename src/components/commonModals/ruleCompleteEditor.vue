<template>
  <bulmaModal :is-active="modalIsActive" @close="closeModal">
    <h3 class="title" slot="header">Rule editor</h3>
    <bulmaField is-horizontal>
      <label field-label>Title:</label>
      <input type="text" class="input" v-model="title">
      <label field-label>Condition:</label>
      <button class="button no-button sumup-button"
          @click="selectMatchPattern"
          title="Edit the matching settings for this rule"
      >
        <matchSummup
          :exclude="exclude"
          :is-regex="isRegex"
          :match-pattern="matchPattern"
          :match-options="matchOptions"
        />
        <span class="icon is-small">
          <i class="fas fa-edit"></i>
        </span>
      </button>
      <label field-label>Action:</label>
      <button class="button no-button sumup-button"
        @click="selectAction"
      >
        <actionSummup
          :action="action"
          :parameters="parameters"
          title="Edit the action settings for this rule"
        />
        <span class="icon is-small">
          <i class="fas fa-edit"></i>
        </span>
      </button>
    </bulmaField>
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
import matchSummup from '@/components/ui-toolbox/matchSummup'
import actionSummup from '@/components/ui-toolbox/actionSummup'

const modalName = 'ruleCompleteEditor'

const ruleParameterList = [
  { key: 'title', default: '' },
  { key: 'action', default: '' },
  { key: 'exclude', default: false },
  { key: 'isRegex', default: true },
  { key: 'matchPattern', default: '' },
  { key: 'matchOptions', default: {} },
  { key: 'parameters', default: {} }
]

function setAllRuleParameters (rule = {}, data = {}) {
  ruleParameterList.forEach(({ key, default: defaultValue }) => {
    rule[key] = data[key] || defaultValue
  })
  return rule
}

export default {
  name: 'ruleCompleteEditor',
  components: {
    matchSummup,
    actionSummup
  },
  data () {
    let data = setAllRuleParameters()
    return data
  },
  computed: {
    modalIsActive () {
      return this.$store.state.commonModals[modalName + 'Opened'] || false
    },
    modalCallback () {
      return (this.$store.state.commonModals[modalName + 'Parameters'] || {}).callback || (value => console.error(value))
    },
    modalData () {
      return (this.$store.state.commonModals[modalName + 'Parameters'] || {}).data || {}
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'ruleCompleteEditor')
    },
    saveModifications () {
      this.closeModal()
      this.updateRule()
    },
    updateRule () {
      let updatedRule = { ...this.$data }
      delete updatedRule.modalName
      this.modalCallback({
        ...updatedRule
      })
    },
    resetParameters () {
      setAllRuleParameters(this, this.modalData.rule)
    },
    selectMatchPattern () {
      this.$store.commit('MODAL_OPEN', {
        id: 'matchPattern',
        parameters: {
          data: {
            exclude: this.exclude,
            isRegex: this.isRegex,
            pattern: this.matchPattern,
            ...this.matchOptions
          },
          callback: this.updateMatchPatternLocalData
        }
      })
    },
    selectAction () {
      this.$store.commit('MODAL_OPEN', {
        id: 'actionSelector',
        parameters: {
          data: {
            action: this.action || '',
            parameters: this.parameters || {},
            columnList: this.columnList || '',
            currentColumn: this.modalData.currentColumn || '',
            matchExcluded: this.exclude
          },
          callback: this.updateActionLocalData
        }
      })
    },
    updateMatchPatternLocalData ({ exclude, isRegex, pattern, global, caseSensitive, exactMatch }) {
      this.exclude = exclude
      this.isRegex = isRegex
      this.matchPattern = pattern
      this.matchOptions = {
        global,
        caseSensitive,
        exactMatch
      }
    },
    updateActionLocalData ({ action, parameters }) {
      this.action = action
      this.parameters = parameters
    }
  },
  watch: {
    modalIsActive: {
      handler (newStatus, oldStatus) {
        if (newStatus !== oldStatus && newStatus) this.resetParameters()
      },
      immediate: true
    }
  }
}
</script>
