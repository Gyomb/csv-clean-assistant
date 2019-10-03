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
    <bulmaModal :is-active="dryrunIsDiplayed" @close="dryrunIsDiplayed = false">
      <h3 class="title" slot="header">
        <span class="icon">
          <i class="fas fa-glasses"></i>
        </span>
        <span> Dry run report</span>
      </h3>
      <dryrunReportDisplay :report="$store.state.modifier.dryrunReport" />
      <div class="container"  slot="footer">
        <bulmaLevel>
          <bulmaField slot="left">
            <bulmaButton purpose="success"
              picto="file-import" label="Apply"
              @click="applyModifications"
            />
          </bulmaField>
          <bulmaField slot="right">
            <bulmaButton
              picto="ban" label="Cancel"
              @click="cancelModifications"
            />
          </bulmaField>
        </bulmaLevel>
      </div>
    </bulmaModal>
  </div>
</template>

<script>
import saveFileControls from '@/components/saveFileControls.vue'
import csvTable from '@/components/csvTable'
import dryrunReportDisplay from '@/components/dryrunReportDisplay.vue'

export default {
  name: 'csv-display',
  components: {
    saveFileControls,
    csvTable,
    dryrunReportDisplay
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
        .then(this.dryrunIsDiplayed = true)
    },
    applyModifications () {
      this.dryrunIsDiplayed = false
      this.$store.dispatch('PROMOTE_DRYRUN', this.fileUid)
        .then(console.log('row\'s data modified and saved!'))
    },
    cancelModifications () {
      this.dryrunIsDiplayed = false
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
