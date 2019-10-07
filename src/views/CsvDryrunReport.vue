<template>
  <dryrunReportDisplay :report="$store.state.modifier.dryrunReport" :head-columns="headColumns" :treated-column="$store.state.modifier.column" />
</template>

<script>
import dryrunReportDisplay from '@/components/dryrunReportDisplay.vue'

export default {
  name: 'CsvDryrunReport',
  components: {
    dryrunReportDisplay
  },
  computed: {
    fileUid () {
      return this.$store.state.userSettings.openedFile
    },
    headColumns () {
      const headColumnsNames = this.$store.getters.getHeadColumnNames
      if (headColumnsNames) return headColumnsNames
      const fileData = this.$store.state.files.list[this.fileUid] || {}
      return fileData.columns ? fileData.columns[0] : []
    }
  }
}
</script>
