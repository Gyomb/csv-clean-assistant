<template>
  <bulmaModal :is-active="isActive" @close="close">
    <h3 class="title" slot="header"> import settings</h3>
    <p class="subtitle">For: <em>{{fileProperties.name}}</em></p>
    <bulmaField>
      <label class="checkbox">
        <input type="checkbox" v-model="noHeader">
        No headers (in the CSV file)
      </label>
    </bulmaField>
    <div class="container" slot="footer">
        <bulmaLevel mobile-view>
          <bulmaButton slot="left" purpose="primary" label="Save settings"  @click="saveSettings" />
          <bulmaButton slot="left" picto="redo" purpose="danger" apply-color-to="picto" label="Import file" @click="importFile" />
          <bulmaButton slot="right" picto="times" label="Cancel" @click="$emit('close')" last />
        </bulmaLevel>
      </div>
  </bulmaModal>
</template>

<script>
export default {
  name: 'importSettingsModal',
  data () {
    return {
      noHeader: (this.fileProperties.importParameters || {}).noHeader || false
    }
  },
  props: {
    isActive: Boolean,
    fileProperties: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    saveSettings () {
      this.$emit('update', {
        ...this.fileProperties.importParameters,
        noHeader: this.noHeader || false
      })
      this.close()
    },
    importFile () {
      this.saveSettings()
      this.$emit('launchImport')
    },
    close () {
      this.$emit('close')
    }
  },
  watch: {
    fileProperties () {
      this.noHeader = (this.fileProperties.importParameters || {}).noHeader || false
    }
  }
}
</script>
