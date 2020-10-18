<template>
  <bulmaButton
    :label="statefulLabel"
    :picto="statefulPicto"
    :purpose="statefulPurpose"
    :apply-color-to="statefulApplyColorTo"
    :rounded="rounded"
    :last="last"
    v-on="listeners"
  />
</template>

<script>
function stateObjectValidator (obj) {
  for (const propKey in obj) {
    if (obj.hasOwnProperty(propKey)) {
      const prop = obj[propKey]
      if (prop) {
        switch (typeof prop) {
          case 'string': break
          case 'object':
            if (Array.isArray(prop)) return false
            if (propKey !== 'picto') return false
            break
          default: return false
        }
      }
    }
  }
  return true
}

export default {
  name: 'buttonToggle',
  model: {
    prop: 'state',
    event: 'update'
  },
  props: {
    state: Boolean,
    label: String,
    picto: [String, Object],
    purpose: String,
    onState: {
      type: Object,
      default: () => ({}),
      validator: (obj) => stateObjectValidator(obj)
    },
    offState: {
      type: Object,
      default: () => ({}),
      validator: (obj) => stateObjectValidator(obj)
    },
    applyColorTo: {
      type: String,
      default: 'background'
    },
    rounded: Boolean,
    last: Boolean
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        click: event => this.$emit('update', !this.state)
      }
    },
    currentStateProp () {
      return this.state ? 'onState' : 'offState'
    },
    statefulLabel () {
      return this[this.currentStateProp].label || this.label || ''
    },
    statefulPicto () {
      return this[this.currentStateProp].picto || this.picto || ''
    },
    statefulPurpose () {
      return this[this.currentStateProp].purpose || this.purpose || ''
    },
    statefulApplyColorTo () {
      return this[this.currentStateProp].applyColorTo || this.applyColorTo || ''
    }
  }
}
</script>
