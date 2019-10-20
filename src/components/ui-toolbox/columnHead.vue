<template>
  <th>
    <button class="colhead no-button" v-on="listeners">
      <span class="colhdead-label">{{label}}</span>
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
    </button>
  </th>
</template>

<script>

export default {
  name: 'columnHead',
  props: {
    label: String
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners
      }
    }
  }
}
</script>

<style lang="scss">
  @import "bulma/sass/utilities/_all.sass";

  .colhead {
    cursor: pointer;
    &:hover {
      color: $link;
    }
  }
  .colhdead-label {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
</style>
