<template>
  <div :class="`column is-${width}`">
    <div
      :class="[
        'swatch',
        color ? `has-background-${color}` : '',
        { 'is-clickable': clickable }
      ]"
      @click="clickEventIfClickable"
    >
      <span class="icon is-medium" v-if="picto">
        <i :class="`far fa-${picto} fa-inverse`"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'swatch',
  props: {
    width: {
      type: [String, Number],
      default: 2
    },
    color: String,
    picto: String,
    clickable: Boolean
  },
  methods: {
    clickEventIfClickable () {
      if (this.clickable) this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
  .swatch {
    padding: calc(100% / 6);
    border-radius: 1rem;
    text-align: center;
    .is-clickable {
      cursor: pointer;
    }
  }
  .is-1 > .swatch {
    padding: calc(100% / 12);
  }
  .is-3 > .swatch {
    padding: calc(100% / 4);
  }
  .is-4 > .swatch {
    padding: calc(100% / 3);
  }
  .is-6 > .swatch {
    padding: calc(100% / 4);
  }
  .is-12 > .swatch {
    padding: calc(100% / 4);
  }
</style>
