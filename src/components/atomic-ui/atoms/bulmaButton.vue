<template>
  <button class="button" :class="[backgroundColor, isRounded]" @click="$emit('click')">
    <span class="icon is-small" :class="[pictoColor]" v-if="picto && !last">
        <i class="fas" :class="[iconClass, {'fa-inverse': hasColoredBackground}]"></i>
    </span>
    <span :class="[textColor]" v-if="label">{{label}}</span>
    <span class="icon is-small" :class="[pictoColor]" v-if="picto && last">
        <i class="fas" :class="[iconClass, {'fa-inverse': hasColoredBackground}]"></i>
    </span>
  </button>
</template>

<script>
export default {
  name: 'bulmaButton',
  props: {
    picto: String,
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
      return 'fa-' + this.picto
    },
    hasColoredBackground () {
      return this.purpose && this.applyColorTo.includes('background')
    },
    backgroundColor () {
      return this.hasColoredBackground ? 'is-' + this.purpose : ''
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
