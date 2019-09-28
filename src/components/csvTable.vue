<template>
  <div class="table-container">
    <table class="table is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th v-for="(headEntry, index) in header" :key="headEntry+index">
            <columnRules :label="headEntry"
              :position="index" :position-max="header.length - 1"
              @save="$emit('colupdate', {heading: headEntry, settings: $event})"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <template v-for="(entry, index) in header">
            <editableCell :cellType="cellTypeIs(index)" :key="entry" :cellValue="row[entry]" @update="updateCell(rowIndex, entry, $event)"/>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import columnRules from '@/components/columnRules'
import editableCell from '@/components/ui-toolbox/editableCell'

export default {
  name: 'csvTable',
  components: {
    columnRules,
    editableCell
  },
  props: {
    header: Array,
    data: Array
  },
  methods: {
    cellTypeIs (index) {
      return index === 0 ? 'th' : 'td'
    },
    updateCell (row, col, value) {
      this.$emit('cellupdate', { row, col, value })
    }
  }
}
</script>
