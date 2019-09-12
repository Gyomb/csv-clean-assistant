<template>
  <div class="home section">
    <div class="container">
      <img alt="Vue logo" src="../assets/logo.png">
      <p class="content">
        How can I help you today?
      </p>
      <dropfileBox />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import dropfileBox from '@/components/dropfileBox'

export default {
  name: 'home',
  components: {
    dropfileBox
  }
}
</script>
