<script>
const defaultBoolean = {
  type: Boolean,
  default: false
}

export default {
  name: 'bulmaField',
  props: {
    isGrouped: defaultBoolean,
    hasAddons: defaultBoolean
  },
  render (h) {
    const rootNodeClass = () => {
      if (this.hasAddons) return 'has-addons'
      if (this.isGrouped) return 'is-grouped'
    }
    const controls = this.$slots.default.map(vNode => {
      if (vNode.tag === 'label') {
        if (vNode.data) {
          vNode.data.staticClass = [
            'label',
            vNode.data.staticClass || ''
          ].join(' ')
        } else {
          vNode.data = {
            staticClass: 'label'
          }
        }
        return vNode
      } else {
        return h('p', { class: 'control' }, [vNode])
      }
    })

    return h(
      'div',
      {
        class: [ 'field', rootNodeClass() ]
      },
      controls
    )
  }
}
</script>
