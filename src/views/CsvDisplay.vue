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
  computed: {
    fileUid () {
      return this.$store.state.userSettings.openedFile
    }
  },
  methods: {
  },
  mounted () {
    this.$store.dispatch('OPEN_IMPORTED_CSV', this.fileUid)
      .catch(error => {
        if (error.code) {
          this.$store.dispatch('IMPORT_CSV', this.fileUid)
        } else {
          console.error(error)
        }
      })
  }
}
</script>
