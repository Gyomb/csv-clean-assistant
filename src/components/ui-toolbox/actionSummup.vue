<template>
  <div class="action-summup" :class="{'pure-sentence-display': !action}">
    <div v-if="!action">
      Please select an action
    </div>
    <div v-else>
      <span v-if="action === 'delete'">
        <span class="has-text-danger">Delete</span>
        <span class="has-text-danger" v-if="parameters.entireRow"> the <u>entire</u> row</span>
        <span v-else> them</span>
      </span>
      <span v-else-if="action === 'replace'">
        Replace
        <span v-if="!parameters.useMatchPattern">
          <span :class="parameters.isRegex ? 'regex-display has-text-grey' : 'text-display'">
            <span>{{parameters.replacementPattern}}</span>
            <!-- <span v-if="parameters.isRegex" class="flags">{{flags}}</span> -->
          </span>
        </span>
        <span v-else>
          them
        </span>
        by <span class="text-display has-background-warning">{{parameters.replacementString}}</span>
      </span>
      <span v-else-if="action === 'move'">
        Move them to <u class="has-text-info">{{parameters.moveTo}}</u><br>
        <span v-if="parameters.force">even if it is not empty</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'actionSummup',
  props: {
    action: String,
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
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
