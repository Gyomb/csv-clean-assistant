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
          <!-- Replace parameters -->
          <bulmaField is-horizontal>
            <label class="radio">
              <input type="radio" v-model="replaceUseMatchPattern" :value="true" :disabled="matchExcluded"> Use match pattern
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
      replaceUseMatchPattern: defaultIfUndefined(this.action.parameters.useMatchPattern, !this.matchExcluded),
      replaceIsRegex: defaultIfUndefined(this.action.parameters.isRegex, true),
      replaceReplacementPattern: this.action.parameters.replacementPattern || '',
      replaceReplacementString: this.action.parameters.replacementString || '',
      deleteEntireRow: defaultIfUndefined(this.action.parameters.entireRow, false),
      moveMoveTo: defaultIfUndefined(this.action.parameters.moveTo, this.columnList.filter(column => column !== this.currentColumn)[0]),
      moveForce: this.action.parameters.force || false
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
    },
    matchExcluded: Boolean,
    columnList: {
      type: Array,
      default () {
        return []
      },
      validator (list) {
        return list.every(columnName => typeof columnName === 'string')
      }
    },
    currentColumn: {
      type: String,
      default: ''
    }
  },
  computed: {
    selectedActionLabel () {
      return this.actionOptions.filter(option => option.value === this.selectedAction)[0].label
    },
    noParameters () {
      switch (this.selectedAction) {
        case 'replace': return (
          this.replaceUseMatchPattern === !this.matchExcluded &&
          this.replaceIsRegex === true &&
          this.replaceReplacementPattern === '' &&
          this.replaceReplacementString === ''
        ) && !this.optionsValidatedOnce
        case 'delete': return this.deleteEntireRow === false && !this.optionsValidatedOnce
        case 'move': return (
          this.moveMoveTo === this.currentColumn &&
          this.moveForce === false
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
          this.replaceUseMatchPattern = defaultIfUndefined(this.action.parameters.useMatchPattern, !this.matchExcluded)
          this.replaceIsRegex = defaultIfUndefined(this.action.parameters.isRegex, true)
          this.replaceReplacementPattern = defaultIfUndefined(this.action.parameters.replacementPattern, '')
          this.replaceReplacementString = defaultIfUndefined(this.action.parameters.replacementString, '')
          break
        case 'delete':
          this.deleteEntireRow = this.action.parameters.entireRow || false
          break
        case 'move':
          this.moveMoveTo = defaultIfUndefined(this.action.parameters.moveTo, this.columnList.filter(column => column !== this.currentColumn)[0])
          this.moveForce = this.action.parameters.force || false
          break
        default: console.error(Error(`Cannot reset parameters for '${this.selectedAction}' action`))
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
