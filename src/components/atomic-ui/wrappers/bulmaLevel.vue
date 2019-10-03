<script>

export default {
  name: 'bulmaLevel',
  props: {
    mobileView: Boolean,
    isCentered: Boolean
  },
  computed: {
    rootClasses () {
      let classes = ['level']
      if (this.mobileView) classes.push('is-mobile')
      return classes.join(' ')
    },
    itemClasses () {
      let classes = ['level-item']
      if (this.isCentered) classes.push('has-text-centered')
      return classes.join(' ')
    }
  },
  render (h) {
    const wrapItems = (slot) => {
      if (Array.isArray(slot)) {
        return slot.map(vNode => h('div', { class: this.itemClasses }, [vNode]))
      }
      return []
    }
    const leftItem = wrapItems(this.$slots.left)
    const defaultItem = wrapItems(this.$slots.default)
    const rightItem = wrapItems(this.$slots.right)

    const leftPart = leftItem.length > 0 ? <div class="level-left">{leftItem}</div> : ''
    const rightPart = rightItem.length > 0 ? <div class="level-right">{rightItem}</div> : ''

    const template =
      <div class={this.rootClasses}>
        { leftPart }
        { defaultItem }
        { rightPart }
      </div>

    return template
  }
}
</script>
