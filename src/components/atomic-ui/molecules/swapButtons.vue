<template>
  <bulmaLevel mobile-view class="swap-buttons">
    <bulmaButton
      v-for="(buttonProps, index) in buttons" :key="index"
      class="is-fullwidth"
      :class="{'is-active': buttonProps.value === state}"
      :label="buttonProps.label || ''"
      :picto="buttonProps.picto || ''"
      :purpose="buttonProps.purpose || ''"
      :apply-color-to="buttonProps.value === state ? 'background' : 'border'"
      rounded="rounded"
      :last="buttonProps.last || false"
      @click="updateSate(buttonProps.value)"
    />
  </bulmaLevel>
</template>

<script>
export default {
  name: 'swapButtons',
  model: {
    prop: 'state',
    event: 'update'
  },
  props: {
    state: {
      default: ''
    },
    buttons: {
      type: Array,
      validator: arr => arr.every(item => typeof item === 'object')
    }
  },
  computed: {},
  methods: {
    updateSate (newState) {
      this.$emit('update', newState)
    }
  }
}
</script>
