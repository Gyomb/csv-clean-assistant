<template>
  <div class="modal" :class="modalClasses">
    <div class="modal-background" @click="close()" v-if="!noOverlay"></div>
    <div :class="modalContentClasses">
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
      <div v-else>
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
    isActive: Boolean,
    noBox: Boolean,
    noOverlay: Boolean,
    isSmall: Boolean
  },
  computed: {
    modalClasses () {
      return {
        'is-active': this.isActive
      }
    },
    modalContentClasses () {
      return [
        this.isCard ? 'modal-card' : 'modal-content',
        {
          'box': !this.isCard && !this.noBox,
          'thick-border': !this.noBox && this.noOverlay,
          'is-small': this.isSmall
        }
      ]
    },
    hasHeader () {
      return !!this.$slots.header
    },
    hasFooter () {
      return !!this.$slots.footer
    },
    isCard () {
      return this.hasHeader || this.hasFooter
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
  @import "bulma/sass/utilities/mixins.sass";

  .modal-background {
    cursor: pointer;
  }

  .box.thick-border, .thick-border {
    border-radius: 6px;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.3), 0 0 0 1px rgba(10, 10, 10, 0.3);
  }

  .modal-content, .modal-card {
    &.is-small {
      width: calc(100% - 40px);
      @include tablet {
        width: 480px;
      }
    }
  }
</style>
