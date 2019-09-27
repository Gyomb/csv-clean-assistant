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
      <div class="container" slot="footer">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-primary" @click="$emit('save', {})">
                Save column settings
              </button>
              <button class="button is-warning">
                Apply rules
              </button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button" @click="columnModalIsActive = false">
                Cancel
              </button>
            </div>
          </div>
        </div>
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
