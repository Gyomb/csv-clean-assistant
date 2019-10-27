<template>
  <bulmaLevel class="level rule-editor" mobile-view>
    <matchSummup slot="left"
      :exclude="exclude"
      :is-regex="isRegex"
      :match-pattern="matchPattern"
      :match-options="matchOptions"
    />
    <bulmaButton slot="left"
      rounded
      picto="pen" last
      @click="selectMatchPattern"
    />
    <span class="icon">
      <i class="fas fa-arrow-right"></i>
    </span>
    <bulmaButton slot="right"
      rounded
      picto="pen" last
      @click="selectAction"
    />
    <actionSummup
      :action="rule.action"
      :parameters="rule.parameters"
    />
    <span class="icon is-small has-text-grey-dark" slot="right">
      <span class="fa-stack">
        <i class="fas fa-sort-up fa-stack-2x is-clickable" @click="$emit('move:up')"></i>
        <i class="fas fa-sort-down fa-stack-2x is-clickable" @click="$emit('move:down')"></i>
      </span>
    </span>
    <span class="icon has-text-danger is-small is-clickable" slot="right" @click="$emit('delete')">
      <i class="fas fa-times fa-lg"></i>
    </span>
  </bulmaLevel>
</template>

<script>
import matchSummup from '@/components/ui-toolbox/matchSummup'
import actionSummup from '@/components/ui-toolbox/actionSummup'

export default {
  name: 'ruleEditor',
  components: {
    matchSummup,
    actionSummup
  },
  model: {
    prop: 'rule',
    event: 'update'
  },
  props: {
    rule: {
      type: Object,
      default () { return {} }
    },
    columnList: Array,
    currentColumn: String
  },
  computed: {
    exclude: {
      get () { return this.rule.exclude || false },
      set (value) {
        this.$emit('update', { ...this.rule, exclude: value })
      }
    },
    isRegex: {
      get () { return typeof this.rule.isRegex === 'boolean' ? this.rule.isRegex : true },
      set (value) {
        this.$emit('update', { ...this.rule, isRegex: value })
      }
    },
    matchPattern: {
      get () { return this.rule.matchPattern || '' },
      set (value) {
        this.$emit('update', { ...this.rule, matchPattern: value })
      }
    },
    matchOptions: {
      get () { return this.rule.matchOptions || {} },
      set (value) {
        this.$emit('update', { ...this.rule, matchOptions: value })
      }
    }
  },
  methods: {
    updateMatchPatternLocalData ({ exclude, isRegex, pattern, global, caseSensitive, exactMatch }) {
      this.$emit('update', {
        ...this.rule,
        exclude,
        isRegex,
        matchPattern: pattern,
        matchOptions: {
          global,
          caseSensitive,
          exactMatch
        }
      })
    },
    updateActionLocalData ({ action, parameters }) {
      this.$emit('update', {
        ...this.rule,
        action,
        parameters
      })
    },
    selectMatchPattern () {
      this.$store.commit('MODAL_OPEN', {
        id: 'matchPattern',
        parameters: {
          data: {
            exclude: this.exclude,
            isRegex: this.isRegex,
            pattern: this.matchPattern,
            ...this.matchOptions
          },
          callback: this.updateMatchPatternLocalData
        }
      })
    },
    selectAction () {
      this.$store.commit('MODAL_OPEN', {
        id: 'actionSelector',
        parameters: {
          data: {
            action: this.rule.action || '',
            parameters: this.rule.parameters || {},
            columnList: this.columnList || '',
            currentColumn: this.currentColumn || '',
            matchExcluded: this.exclude
          },
          callback: this.updateActionLocalData
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .rule-editor {
    margin-bottom: .5rem;
  }
</style>
