<template>
    <bulmaModal :is-active="fileModalIsActive" @close="closeModal">
      <h2 slot="header">Choose how to export your CSV&hellip;</h2>
      <superRadioButtons v-model="exportMode"
        :options="[
          {label: 'Create a new file', value: 'newfile'},
          {label: 'Overwrite an existing file', value: 'overwrite'}
        ]"
      >
        <bulmaField slot="newfile">
          <bulmaFileSelect class="is-fullwidth"
            select-type="folder" picto="folder" placeholder display="path"
            v-model="newfileFolderData"
          />
        </bulmaField>
        <bulmaField slot="newfile">
          <input type="text" class="input" placeholder="Enter a filename..." v-model="newfileFilename">
        </bulmaField>
        <bulmaField slot="overwrite">
          <!-- <label>Overwrite an existing file :</label> -->
          <bulmaFileSelect class='is-fullwidth'
            picto="file" placeholder accept=".csv"
            v-model="overwriteFileData"
          />
        </bulmaField>
      </superRadioButtons>
      <bulma-button slot="footer" picto="file-export" purpose="success" label="Export" @click="saveCsv()" :disabled="!exportFilepath" />
      <bulma-button slot="footer" picto="times" label="Cancel" @click="closeModal"/>
    </bulmaModal>
</template>

<script>
import superRadioButtons from '@/components/ui-toolbox/superRadioButtons'

export default {
  name: 'exportSettings',
  components: {
    superRadioButtons
  },
  computed: {
    fileModalIsActive () {
      return this.$store.state.commonModals.exportSettingsOpened || false
    },
    fileUid () {
      return this.$store.state.userSettings.openedFile
    },
    fileExportSettings () {
      return (this.$store.state.files.list[this.fileUid] || {}).exportParameters || {}
    },
    exportMode: {
      get () {
        return this.fileExportSettings.exportMode || 'newfile'
      },
      set (value) {
        this.updateExportData({ exportMode: value })
      }
    },
    newfileFolderData: {
      get () {
        return {
          displayValue: this.fileExportSettings.newfileFoldername || '',
          files: [this.fileExportSettings.newfileFile || '']
        }
      },
      set (value) {
        let fileDescriptor = {}
        for (const key in value.files[0]) {
          fileDescriptor[key] = value.files[0][key]
        }
        this.updateExportData({
          newfileFoldername: value.displayValue,
          newfileFile: fileDescriptor
        })
      }
    },
    overwriteFileData: {
      get () {
        return {
          displayValue: this.fileExportSettings.overwriteFilename || '',
          files: [this.fileExportSettings.overwritePath || '']
        }
      },
      set (value) {
        let fileDescriptor = {}
        for (const key in value.files[0]) {
          fileDescriptor[key] = value.files[0][key]
        }
        this.updateExportData({
          overwriteFilename: value.displayValue,
          overwriteFile: fileDescriptor
        })
      }
    },
    newfileFilename: {
      get () {
        return this.fileExportSettings.newfileFilename || ''
      },
      set (value) {
        this.updateExportData({ newfileFilename: value })
      }
    },
    exportFilepath () {
      return this.fileExportSettings.exportPath || ''
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'exportSettings')
    },
    saveCsv () {
      this.closeModal()
      if (typeof this.exportFilepath === 'string' && this.exportFilepath !== '') {
        this.$store.dispatch('EXPORT_CSV', this.fileUid)
      }
    },
    updateExportData (newValues) {
      this.$store.commit('UPDATE_FILE_EXPORT_SETTINGS', {
        uid: this.fileUid,
        settings: {
          ...this.fileExportSettings,
          ...newValues
        }
      })
    }
  }
}
</script>
