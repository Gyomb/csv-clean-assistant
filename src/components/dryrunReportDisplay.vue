<template>
  <ul>
    <li v-for="(rowReport, index) in report" :key="index">
      <div class="message" :class="actionColor[reportEntry.action]" v-for="(reportEntry, index) in rowReport" :key="index">
        <bulmaLevel class="message-header">
          <h4 class="title is-5" slot="left">{{reportEntry.action}}</h4>
          <div slot="right" v-if="reportEntry.action === 'delete' && reportEntry.entireRow">
            <span class="icon">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
            <span> This will delete the entire row</span>
          </div>
        </bulmaLevel>
        <div class="message-body">
          <bulmaLevel is-centered>
            <template slot="left">
              <div>
                <h5 class="subtitle is-5">Old value</h5>
                <p>
                  {{reportEntry.oldCell}}
                  <span class="icon" v-if="!reportEntry.oldCell">
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
                <h5 class="subtitle is-5">New value</h5>
                <p>
                  {{reportEntry.newCell}}
                  <span class="icon" v-if="!reportEntry.newCell">
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
    }
  }
}
</script>
