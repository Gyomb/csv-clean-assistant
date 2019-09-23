<template>
  <div class="table-container">
    <table class="table is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th v-for="headEntry in header" :key="headEntry">
            <columnRules :label="headEntry" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <template v-for="(entry, index) in header">
            <th :key="entry" v-if="index === 0 ">{{row[entry]}}</th>
            <td :key="entry" v-else>{{row[entry]}}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import columnRules from '@/components/columnRules'

export default {
  name: 'csvTable',
  components: {
    columnRules
  },
  props: {
    header: Array,
    data: Array
  }
}
</script>
