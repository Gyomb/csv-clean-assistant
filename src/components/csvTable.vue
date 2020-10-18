<template>
  <div class="table-container">
    <table class="table is-hoverable is-narrow">
      <thead>
        <tr>
          <th>#</th>
          <columnHead class="cell-nobreak"
            v-for="(headEntry, index) in header" :key="headEntry+index"
            :label="headEntry"
            @click="$emit('open-col-settings', headEntry)"
          />
        </tr>
      </thead>
      <tbody>
        <tr v-show="moreRowsToLoadTop" ref="topLoader">
          <td :colspan="header.length + 1">
            <bulmaButton
              class="is-fullwidth is-loading"
              label="Load more…"
            />
          </td>
        </tr>
        <tr v-for="(row, rowIndex) in data.slice(displayStart, displayEnd)" :key="rowIndex">
          <th>{{rowIndex + displayStart}}</th>
          <editableCell v-for="column in header" :key="rowIndex+'-'+column"
            :class="cellColor(column, row[column])"
            :cellType="cellTypeIs(column)" :value="row[column]"
            @update="updateCell(rowIndex, column, $event)"
          />
        </tr>
        <tr v-show="moreRowsToLoadBottom" ref="bottomLoader">
          <td :colspan="header.length + 1">
            <bulmaButton
              class="is-fullwidth is-loading"
              label="Load more…"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import columnHead from '@/components/ui-toolbox/columnHead'
import editableCell from '@/components/ui-toolbox/editableCell'
import { formatFlags } from '@/helpers/matchLogics'

export default {
  name: 'csvTable',
  components: {
    columnHead,
    editableCell
  },
  data () {
    return {
      displayStart: 0,
      displayRange: 100,
      displayBottomObserverPreviousRatio: 0,
      displayBottomObserver: new IntersectionObserver((entries) => {
        if (this.displayBottomObserverPreviousRatio <= 0 && entries[0].intersectionRatio > 0) {
          this.displayStart += Math.round(this.displayRange / 2)
          window.document.children[0].scrollTop = (window.document.children[0].scrollHeight / 2.4)
        }
        this.displayBottomObserverPreviousRatio = entries[0].intersectionRatio
      }),
      displayTopObserverPreviousRatio: 0,
      displayTopObserver: new IntersectionObserver((entries) => {
        if (this.displayTopObserverPreviousRatio <= 0 && entries[0].intersectionRatio > 0) {
          const newStart = this.displayStart - Math.round(this.displayRange / 2)
          this.displayStart = newStart >= 0 ? newStart : 0
          window.document.children[0].scrollTop = window.document.children[0].scrollHeight / 2.5
        }
        this.displayTopObserverPreviousRatio = entries[0].intersectionRatio
      })
    }
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
    displayEnd () {
      return this.displayStart + this.displayRange
    },
    moreRowsToLoadBottom () {
      if (this.data.length > this.displayEnd) return true
      return false
    },
    moreRowsToLoadTop () {
      if (this.displayStart > 0) return true
      return false
    },
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
                match: rule.isRegex ? new RegExp(rule.matchPattern, formatFlags(rule.matchOptions)) : rule.matchPattern,
                color: rule.color,
                options: rule.matchOptions || {}
              }
            })
        }
      }
      return columnHighlights
    }
  },
  methods: {
    rowLoaderInit () {
      if (this.$refs.bottomLoader) this.displayBottomObserver.observe(this.$refs.bottomLoader)
      if (this.$refs.topLoader) this.displayTopObserver.observe(this.$refs.topLoader)
    },
    cellTypeIs (column) {
      return this.thisColumnSetting(column).isHeading ? 'th' : 'td'
    },
    cellColor (column, value = '') {
      const classPartial = ' is-'
      const thisColumnHighlights = this.columnHighlights ? (this.columnHighlights[column] || []) : []
      const colors = thisColumnHighlights
        .filter(rule => {
          let isMatch = false
          if (rule.match instanceof RegExp) {
            isMatch = rule.match.test(value)
          } else if (rule.options && rule.options.exactMatch) {
            isMatch = value === rule.match
          } else {
            isMatch = value.includes(rule.match)
          }
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
  },
  mounted () {
    this.rowLoaderInit()
  }
}
</script>

<style lang="scss">
  .table {
    .cell-nobreak {
      white-space: nowrap;
    }
  }
</style>
