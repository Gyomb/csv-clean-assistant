<template>
  <bulmaLevel class="level rule-editor" mobile-view>
    <bulmaField slot="left">
      <bulmaButton
        :picto="exclude ? 'not-equal' : 'equals'"
        :purpose="exclude ? 'danger' : 'success'"
        apply-color-to="border"
        :title="exclude ? 'Do not match' : 'Match'"
        @click="exclude = !exclude"
      />
    </bulmaField>
    <bulmaField has-addons slot="left">
      <bulmaButton
        :label="isRegex ? 'Reg' : 'Str'"
        :title="isRegex ? 'Compare to a regular expression' : 'Compare to a character string'"
        @click="isRegex = !isRegex"
      />
      <input type="text" class="input"
        :placeholder="isRegex ? 'Regular Expression' : 'Character string'"
        v-model="matchPattern"
      >
    </bulmaField>
    <span class="icon">
      <i class="fas fa-arrow-right"></i>
    </span>
    <highlightSelector v-model="color" />
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
import highlightSelector from '@/components/ui-toolbox/highlightSelector'

export default {
  name: 'highlightEditor',
  components: {
    highlightSelector
  },
  model: {
    prop: 'rule',
    event: 'update'
  },
  props: {
    rule: {
      type: Object,
      default () { return {} }
    }
  },
  computed: {
    actionAndParameters: {
      get () {
        return {
          action: this.rule.action || 'highlight',
          parameters: this.rule.parameters || {}
        }
      },
      set (value) {
        this.$emit('update', {
          ...this.rule,
          action: value.action,
          parameters: value.parameters
        })
      }
    },
    color: {
      get () { return this.rule.color || 'primary' },
      set (value) {
        this.$emit('update', { ...this.rule, color: value })
      }
    },
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
    }
  }
}
</script>

<style lang="scss">
  .rule-editor {
    margin-bottom: .5rem;
  }
</style>
