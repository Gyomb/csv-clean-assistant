<template>
  <div>
    <span class="colhead" @click="columnModalIsActive = true">
      <span class="colhdead-label">{{label}}</span>
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
    </span>
    <bulmaModal :is-active="columnModalIsActive" @close="columnModalIsActive = false">
      <!-- presets drawer -->
      <!-- pattern list -->
        <!-- regex => action widget -->
      <!-- add pattern button -->
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
  .colhead {
    cursor: pointer;
  }
  .colhdead-label {
    text-decoration: underline;
    &:hover {
      font-weight: bolder;
      text-decoration: none;
    }
  }
</style>
