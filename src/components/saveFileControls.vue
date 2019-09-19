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
        <bulmaFileSelect select-type="folder" picto="folder" placeholder />
      </bulmaField>
      <bulmaField>
        <input type="text" class="input" placeholder="Enter a filename...">
      </bulmaField>
      <hr>
      <bulmaField>
        <label>In an existing file :</label>
        <bulmaFileSelect picto="file" placeholder/>
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
      fileModalIsActive: false
    }
  },
  methods: {
    saveCsv () {
      this.$store.dispatch('SAVE_CSV', 'filename_test')
    }
  }
}
</script>
