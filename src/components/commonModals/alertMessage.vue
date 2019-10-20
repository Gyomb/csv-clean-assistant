<template>
  <bulmaModal no-box no-overlay-cross :is-active="isActive" @close="closeModal">
    <div class="notification is-danger">
    <button class="delete" @click="closeModal" title="close this notification"></button>
    <h3 class="title is-3">{{source}}</h3>
      <p v-html="message"></p>
    </div>
  </bulmaModal>
</template>

<script>
export default {
  name: 'alertMessage',
  computed: {
    isActive () {
      return this.$store.state.commonModals.alertOpened || false
    },
    message () {
      return (this.$store.state.commonModals.alertParameters || {}).message || false
    },
    source () {
      return (this.$store.state.commonModals.alertParameters || {}).source || false
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'alert')
    }
  }
}
</script>
