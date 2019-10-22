<template>
  <bulmaModal is-small :is-active="matchPatternIsActive" @close="closeModal">
    <h2 class="title is-4" slot="header">Define to what cell you want to&hellip;</h2>
    <swapButtons
      :buttons="[
        {value: false, label: 'apply the rule', purpose: 'success'},
        {value: true, label: 'NOT apply the rule', purpose: 'danger'}
      ]"
      v-model="exclude"
    />
    <superRadioButtons v-model="inputType"
      :options="[
        {label: 'Empty cells', value: 'isempty'},
        {label: 'One word or a sentence', value: 'string'},
        {label: 'Advanced: Use a regular expression', value: 'regex'}
      ]"
    >
      <p slot="isempty">
        This rule will apply to any {{exclude ? 'non-' : ''}}empty cell
      </p>
      <template slot="string">
        <p>This rule will apply to any cells {{exclude ? 'not' : ''}} containing:</p>
        <bulmaField>
          <input type="text" class="input" v-model="stringPattern" placeholder="this word">
        </bulmaField>
      </template>
      <div slot="regex">
        <p>This rule will apply to any cells {{exclude ? 'not' : ''}} matching:</p>
        <regexInput
          placeholder="this regular expression"
          v-model="regexPattern"
        />
      </div>
    </superRadioButtons>
    <div class="container" slot="footer">
      <bulmaLevel mobile-view>
        <bulma-button slot="left" picto="check" purpose="success" label="Validate modifications" @click="saveModifications" />
        <bulma-button slot="right" picto="times" label="Cancel" @click="closeModal"/>
      </bulmaLevel>
    </div>
  </bulmaModal>
</template>

<script>
import superRadioButtons from '@/components/ui-toolbox/superRadioButtons'

export default {
  name: 'matchPattern',
  components: {
    superRadioButtons
  },
  data () {
    return {
      exclude: false,
      inputType: 'regex',
      stringPattern: '',
      regexPattern: {
        global: true
      }
    }
  },
  computed: {
    matchPatternIsActive () {
      return this.$store.state.commonModals.matchPatternOpened || false
    },
    fileUid () {
      return this.$store.state.userSettings.openedFile
    },
    matchPatternParameters () {
      return this.$store.state.commonModals.matchPatternParameters || {}
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'matchPattern')
    },
    saveModifications () {
      this.closeModal()
      this.updateMatchPatternData()
    },
    updateMatchPatternData () {
      let isRegex
      let stringPattern = {}
      let { regexPattern, exclude } = this
      switch (this.inputType) {
        case 'string': isRegex = false
          stringPattern.pattern = this.stringPattern
          break
        case 'isempty':
          regexPattern = {
            pattern: '^$'
          }
          // eslint-disable-next-line no-fallthrough
        case 'regex':
        default: isRegex = true
      }
      this.matchPatternParameters.callback({ ...regexPattern, ...stringPattern, isRegex, exclude })
    },
    resetRegexPattern () {
      this.$set(this, 'regexPattern', { global: true })
    }
  },
  watch: {
    matchPatternIsActive: {
      handler () {
        if (this.matchPatternIsActive) {
          const { exclude, isRegex, pattern, global, caseSensitive } = this.matchPatternParameters.data
          this.exclude = exclude
          if (isRegex || typeof isRegex !== 'boolean') {
            switch (pattern) {
              case '^$':
                this.inputType = 'isempty'
                this.resetRegexPattern()
                break
              default:
                this.inputType = 'regex'
                this.$set(this, 'regexPattern', {
                  pattern,
                  global: typeof global === 'undefined' ? true : global,
                  caseSensitive
                })
            }
            this.stringPattern = ''
          } else {
            this.inputType = 'string'
            this.stringPattern = pattern
            this.resetRegexPattern()
          }

          // let patternFrom = this.ruleParameters
          // if (this.matchPatternParameters.matchPurpose === 'replace') {
          //   patternFrom = this.ruleParameters
          // }
          // inputType
          // regexPattern
          //   get () {
          //     return {
          //       pattern: this..pattern || '',
          //       global: typeof this..global === 'undefined' ? true : this..global,
          //       caseSensitive: this..caseSensitive || false
          //     }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
</style>
