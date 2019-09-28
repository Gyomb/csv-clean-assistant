<template>
  <div class="table-container">
    <table class="table is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th v-for="(headEntry, index) in header" :key="headEntry+index">
            <columnSettings :label="headEntry"
              :settings="columnsSettings[headEntry]"
              :position="index" :position-max="header.length - 1"
              @save="$emit('colupdate', {heading: headEntry, settings: $event})"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <template v-for="entry in header">
            <editableCell :cellType="cellTypeIs(entry)" :key="entry" :cellValue="row[entry]" @update="updateCell(rowIndex, entry, $event)"/>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import columnSettings from '@/components/columnSettings'
import editableCell from '@/components/ui-toolbox/editableCell'

export default {
  name: 'csvTable',
  components: {
    columnSettings,
    editableCell
  },
  props: {
    header: Array,
    data: Array,
    columnsSettings: {
      type: Object,
      default () { return {} }
    }
  },
  methods: {
    cellTypeIs (entry) {
      const thisColumnSetting = this.columnsSettings[entry] || {}
      return thisColumnSetting.isHeading ? 'th' : 'td'
    },
    updateCell (row, col, value) {
      this.$emit('cellupdate', { row, col, value })
    }
  }
}
</script>
