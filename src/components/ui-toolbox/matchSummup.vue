<template>
  <div class="match-summup" :class="{'pure-sentence-display': isEmpty || !matchOptions.exactMatch}">
    <div v-if="!matchPattern">
      Please select a criteria
    </div>
    <div v-else>
      <span>If the cells</span>
      <span v-if="isEmpty"> are
        <u class="has-text-danger"><span v-if="exclude"> not</span> empty</u>
      </span>
      <span v-else>
        <span v-if="matchOptions.exactMatch" class="icon is-medium" :class="exclude ? 'has-text-danger' : 'has-text-success'">
          <span class="fa-stack fa-xs">
            <i class="far fa-circle fa-stack-2x"></i>
            <i class="fas fa-stack-1x" :class="exclude ? 'fa-not-equal' : 'fa-equals'"></i>
          </span>
        </span>
        <span v-else :class="exclude ? 'has-text-danger' : 'has-text-success'">
          {{exclude ? 'do not' : ''}}
          contain
        </span>
        <span :class="isRegex ? 'regex-display has-text-grey' : 'text-display'">
          <span>{{this.matchPattern}}</span>
          <span v-if="isRegex" class="flags">{{flags}}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { formatFlags } from '@/helpers/matchLogics'

export default {
  name: 'matchSummup',
  props: {
    exclude: Boolean,
    isRegex: Boolean,
    matchPattern: String,
    matchOptions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isEmpty () {
      return this.isRegex && this.matchPattern === '^$'
    },
    flags () {
      return formatFlags(this.matchOptions)
    }
  }
}
</script>

<style lang="scss">
  .match-summup {
    margin-top: -.4rem;
    margin-bottom: 0.4rem;
    &.pure-sentence-display {
      margin-top: .3rem;
    }
    .icon i {
      top: .4rem;
    }
  }

  .text-display {
    &:after, &:before {
      content: "\""
    }
  }
  .regex-display {
    &:before {
      content: "/"
    }
    :not(.flags):after {
      content: "/"
    }
  }
</style>
