<template>
  <bulmaField has-addons>
      <div class="select">
        <select v-model="selectedAction" @change="displayParameters = true">
          <option v-for="(option, index) in actionOptions" :key="index"
            :value="option.value"
          >
            {{option.label}}
          </option>
        </select>
      </div>
      <bulmaButton
        picto="ellipsis-h"
        :purpose="noParameters ? 'dark' : ''"
        @click="displayParameters = !displayParameters"
      />
      <bulmaModal is-small no-overlay
        :is-active="displayParameters"
        @close="displayParameters = false"
      >
        <h4 class="title is-4" slot="header">{{selectedActionLabel}}</h4>
        <!-- Action Parameters -->
        <template v-if="selectedAction === 'replace'">
          <bulmaField is-horizontal>
            <label class="radio">
              <input type="radio" v-model="replaceUseMatchPattern" :value="true"> Use match pattern
            </label>
            <label class="radio">
              <input type="radio" v-model="replaceUseMatchPattern" :value="false"> Use the replace pattern below
            </label>
          </bulmaField>
          <bulmaField is-horizontal has-addons>
            <label field-label class="label" for="replaceMatch">Replace</label>
            <bulmaButton
              :label="replaceIsRegex ? 'Reg' : 'Str'"
              :title="replaceIsRegex ? 'Compare to a regular expression' : 'Compare to a character string'"
              @click="replaceIsRegex = !replaceIsRegex"
            />
            <input type="text" class="input" name="replaceMatch"
              :placeholder="replaceIsRegex ? 'Regular Expression' : 'Character string'"
              v-model="replaceReplacementPattern"
            >
          </bulmaField>
          <bulmaField is-horizontal>
            <label field-label class="label" for="replaceNew">By</label>
            <input class="input" name="replaceNew" type="text" placeholder="Replacement"
              v-model="replaceReplacementString"
            >
          </bulmaField>

        </template>
        <!-- Action Parameters END -->
        <div class="container" slot="footer">
          <bulmaLevel>
            <bulmaButton slot="left"
              label="Validate"
              purpose="success"
              @click="updateSelectedAction"
            />
            <bulmaButton slot="right"
              label="Cancel"
              purpose="danger" apply-color-to="picto"
              picto="times" last
              @click="resetSelectedAction"
            />
          </bulmaLevel>
        </div>
      </bulmaModal>
    </bulmaField>
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
      displayParameters: false,
      selectedAction: this.action.action || 'replace',
      actionOptions,
      optionsValidatedOnce: false,
      replaceUseMatchPattern: defaultIfUndefined(this.action.parameters.useMatchPattern, true),
      replaceIsRegex: defaultIfUndefined(this.action.parameters.isRegex, true),
      replaceReplacementPattern: this.action.parameters.replacementPattern || '',
      replaceReplacementString: this.action.parameters.replacementString || ''
    }
  },
  props: {
    action: {
      type: Object,
      default () {
        return {
          action: 'replace',
          parameters: {}
        }
      },
      validator (value) {
        return actionOptions.map(option => option.value).includes(value.action)
      }
    }
  },
  computed: {
    selectedActionLabel () {
      return this.actionOptions.filter(option => option.value === this.selectedAction)[0].label
    },
    noParameters () {
      switch (this.selectedAction) {
        case 'replace': return (
          this.replaceUseMatchPattern === true &&
          this.replaceIsRegex === true &&
          this.replaceReplacementPattern === '' &&
          this.replaceReplacementString === ''
        ) && !this.optionsValidatedOnce
        default: return true
      }
    }
  },
  methods: {
    updateSelectedAction () {
      let parameters = {}
      switch (this.selectedAction) {
        case 'replace':
          parameters.useMatchPattern = this.replaceUseMatchPattern || false
          parameters.isRegex = this.replaceIsRegex || false
          parameters.replacementPattern = this.replaceReplacementPattern
          parameters.replacementString = this.replaceReplacementString
      }
      this.$emit('update', {
        action: this.selectedAction,
        parameters
      })
      this.displayParameters = false
      this.optionsValidatedOnce = true
    },
    resetSelectedAction () {
      this.selectedAction = this.action.action
      this.resetParameters()
      this.displayParameters = false
    },
    resetParameters () {
      switch (this.selectedAction) {
        case 'replace':
          this.replaceUseMatchPattern = this.action.parameters.useMatchPattern
          this.replaceIsRegex = this.action.parameters.isRegex
          this.replaceReplacementPattern = this.action.parameters.replacementPattern
          this.replaceReplacementString = this.action.parameters.replacementString
      }
    }
  },
  watch: {
    action (value, oldValue) {
      if (value !== oldValue) {
        if (value.action !== oldValue.action) this.optionsValidatedOnce = false
        this.selectedAction = this.action.action
        this.resetParameters()
      }
    }
  }
}
</script>
