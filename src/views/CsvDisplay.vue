<template>
  <div class="csv-display">
    <saveFileControls />
    <csvTable
      :header="$store.state.csv.header"
      :data="$store.state.csv.json"
      :columns-settings="$store.state.files.list[fileUid].columns || {}"
      @cellupdate="saveCellUpdate"
      @colupdate="saveColUpdate"
      @apply:rules="applyColRules"
    />
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
      this.$store.dispatch('SAVE_AND_APPLY_COL_SETTINGS_WO_RULES', {
        uid: this.fileUid,
        heading,
        settings
      })
    },
    applyColRules (parameters) {
      parameters.uid = this.fileUid
      this.$store.dispatch('APPLY_MODIFICATION_RULES', parameters)
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
