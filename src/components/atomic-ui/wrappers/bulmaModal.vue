<template>
  <div class="modal" :class="{'is-active': isActive}">
    <div class="modal-background" @click="close()"></div>
    <div :class="isCard ? 'modal-card' : 'modal-content'">
      <template v-if="isCard">
        <header class="modal-card-head">
          <div class="modal-card-title" v-if="hasHeader">
            <slot name="header"></slot>
          </div>
          <button class="delete" aria-label="close" @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot" v-if="hasFooter">
          <slot name="footer"></slot>
        </footer>
      </template>
      <div v-else :class="{box: !noBox}">
        <slot></slot>
      </div>
    </div>
    <button v-if="!isCard" class="modal-close is-large" aria-label="close" @click="close()"></button>
  </div>
</template>

<script>
export default {
  name: 'bulmaModal',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    noBox: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasHeader () {
      return !!this.$slots.header
    },
    hasFooter () {
      return !!this.$slots.footer
    },
    isCard () {
      return this.hasHeader || this.hasHeader
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  .modal-background {
    cursor: pointer;
  }
</style>
