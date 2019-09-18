<script>
export default {
  name: 'bulmaField',
  props: {
    isStacked: {
      type: Boolean,
      default: false
    }
  },
  render (h) {
    const controls = this.$slots.default.map(vNode => {
      return h('p', { class: 'control' }, [vNode])
    })
    return h(
      'div',
      {
        class: [ 'field', { 'is-grouped': !this.isStacked } ]
      },
      controls
    )
  }
}
</script>
