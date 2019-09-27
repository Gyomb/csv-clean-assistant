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
			<button class="button is-success" @click="$emit('save', {})">
				Save
			</button>
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
