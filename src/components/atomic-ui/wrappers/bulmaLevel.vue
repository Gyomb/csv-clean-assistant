<script>

export default {
  name: 'bulmaLevel',
  props: {
    mobileView: Boolean
  },
  computed: {
    rootClasses () {
      let classes = ['level']
      if (this.mobileView) classes.push('is-mobile')
      return classes.join(' ')
    }
  },
  render (h) {
    function wrapItems (slot) {
      if (Array.isArray(slot)) {
        return slot.map(vNode => h('div', { class: 'level-item' }, [vNode]))
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
