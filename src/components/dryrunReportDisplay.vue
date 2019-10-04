<template>
  <ul>
    <li v-for="(rowReport, index) in report" :key="index">
      <ul class="columns is-multiline">
        <li class="column is-half">
          <div class="message">
            <div class="message-header">
              <span>
                {{HeadingValues(rowReport[0].row) || 'Cell #'+index}}
              </span>
              <span class="icon">
                <i class="fas fa-database"></i>
              </span>
            </div>
            <div class="message-body">
              <ul>
                <li v-for="(cellValue, name) in rowReport[0].row" :key="name">
                  <b>{{name}}</b>: {{cellValue}}
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="column is-half" v-for="(reportEntry, index) in rowReport" :key="index">
          <div class="message" :class="actionColor[reportEntry.rule.action]">
            <div class="message-header">
              <span>
                <span>
                  {{HeadingValues(reportEntry.row) || 'Cell #'+index}}
                </span>
                <span class="icon">
                  <i class="fas fa-angle-right"></i>
                </span>
                <span>
                  {{actionLabel(reportEntry.rule)}}
                </span>
              </span>
              <span>Action #{{index + 1}}</span>
            </div>
            <div class="message-body">
              <bulmaLevel v-if="reportEntry.rule.action === 'delete' && reportEntry.rule.entireRow">
                <span class="title is-5 has-text-danger" >
                  <span class="icon">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                  <span> This action will delete the entire row </span>
                  <span class="icon">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                </span>
              </bulmaLevel>
              <bulmaLevel is-centered mobile-view>
                <template slot="left">
                  <div>
                    <p class="title is-6">Old value{{reportEntry.rule.action === 'move' ? 's' : ''}}</p>
                    <p>
                      <b>
                        {{treatedColumn}}:
                      </b>
                      {{reportEntry.oldCell}}
                      <span class="icon" v-if="!reportEntry.oldCell">
                        <i class="fas fa-ban"></i>
                      </span>
                    </p>
                    <p v-if="reportEntry.rule.action === 'move'">
                      <b>
                        {{reportEntry.rule.moveTo}}:
                      </b>
                      {{reportEntry.row[reportEntry.rule.moveTo]}}
                      <span class="icon" v-if="!reportEntry.row[reportEntry.rule.moveTo]">
                        <i class="fas fa-ban"></i>
                      </span>
                    </p>
                  </div>
                </template>
                <span class="icon">
                  <i class="fas fa-arrow-right"></i>
                </span>
                <template slot="right">
                  <div>
                    <p class="title is-6">New value{{reportEntry.rule.action === 'move' ? 's' : ''}}</p>
                    <p>
                      {{reportEntry.newCell}}
                      <span class="icon" v-if="!reportEntry.newCell">
                        <i class="fas fa-ban"></i>
                      </span>
                    </p>
                    <p v-if="reportEntry.rule.action === 'move'">
                      {{reportEntry.newRow[reportEntry.rule.moveTo]}}
                      <span class="icon" v-if="!reportEntry.newRow[reportEntry.rule.moveTo]">
                        <i class="fas fa-ban"></i>
                      </span>
                    </p>
                  </div>
                </template>
              </bulmaLevel>
            </div>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'dryrunReportDisplay',
  data () {
    return {
      actionColor: {
        replace: 'is-warning',
        delete: 'is-danger',
        move: 'is-info'
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
    }
  }
}
</script>
