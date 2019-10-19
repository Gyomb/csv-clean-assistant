<template>
  <bulmaModal no-close-buttons fit-content :is-active="isActive">
    <div class="level">
      <div class="level-item has-text-centered">
        <div>
          <p>
            <span class="icon is-large">
              <i class="fas fa-2x fa-spinner fa-pulse"></i>
            </span>
          </p>
          <p v-html="message">Loading…</p>
        </div>
      </div>
    </div>
  </bulmaModal>
</template>

<script>
export default {
  name: 'loadingSpinner',
  computed: {
    isActive () {
      return this.$store.state.commonModals.loadingOpened || false
    },
    message () {
      return (this.$store.state.commonModals.loadingParameters || {}).message || false
    }
  }
}
</script>
