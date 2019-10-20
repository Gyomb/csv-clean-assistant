<template>
  <bulmaField has-addons>
    <bulma-button picto="file-export" purpose="success" @click="exportCsv" :disabled="!exportFilepath" rounded />
    <bulma-button picto="sliders-h" @click="openModal" rounded />
    <span class="button is-rounded" @click="openModal">{{exportFilename}}</span>
  </bulmaField>
</template>

<script>

export default {
  name: 'exportSettingsInvite',
  props: {
    exportFilename: {
      type: String,
      default: ''
    },
    exportFilepath: {
      type: String,
      default: ''
    }
  },
  methods: {
    openModal () {
      this.$emit('openModal')
    },
    exportCsv () {
      this.$emit('exportCsv')
    }
  }
}
</script>
