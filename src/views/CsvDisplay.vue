<template>
  <div class="csv-display">
    <saveFileControls />
    <csvTable :header="$store.state.csv.header" :data="$store.state.csv.json" @cellupdate="saveCellUpdate" @colupdate="saveColUpdate" />
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
    saveCellUpdate ({ row, col, value }) {
      this.$store.dispatch('MODIFY_CELL', { row, col, value })
    },
    saveColUpdate ({ heading, settings }) {
      this.$store.commit('UPDATE_FILE_COLUMN_SETTINGS', {
        uid: this.fileUid,
        heading,
        settings
      })
    }
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
