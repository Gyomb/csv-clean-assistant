<template>
  <bulmaModal :is-active="modalIsActive" @close="closeModal">
    <h3 class="title" slot="header">Highlight editor</h3>
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
      <label field-label>Highlight:</label>
      <highlightSelector class="highlight-selector" v-model="color" />
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
import highlightSelector from '@/components/ui-toolbox/highlightSelector'
import matchSummup from '@/components/ui-toolbox/matchSummup'

const modalName = 'highlightCompleteEditor'

const ruleParameterList = [
  { key: 'title', default: '' },
  { key: 'action', default: 'highlight' },
  { key: 'color', default: 'primary' },
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
  name: modalName,
  components: {
    highlightSelector,
    matchSummup
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
      this.$store.commit('MODAL_CLOSE', modalName)
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
