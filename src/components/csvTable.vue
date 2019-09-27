<template>
  <div class="table-container">
    <table class="table is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th v-for="headEntry in header" :key="headEntry">
            <columnRules :label="headEntry" @save="$emit('colupdate', {header: headEntry, settings: $event})" />
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
