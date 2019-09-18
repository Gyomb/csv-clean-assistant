<template>
  <button class="button is-rounded" :class="[colorClass]" @click="$emit('click')">
    <span class="icon is-small" v-if="picto">
        <i class="fas fa-play fa-inverse" :class="[iconClass]"></i>
    </span>
    <span v-if="label">{{label}}</span>
  </button>
</template>

<script>
export default {
  name: 'bulmaButton',
  props: {
    picto: String,
    purpose: String,
    label: String
  },
  computed: {
    iconClass () {
      return 'fa-' + this.picto
    },
    colorClass () {
      return 'is-' + this.purpose
    }
  }
}
</script>
