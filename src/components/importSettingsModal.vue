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
    <label class="subtitle">Set Delimiter</label>
    <bulmaField is-grouped>
      <label class="radio">
        <input type="radio" v-model="manuallySetDelimiter" :value="false">
        Auto
      </label>
      <label class="radio">
        <input type="radio" v-model="manuallySetDelimiter" :value="true">
        Manually
      </label>
      <input type="text" class="input" v-model="displayedDelimiter" :disabled="disableDelimiterInput">
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
      noHeader: (this.fileProperties.importParameters || {}).noHeader || false,
      delimiter: (this.fileProperties.importParameters || {}).delimiter || false,
      disableDelimiterInput: !this.delimiter
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
  computed: {
    displayedDelimiter: {
      get () {
        return this.delimiter || ''
      },
      set (value) {
        this.delimiter = value
      }
    },
    manuallySetDelimiter: {
      get () {
        if (this.delimiter) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.disableDelimiterInput = false
          return true
        }
        return !this.disableDelimiterInput
      },
      set (value) {
        this.disableDelimiterInput = !value
      }
    }
  },
  methods: {
    saveSettings () {
      this.$emit('update', {
        ...this.fileProperties.importParameters,
        noHeader: this.noHeader || false,
        delimiter: this.delimiter || false
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
      this.delimiter = (this.fileProperties.importParameters || {}).delimiter || false
      this.disableDelimiterInput = !this.delimiter
    },
    disableDelimiterInput () {
      if (this.disableDelimiterInput) this.delimiter = false
    }
  }
}
</script>
