<template>
  <div>
    <bulmaField has-addons>
      <bulma-button picto="save" purpose="success" @click="saveCsv()" />
      <bulma-button picto="search" @click="fileModalIsActive = true" />
      <input type="text" class="input" disabled />
    </bulmaField>
    <bulmaModal :is-active="fileModalIsActive" @close="fileModalIsActive = false">
      <h2 slot="header">Choose where to save your file&hellip;</h2>
      <bulmaField>
        <label>In a new file :</label>
        <bulmaFileSelect class="is-fullwidth"
          select-type="folder" picto="folder" placeholder display="path" 
          :value="folderpath" @select="folderSelected" 
        />
      </bulmaField>
      <bulmaField>
        <input type="text" class="input" placeholder="Enter a filename...">
      </bulmaField>
      <hr>
      <bulmaField>
        <label>In an existing file :</label>
        <bulmaFileSelect 
          picto="file" placeholder 
          :value="filename" @select="fileSelected"
        />
      </bulmaField>
      <bulma-button slot="footer" picto="save" purpose="success" label="Save" @click="saveCsv()" />
      <bulma-button slot="footer" picto="times" label="Cancel" @click="fileModalIsActive = false"/>
    </bulmaModal>
  </div>
</template>

<script>

export default {
  name: 'save-file-controls',
  data () {
    return {
      fileModalIsActive: false,
      filename: '',
      folderpath: ''
    }
  },
  methods: {
    saveCsv () {
      this.$store.dispatch('SAVE_CSV', 'filename_test')
    },
    folderSelected (folder) {
      this.folderpath = folder.value
    },
    fileSelected (file) {
      this.filename = file.value
    }
  }
}
</script>
