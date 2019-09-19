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
  }
}
</script>
