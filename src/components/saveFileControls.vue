<template>
  <div>
    <bulmaField has-addons>
      <bulma-button picto="save" purpose="success" @click="saveCsv()" :disabled="saveFilePath === ''"/>
      <bulma-button picto="search" @click="fileModalIsActive = true" />
      <span class="button is-rounded" @click="fileModalIsActive = true">{{$store.state.csv.newFilename}}</span>
    </bulmaField>
    <bulmaModal :is-active="fileModalIsActive" @close="fileModalIsActive = false">
      <h2 slot="header">Choose how to save your CSV&hellip;</h2>
      <superRadioButtons v-model="saveMode"
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
      <bulma-button slot="footer" picto="save" purpose="success" label="Save" @click="saveCsv()" :disabled="saveFilePath === ''" />
      <bulma-button slot="footer" picto="times" label="Cancel" @click="fileModalIsActive = false"/>
    </bulmaModal>
  </div>
</template>

<script>
import superRadioButtons from '@/components/ui-toolbox/superRadioButtons'

export default {
  name: 'save-file-controls',
  components: {
    superRadioButtons
  },
  data () {
    return {
      fileModalIsActive: false,
      saveMode: this.$store.state.csv.saveMode,
      newfileFilename: '',
      newfileFolderData: { displayValue: '', files: [] },
      overwriteFileData: { displayValue: '', files: [] }
    }
  },
  computed: {
    newfilePath () {
      try {
        return this.newfileFolderData.files[0].path
      } catch {
        return ''
      }
    },
    overwritePath () {
      try {
        return this.overwriteFileData.files[0].path
      } catch {
        return ''
      }
    },
    saveFilePath () {
      function addExtension (path) {
        return path.replace(/(?:\.csv)*$/, '.csv')
      }
      let completePath = ''
      switch (this.saveMode) {
        case 'overwrite' :
          completePath = this.overwritePath ? addExtension(this.overwritePath) : ''
          this.$store.commit('CSV_SAVE_DATA_UPDATE', {
            filename: this.overwriteFileData.displayValue,
            filepath: completePath,
            saveMode: this.saveMode
          })
          break
        case 'newfile' :
          if (this.newfilePath === '' || this.newfileFilename === '') return ''
          let pathDelimiter = this.newfilePath.includes('\\') ? `\\` : '/' // use 'slash' as folder ending, except on windows, if the fullpath was provided
          completePath = addExtension(this.newfilePath + pathDelimiter + this.newfileFilename)
          this.$store.commit('CSV_SAVE_DATA_UPDATE', {
            filename: this.newfileFilename,
            filepath: completePath,
            saveMode: this.saveMode
          })
          break
      }
      return completePath
    }
  },
  methods: {
    saveCsv () {
      if (typeof this.saveFilePath === 'string' && this.saveFilePath !== '') {
        this.$store.dispatch('SAVE_CSV', this.saveFilePath)
      }
    }
  }
}
</script>
