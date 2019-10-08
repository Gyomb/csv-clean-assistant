<template>
  <ul>
    <li v-for="(rowReport, index) in report" :key="index">
      <div class="columns is-multiline">
        <div class="column is-4">
          <bulmaPanel
            :heading="HeadingValues(rowReport[0].row) || 'Cell #'+index"
            :tabs="['original', 'modified']"
          >
            <tab-container>
              <span v-for="(cellValue, name) in rowReport[0].row" :key="name">
                <b>{{name}}</b>: {{cellValue}}
              </span>
            </tab-container>
            <tab-container>
              <span v-for="(cellValue, name) in rowReport[rowReport.length - 1].newRow" :key="name">
                <b>{{name}}</b>: {{cellValue}}
              </span>
            </tab-container>
          </bulmaPanel>
        </div>
        <div class="column is-8">
          <table class="table is-fullwidth is-narrow log-table">
            <thead>
              <th>#</th>
              <th>Action on "{{treatedColumn}}"</th>
              <th>Old</th>
              <th></th>
              <th>New</th>
            </thead>
            <tbody>
              <template v-for="(reportEntry, index) in rowReport">
                <tr :key="index">
                  <th :class="actionColor[reportEntry.rule.action].is">{{index}}</th>
                  <td :class="actionColor[reportEntry.rule.action].is">
                    {{actionLabel(reportEntry.rule)}}
                  </td>
                  <td>
                    {{reportEntry.oldCell}}
                    <span class="icon" v-if="!reportEntry.oldCell">
                      <i class="fas fa-ban"></i>
                    </span>
                  </td>
                  <td>
                    <span class="icon">
                      <i class="fas fa-arrow-right"></i>
                    </span>
                  </td>
                  <td>
                    {{reportEntry.newCell}}
                    <span class="icon" v-if="!reportEntry.newCell">
                      <i class="fas fa-ban"></i>
                    </span>
                  </td>
                </tr>
                <tr v-if="getAlerts(reportEntry)" :key="index+'-alert'">
                  <td :class="actionColor[reportEntry.rule.action].text" colspan="5">
                    <span class="icon">
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    {{getAlerts(reportEntry)}}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'dryrunReportDisplay',
  data () {
    return {
      actionColor: {
        replace: { is: 'is-warning', text: 'has-text-warning' },
        delete: { is: 'is-danger', text: 'has-text-danger' },
        move: { is: 'is-info', text: 'has-text-info' }
      }
    }
  },
  props: {
    report: {
      type: Array,
      default () { return [] }
    },
    headColumns: {
      type: Array,
      default () {
        return []
      }
    },
    treatedColumn: String
  },
  methods: {
    HeadingValues (row) {
      return this.headColumns.map(columnName => row[columnName] || '').join(' / ')
    },
    actionLabel (rule) {
      switch (rule.action) {
        case 'replace': return `Replace "${rule.match}" by "${rule.replacementString}"`
        case 'move': return `Move ${this.treatedColumn} to ${rule.moveTo}`
        default: return rule.action.split('').map((letter, id) => id === 0 ? letter.toUpperCase() : letter).join('')
      }
    },
    getAlerts (entry) {
      switch (entry.rule.action) {
        case 'replace': return false
        case 'move':
          const moveToCellValue = entry.row[entry.rule.moveTo]
          if (!entry.rule.force) return false
          if (moveToCellValue) return entry.rule.moveTo + '\'s content will be overwritten : "' + moveToCellValue + '"'
          return false
        case 'delete': return entry.rule.entireRow ? 'The whole row will be deleted' : false
        default: return false
      }
    }
  }
}
</script>

<style lang="scss">
  table.log-table {
    thead th:nth-child(-n+2){
      white-space:nowrap;
    }
  }
</style>
