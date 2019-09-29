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
        <swatchSelect v-if="selectedAction === 'highlight'"
          :options="highlightOptions"
          v-model="highlightSelectedOption"
        />
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
  { value: 'highlight', label: 'Highlight' }
]

const highlightOptions = [
  'primary',
  'info',
  'link',
  'success',
  'warning',
  'danger'
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
      selectedAction: this.action.action || 'highlight',
      actionOptions,
      highlightOptions,
      highlightSelectedOption: this.action.parameters.color || highlightOptions[0]
    }
  },
  props: {
    action: {
      type: Object,
      default () {
        return {
          action: 'highlight',
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
        case 'highlight': return !this.highlightSelectedOption
        default: return true
      }
    }
  },
  methods: {
    updateSelectedAction () {
      let parameters = {}
      switch (this.selectedAction) {
        case 'highlight': parameters.color = this.highlightSelectedOption
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
        case 'highlight': this.highlightSelectedOption = this.action.parameters.color
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
