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
    const formattedSlots = [[]]
    let slotIndex = 0
    let fieldLabelCount = 0

    const nodeContainsSomeClasses = (node, classes) => {
      const nodeClasses = [node.data.class, node.data.staticClass].join(' ')
      if (!Array.isArray(classes)) return console.error('classes is not an Array :', classes)
      if (nodeClasses) return classes.some(className => nodeClasses.includes(className))
      return false
    }

    const formatLabels = (vNode) => {
      if (vNode.data && !nodeContainsSomeClasses(vNode, ['radio', 'checkbox'])) {
        if (!nodeContainsSomeClasses(vNode, ['label'])) {
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
      return vNode
    }

    const addField = (vNode, additionalClasses) => {
      const addition = additionalClasses ? ' ' + additionalClasses : ''
      return h('div', { class: 'field' + addition }, [vNode])
    }

    const addControl = vNode => {
      return h('p', { class: 'control' }, [vNode])
    }

    const formatInput = input => {
      return addField(addControl(input))
    }

    const concatNextInputs = (nodeIndex, slots) => {
      let fieldBodyClass = ''
      if (this.isGrouped) fieldBodyClass = 'is-grouped'
      if (this.hasAddons) fieldBodyClass = 'has-addons'

      const nextSlots = slots.slice(nodeIndex)

      const concatenatedInput = []
      let nextIndex = 0
      let encounteredLabel = false
      while (nextIndex < nextSlots.length && !encounteredLabel) {
        if (nextSlots.hasOwnProperty(nextIndex)) {
          const input = nextSlots[nextIndex]
          if (
            input.data.attrs &&
            typeof input.data.attrs['field-label'] !== 'undefined'
          ) {
            encounteredLabel = true
            slotIndex--
          } else {
            concatenatedInput.push(input)
            slots.splice(nodeIndex, 1)
          }
        }
        nextIndex++
      }

      const formattedInputs = fieldBodyClass === ''
        ? concatenatedInput.map(vNode => formatInput(vNode))
        : [addField(concatenatedInput.map(vNode => addControl(vNode)), fieldBodyClass)]

      return h('div', { class: 'field-body' }, formattedInputs)
    }

    while (slotIndex < this.$slots.default.length) {
      if (this.$slots.default.hasOwnProperty(slotIndex)) {
        const vNode = this.$slots.default[slotIndex]
        if (vNode.tag === 'label' && !nodeContainsSomeClasses(vNode, ['radio', 'checkbox'])) {
          if (
            this.isHorizontal &&
            vNode.data.attrs &&
            typeof vNode.data.attrs['field-label'] !== 'undefined'
          ) {
            fieldLabelCount++
            formattedSlots.push([
              <div class="field-label is-normal">
                {formatLabels(vNode)}
              </div>
            ])
          } else {
            formattedSlots[fieldLabelCount].push(formatLabels(vNode))
          }
        } else {
          if (this.isHorizontal) {
            formattedSlots[fieldLabelCount].push(concatNextInputs(slotIndex, this.$slots.default))
          } else {
            formattedSlots[fieldLabelCount].push(addControl(vNode))
          }
        }
      }
      slotIndex++
    }

    if (formattedSlots.length < 2) {
      return h(
        'div',
        {
          class: [ 'field', rootNodeClass() ]
        },
        [
          formattedSlots[0]
        ]
      )
    } else {
      return h('div', {}, [
        formattedSlots.map(groupedSlots => {
          return h(
            'div',
            {
              class: [ 'field', rootNodeClass() ]
            },
            [
              groupedSlots
            ]
          )
        })
      ])
    }
  }

}
</script>
