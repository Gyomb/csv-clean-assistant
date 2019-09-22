<script>
const superOption = {
  name: 'superOption',
  props: {
    label: String,
    value: String,
    selected: Boolean
  },
  methods: {
    activateSelect () {
      this.$emit('change', this.value)
    }
  },
  render (h) {
    const addActivateSelect = vNode => {
      vNode.data.on = {
        ...vNode.data.on,
        'change': this.activateSelect
      }
      return vNode
    }
    function lookForAndChange (vNode, tag, operation) {
      if (tag.includes(vNode.tag)) vNode = operation(vNode)
      if (vNode.children) vNode.children.forEach(child => lookForAndChange(child, tag, operation))
      return vNode
    }
    const updatedSlots = this.$slots.default ? this.$slots.default.map(vNode => {
      return lookForAndChange(vNode, ['input', 'button'], addActivateSelect)
    }) : ''
    const template =
    <div class={`box super-option ${this.selected ? 'is-selected' : ''}`}
      onClick={this.activateSelect}
    >
      <div class="field is-grouped super-option-label">
        <div class="control">
          <button class="button is-rounded is-outlined">
            <span class="icon">
              <i class={this.selected ? 'fas fa-check-circle' : 'far fa-circle'} />
            </span>
            <span>{this.label}</span>
          </button>
        </div>
      </div>
      { updatedSlots }
    </div>

    return template
  }
}

export default {
  name: 'superRadioButtons',
  components: {
    superOption
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => [
        { label: 'Option 1', value: 'one' },
        { label: 'Option 2', value: 'two' },
        { label: 'Option 3', value: 'three' }
      ],
      validator (values) {
        for (const value of values) {
          switch (typeof value) {
            case 'string': break
            case 'object':
              if (typeof value.value === 'undefined') return false
              break
            default: return false
          }
        }
        return true
      }
    }
  },
  methods: {
    registerOption (value) {
      this.$emit('input', value)
    }
  },
  render (h) {
    const initialOptionValueList = this.options.map(option => option.value)
    const consolidatedOptions = this.options.map(option => {
      let validOption = ''
      switch (typeof option) {
        case 'string':
          validOption = { label: option, value: option }
          break
        case 'object':
          validOption = { ...option } // shallow copy of the props to avoid editing it while consolidating
          if (typeof option.label === 'undefined') option.label = option
          break
      }
      return validOption
    })
    for (const slot in this.$slots) {
      if (!initialOptionValueList.includes(slot)) consolidatedOptions.push({ label: slot, value: slot })
    }
    const template =
      <div class="super-radio-button">
        {
          consolidatedOptions.map(option => {
            const superOption =
              <super-option label={option.label} value={option.value} selected={this.value === option.value} onChange={this.registerOption}>
                {this.$slots[option.value]}
              </super-option>
            return superOption
          })
        }
      </div>
    return template
  }
}
</script>

<style lang="scss">
  $background-color: white;
$link-color: #3273dc;
$deselected-color: #4a4a4a;
.super-radio-button {
  cursor: pointer;
  .super-option {
    &.is-selected {
      box-shadow: 0 2px 3px rgba(50,115,220,.1), 0 0 0 1px rgba(50,115,220,.75);
      .super-option-label {
        .button.is-outlined {
          border-color: $link-color;
          color: $link-color;
        }
      }
      &:hover {
        box-shadow: 0 2px 3px rgba(#4a4a4a, .1), 0 0 0 1px #4a4a4a;
        .super-option-label {
        .button.is-outlined {
          border-color: $deselected-color;
          color: $deselected-color;
        }
      }
      }
    }
    .super-option-label {
      margin-top: -2.4rem;
    }
    .button.is-outlined {
      background-color: $background-color;
    }
  }
}
</style>
