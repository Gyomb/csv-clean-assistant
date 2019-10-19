<template>
  <div class="csv-display">
    <bulmaLevel mobile-view>
      <saveFileControls slot="left" />
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
  </div>
</template>

<script>
import saveFileControls from '@/components/saveFileControls.vue'
import csvTable from '@/components/csvTable'
import columnSettingsEditor from '@/components/commonModals/columnSettingsEditor'

export default {
  name: 'csv-display',
  components: {
    saveFileControls,
    csvTable,
    columnSettingsEditor
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
    }
  },
  mounted () {
  }
}
</script>
