<template>
  <div class="swatch-selector columns is-multiline">
    <swatch v-for="(option, index) in options" :key="index"
      :color="option" :picto="value === option ? 'check-circle' : 'empty'"
      clickable @click="$emit('input', option)"
    />
  </div>
</template>

<script>
export default {
  name: 'swatchSelector',
  props: {
    options: {
      type: Array,
      validator (optionList) {
        return optionList.every(option => typeof option === 'string')
      },
      default () {
        return [
          'primary',
          'info',
          'link',
          'success',
          'warning',
          'danger'
        ]
      }
    },
    value: {
      type: String,
      default () { return this.options[0] }
    }
  }
}
</script>

<style lang="scss">
  .swatch-selector .swatch {
    cursor: pointer;
    &:hover .fa-empty:before {
      content: "\f111";
    }
  }
</style>
