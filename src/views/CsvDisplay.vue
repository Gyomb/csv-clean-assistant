<template>
  <div class="csv-display">
    <saveFileControls />
    <pre>{{$store.state.csv.json}}</pre>
  </div>
</template>

<script>
import saveFileControls from '@/components/saveFileControls.vue'

export default {
  name: 'csv-display',
  components: {
    saveFileControls
  },
  methods: {
  }
}
</script>
