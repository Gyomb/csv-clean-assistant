<template>
  <div class="table-container">
    <table class="table is-hoverable is-narrow">
      <thead>
        <tr>
          <th v-for="(headEntry, index) in header" :key="headEntry+index">
            <columnSettingsEditor :label="headEntry"
              :settings="columnsSettings[headEntry]"
              :position="index" :position-max="header.length - 1"
              :column-list="header"
              @save="$emit('colupdate', {heading: headEntry, settings: $event})"
              @apply:rules="$emit('apply:rules', {column: headEntry})"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <editableCell v-for="column in header" :key="rowIndex+'-'+column"
            :class="cellColor(column, row[column])"
            :cellType="cellTypeIs(column)" :value="row[column]"
            @update="updateCell(rowIndex, column, $event)"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import columnSettingsEditor from '@/components/columnSettingsEditor'
import editableCell from '@/components/ui-toolbox/editableCell'

export default {
  name: 'csvTable',
  components: {
    columnSettingsEditor,
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
  computed: {
    thisColumnSetting () {
      return column => {
        return this.columnsSettings[column] || {}
      }
    },
    columnHighlights () {
      let columnHighlights = {}
      for (const column in this.columnsSettings) {
        if (this.columnsSettings.hasOwnProperty(column)) {
          const columnHighlightRules = this.columnsSettings[column].highlights || []
          columnHighlights[column] = columnHighlightRules
            .map(rule => {
              return {
                exclude: !!rule.exclude,
                match: rule.isRegex ? new RegExp(rule.matchPattern) : rule.matchPattern,
                color: rule.color
              }
            })
        }
      }
      return columnHighlights
    }
  },
  methods: {
    cellTypeIs (column) {
      return this.thisColumnSetting(column).isHeading ? 'th' : 'td'
    },
    cellColor (column, value = '') {
      const classPartial = ' is-'
      const thisColumnHighlights = this.columnHighlights ? (this.columnHighlights[column] || []) : []
      const colors = thisColumnHighlights
        .filter(rule => {
          const isMatch = rule.match instanceof RegExp ? rule.match.test(value) : value.includes(rule.match)
          if (!rule.exclude && isMatch) return true
          if (rule.exclude && !isMatch) return true
          return false
        })
        .map(rule => rule.color)

      return colors.length > 0 ? classPartial + colors.join(classPartial) : ''
    },
    updateCell (row, col, value) {
      this.$emit('cellupdate', { row, col, value })
    }
  }
}
</script>
