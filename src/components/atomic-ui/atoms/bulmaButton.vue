<template>
  <button class="button" :class="[buttonColor, isRounded]" @click="$emit('click')">
    <span class="icon is-small" :class="[pictoColor]" v-if="picto && !last">
        <i :class="[iconClass, {'fa-inverse': hasColoredBackground}]"></i>
    </span>
    <span :class="[textColor]" v-if="label">{{label}}</span>
    <span class="icon is-small" :class="[pictoColor]" v-if="picto && last">
        <i :class="[iconClass, {'fa-inverse': hasColoredBackground}]"></i>
    </span>
  </button>
</template>

<script>
export default {
  name: 'bulmaButton',
  props: {
    picto: [String, Object],
    purpose: String,
    applyColorTo: {
      type: String,
      default: 'background'
    },
    label: String,
    rounded: Boolean,
    last: Boolean
  },
  computed: {
    iconClass () {
      if (typeof this.picto === 'string') return 'fas fa-' + this.picto
      if (this.picto.icon) {
        let iconSet = this.picto.set || 'fas'
        return `${iconSet} fa-${this.picto.icon}`
      }
      return ''
    },
    hasColoredBackground () {
      return this.purpose && this.applyColorTo.includes('background') && !this.applyColorTo.includes('border')
    },
    hasColoredBorder () {
      return this.purpose && this.applyColorTo.includes('border')
    },
    buttonColor () {
      let color = this.hasColoredBackground || this.hasColoredBorder ? 'is-' + this.purpose : ''
      let outline = this.hasColoredBorder ? ' is-outlined' : ''
      return color ? color + outline : ''
    },
    textColor () {
      if (this.purpose) {
        return this.applyColorTo.includes('text') ? 'has-text-' + this.purpose : ''
      }
      return ''
    },
    pictoColor () {
      if (this.purpose) {
        return this.applyColorTo.includes('picto') ? 'has-text-' + this.purpose : ''
      }
      return ''
    },
    isRounded () {
      return this.rounded ? 'is-rounded' : ''
    }
  }
}
</script>
