<template>
  <div class="csv-display">
    <saveFileControls />
    <csvTable :header="$store.state.csv.header" :data="$store.state.csv.json" />
    <pre>{{$store.state.csv.json}}</pre>
  </div>
</template>

<script>
import saveFileControls from '@/components/saveFileControls.vue'
import csvTable from '@/components/csvTable'

export default {
  name: 'csv-display',
  components: {
    saveFileControls,
    csvTable
  },
  methods: {
  }
}
</script>
