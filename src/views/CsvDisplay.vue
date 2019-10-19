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
      @colupdate="saveColUpdate"
      @apply:rules="applyColRules"
    />
    <bulmaModal :is-active="displaySource" @close="displaySource = false">
      <pre>{{$store.state.csv.json}}</pre>
    </bulmaModal>
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
        .then(this.$router.push('/csv-dryrun-report'))
    }
  },
  mounted () {
  }
}
</script>
