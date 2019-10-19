<template>
  <div class="home">
    <p class="content">
      How can I help you today?
    </p>
    <dropfileBox />
    <importSettingsModal
      :is-active="importSettingsModalIsActive"
      :file-properties="importSettingsFile"
      @update="updateImportSettings"
      @launchImport="launchImport"
      @close="closeSettingsModal"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import dropfileBox from '@/components/dropfileBox'
import importSettingsModal from '@/components/importSettingsModal'

export default {
  name: 'home',
  components: {
    dropfileBox,
    importSettingsModal
  },
  computed: {
    importSettingsModalIsActive () {
      return this.$store.state.commonModals.fileImportSettingsOpened
    },
    importSettingsUid () {
      return this.$store.state.commonModals.fileImportSettingsParameters.uid || ''
    },
    importSettingsFile () {
      return this.$store.state.files.list[this.importSettingsUid] || {}
    }
  },
  methods: {
    closeSettingsModal () {
      this.$store.commit('MODAL_CLOSE', 'fileImportSettings')
    },
    updateImportSettings (importSettings) {
      this.$store.commit('UPDATE_FILE_IMPORT_SETTINGS', {
        uid: this.importSettingsUid,
        settings: {
          ...importSettings
        }
      })
    },
    launchImport () {
      this.$store.dispatch('OPEN_FILE', { uid: this.importSettingsUid, forceImport: true })
    }
  },
  mounted () {
    let wasAfileAlreadyOpened = this.$store.state.userSettings.openedFile || this.$store.state.userSettings.openedFile === 0
    if (wasAfileAlreadyOpened) {
      this.$router.push('/csv-display')
    }
  }
}
</script>
