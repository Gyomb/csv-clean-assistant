<template>
  <div class="rule-editor">
    <h5 class="rule-sumup" v-if="displaySumup">
      {{rule.title}}
    </h5>
    <div class="rule-details" v-else>
      <button class="button no-button sumup-button"
          @click="selectMatchPattern"
          title="Edit the matching settings for this rule"
      >
        <matchSummup
          :exclude="exclude"
          :is-regex="isRegex"
          :match-pattern="matchPattern"
          :match-options="matchOptions"
        />
        <span class="icon is-small">
          <i class="fas fa-edit"></i>
        </span>
      </button>
      <span class="icon">
        <i class="fas fa-arrow-right"></i>
      </span>
      <button class="button no-button sumup-button"
        @click="selectAction"
      >
        <actionSummup
          :action="rule.action"
          :parameters="rule.parameters"
          title="Edit the action settings for this rule"
        />
        <span class="icon is-small">
          <i class="fas fa-edit"></i>
        </span>
      </button>
    </div>
    <div class="edit-menu-container right">
      <button class="button no-button" @click="toggleEditMenu">
        <span class="icon is-small">
          <i class="fas fa-ellipsis-v"></i>
        </span>
      </button>
      <div class="edit-menu" :class="{'is-active': displayEditMenu}">
        <bulmaButton class="is-fullwidth"
          :label="displaySumup ? 'Show details' : 'Show descr.'"
          :title="displaySumup ? 'Show details' : 'Show summary -description'"
          picto="eye" last
          @click="displayEditMenu = false; displaySumup = !displaySumup"
        />
        <bulmaButton class="is-fullwidth"
          label="Edit rule"
          picto="edit" last
          @click="displayEditMenu = false; openRuleCompleteEditor()"
        />
        <bulmaButton class="is-fullwidth"
          label="Move Up"
          picto="angle-up" last
          @click="closeEditMenuAndEmit('move:up')"
        />
        <bulmaButton class="is-fullwidth"
          label="Move Down"
          picto="angle-down" last
          @click="closeEditMenuAndEmit('move:down')"
        />
        <bulmaButton class="is-fullwidth"
          label="Delete"
          purpose="danger" apply-color-to="picto"
          picto="times" last
          @click="closeEditMenuAndEmit('delete')"
        />
      </div>
    </div>
  </div>
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
  data: () => ({
    displaySumup: false,
    displayEditMenu: false
  }),
  props: {
    rule: {
      type: Object,
      default () { return {} }
    },
    columnList: Array,
    currentColumn: String,
    defaultDisplay: {
      type: String,
      default: 'sumup'
    },
    forceCloseEditMenu: Boolean
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
    updateAllLocalData (value) {
      this.$emit('update', {
        ...this.rule,
        ...value
      })
    },
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
    },
    openRuleCompleteEditor () {
      this.$store.commit('MODAL_OPEN', {
        id: 'ruleCompleteEditor',
        parameters: {
          callback: this.updateAllLocalData,
          data: {
            rule: { ...this.rule },
            columnList: [...this.columnList]
          }
        }
      })
    },
    toggleEditMenu () {
      this.displayEditMenu = !this.displayEditMenu
      if (this.displayEditMenu) this.$emit('openmenu')
    },
    closeEditMenuAndEmit (eventName) {
      this.displayEditMenu = false
      this.$emit(eventName)
    }
  },
  watch: {
    forceCloseEditMenu (forceClose) {
      if (forceClose && this.displayEditMenu) {
        this.displayEditMenu = false
      }
    },
    defaultDisplay: {
      handler (newDisplay, oldDisplay) {
        if (newDisplay !== oldDisplay) {
          switch (newDisplay) {
            case 'sumup': this.displaySumup = true
              break
            case 'details':
            default: this.displaySumup = false
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .rule-editor {
    margin-bottom: .5rem;
    &, .rule-details {
      > .icon, > .center {
        justify-self: center;
      }
      > .right {
        justify-self: right;
      }
    }
    button.button.sumup-button {
      justify-content: space-between;
      white-space: normal;
      height: 100%;
    }
    .rule-sumup {
      grid-column: 2 / -2
    }
    .edit-menu-container {
      position: relative;
    }
    .edit-menu {
      position: absolute;
      display: none;
      top: 50%; right: 1em;
      transform: translateY(-50%);
      z-index: 999;
      background: #fff;
      &.is-active {
        display: block;
      }
      button {
        justify-content: space-between;
      }
      .button:not(:last-child):not(:only-child) {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }
      .button + .button {
        border-top: none;
        border-top-right-radius: 0;
        border-top-left-radius: 0;
      }
    }
  }
</style>
