<template>
  <div class="home">
    <p class="content">
      How can I help you today?
    </p>
    <dropfileBox />
  </div>
</template>

<script>
// @ is an alias to /src
import dropfileBox from '@/components/dropfileBox'

export default {
  name: 'home',
  components: {
    dropfileBox
  },
  methods: {
  },
  mounted () {
    let wasAfileAlreadyOpened = this.$store.state.userSettings.openedFile || this.$store.state.userSettings.openedFile === 0
    if (wasAfileAlreadyOpened) {
      this.$router.push('/csv-display')
    }
  }
}
</script>
