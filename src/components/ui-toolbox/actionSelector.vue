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
        <bulmaField isHorizontal v-if="selectedAction === 'replace'">
          <label class="label" for="replaceMatch">Replace</label>
          <input class="input" name="replaceMatch" type="text" placeholder="pattern"
            v-model="replaceReplacementPattern"
          >
          <label class="label" for="replaceNew">By</label>
          <input class="input" name="replaceNew" type="text" placeholder="Replacement"
            v-model="replaceReplacementString"
          >
        </bulmaField>
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
      const valuesAreDefined = (values) => {
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
      switch (this.selectedAction) {
        case 'replace': return valuesAreDefined([this.replaceReplacementPattern, this.replaceReplacementString])
        default: return true
      }
    }
  },
  methods: {
    updateSelectedAction () {
      let parameters = {}
      switch (this.selectedAction) {
        case 'replace':
          parameters.replacementPattern = this.replaceReplacementPattern
          parameters.replacementString = this.replaceReplacementString
      }
      this.$emit('update', {
        action: this.selectedAction,
        parameters
      })
      this.displayParameters = false
    },
    resetSelectedAction () {
      this.selectedAction = this.action.action
      this.resetParameters()
      this.displayParameters = false
    },
    resetParameters () {
      switch (this.selectedAction) {
        case 'replace':
          this.replaceReplacementPattern = this.action.parameters.replacementPattern
          this.replaceReplacementString = this.action.parameters.replacementString
      }
    }
  },
  watch: {
    action (value, oldValue) {
      if (value !== oldValue) {
        this.selectedAction = this.action.action
        this.resetParameters()
      }
    }
  }
}
</script>
