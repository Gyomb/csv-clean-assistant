<script>
const defaultBoolean = {
  type: Boolean,
  default: false
}

export default {
  name: 'bulmaField',
  props: {
    isGrouped: defaultBoolean,
    hasAddons: defaultBoolean,
    isHorizontal: defaultBoolean
  },
  render (h) {
    const rootNodeClass = () => {
      let classes = []
      if (this.isHorizontal) {
        classes.push('is-horizontal')
      } else if (this.hasAddons) {
        classes.push('has-addons')
      } else if (this.isGrouped) {
        classes.push('is-grouped')
      }
      return classes.join(' ')
    }
    const labels = this.$slots.default.filter(vNode => vNode.tag === 'label').map(vNode => {
      if (vNode.data) {
        if (vNode.data.staticClass && !vNode.data.staticClass.includes('label')) {
          vNode.data.staticClass = [
            'label',
            vNode.data.staticClass
          ].join(' ')
        } else {
          vNode.data = {
            staticClass: 'label'
          }
        }
      }
      if (this.isHorizontal) {
        return h('div', { class: 'field-label is-normal' }, [vNode])
      } else {
        return vNode
      }
    })
    let controls = this.$slots.default.filter(vNode => vNode.tag !== 'label').map(vNode => {
      return h('p', { class: 'control' }, [vNode])
    })
    if (this.isHorizontal) {
      const fieldBodyClass = () => {
        if (this.hasAddons) return 'has-addons'
        if (this.isGrouped) return 'is-grouped'
        return ''
      }
      if (fieldBodyClass === '') {
        controls = h('div', { class: 'field-body' }, [
          controls.map(vNode => h('div', { class: 'field' }, [vNode]))
        ])
      } else {
        controls = h('div', { class: 'field-body' }, [
          h('div', { class: `field ${fieldBodyClass()}` }, controls)
        ])
      }
    }

    return h(
      'div',
      {
        class: [ 'field', rootNodeClass() ]
      },
      [
        ...labels,
        controls
      ]
    )
  }
}
</script>
