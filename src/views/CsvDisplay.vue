<template>
  <div class="csv-display">
    <bulmaLevel mobile-view>
      <exportSettingsInvite slot="left"
        :export-filename="exportFilename"
        :export-filepath="exportFilepath"
        @openModal="openExportModal"
        @exportCsv="exportCsv"
      />
      <bulmaField slot="right">
        <bulmaButton rounded
          picto="code"
          @click="displaySource = true"
        />
      </bulmaField>
    </bulmaLevel>
    <csvTable
      :header="$store.state.csv.header"
      :data="$store.state.csv.json"
      :columns-settings="$store.state.files.list[fileUid].columns || {}"
      @cellupdate="saveCellUpdate"
      @open:colsettings="openColSettings"
    />
    <bulmaModal :is-active="displaySource" @close="displaySource = false">
      <pre>{{$store.state.csv.json}}</pre>
    </bulmaModal>
    <columnSettingsEditor />
    <exportSettings />
    <ruleCompleteEditor />
    <highlightCompleteEditor />
    <actionSelector />
    <matchPattern />
  </div>
</template>

<script>
import csvTable from '@/components/csvTable'
import columnSettingsEditor from '@/components/commonModals/columnSettingsEditor'
import exportSettings from '@/components/commonModals/exportSettings'
import ruleCompleteEditor from '@/components/commonModals/ruleCompleteEditor'
import highlightCompleteEditor from '@/components/commonModals/highlightCompleteEditor'
import actionSelector from '@/components/commonModals/actionSelector'
import matchPattern from '@/components/commonModals/matchPattern'

export default {
  name: 'csv-display',
  components: {
    csvTable,
    columnSettingsEditor,
    exportSettings,
    ruleCompleteEditor,
    highlightCompleteEditor,
    actionSelector,
    matchPattern
  },
  data () {
    return {
      dryrunIsDiplayed: false,
      displaySource: false
    }
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
    },
    exportParameters () {
      const fileData = this.$store.state.files.list[this.fileUid] || {}
      return fileData.exportParameters || {}
    },
    exportFilename () {
      return this.exportParameters.exportFilename || ''
    },
    exportFilepath () {
      return this.exportParameters.exportPath || ''
    }
  },
  methods: {
    saveCellUpdate ({ row, col, value }) {
      this.$store.dispatch('MODIFY_CELL', { row, col, value })
    },
    openColSettings (columnName) {
      this.$store.commit('MODAL_OPEN', {
        id: 'columnSettingsEditor',
        parameters: { columnName }
      })
    },
    openExportModal () {
      this.$store.commit('MODAL_OPEN', {
        id: 'exportSettings'
      })
    },
    exportCsv () {
      if (typeof this.exportFilepath === 'string' && this.exportFilepath !== '') {
        this.$store.dispatch('EXPORT_CSV', this.fileUid)
      }
    }
  }
}
</script>
