<template>
  <div>
    <span class="colhead" @click="columnModalIsActive = true">
      <span class="colhdead-label">{{label}}</span>
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
    </span>
    <bulmaModal :is-active="columnModalIsActive" @close="columnModalIsActive = false">
      <h3 class="title" slot="header">Column "{{label}}"</h3>
      <h4 class="subtitle">Rulesets</h4>
      <!-- presets drawer -->
      <h4 class="subtitle">Applied Rules</h4>
      <!-- pattern list -->
        <!-- regex => action widget -->
      <!-- add pattern button -->
      <div class="buttons" slot="footer">
        <button class="button">Save rules</button>
        <button class="button is-primary">Apply rules</button>
      </div>
      <!-- save preset button -->
    </bulmaModal>
  </div>
</template>

<script>
export default {
  name: 'columnRules',
  data () {
    return {
      columnModalIsActive: false
    }
  },
  props: {
    label: String
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
