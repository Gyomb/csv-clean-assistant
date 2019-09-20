<template>
  <p class="content" v-text="msg">Please wait while loading…</p>
</template>

<script>

export default {
  name: 'csv-loading',
  computed: {
    msg () {
      return this.$route.params.msg ? this.$route.params.msg : 'Please wait while loading…'
    },
    csvStatus () {
      console.log(this.$store.state.csv.loadStatus)
      return this.$store.state.csv.loadStatus
    }
  },
  watch: {
    csvStatus (newStatus, oldStatus) {
      setTimeout(() => {
        if (newStatus === 'ready') {
          this.$router.push('/csv-display')
        }
      }, 500)
    }
  }
}
</script>
