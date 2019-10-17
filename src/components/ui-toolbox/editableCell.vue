<script>
export default {
  name: 'editableCell',
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      editMode: false
    }
  },
  props: {
    cellType: {
      type: String,
      default: 'td',
      validator (value) {
        return value === 'td' || value === 'th'
      }
    },
    value: String
  },
  computed: {
  },
  methods: {
    getCellInternalValue () {
      return typeof this.$refs.input === 'object' ? this.$refs.input.innerText || '' : ''
    },
    setCellInternalValue (value) {
      this.$refs.input.innerText = value || ''
    },
    updateExternalValue () {
      this.$emit('update', this.getCellInternalValue())
    },
    resetInternalValue () {
      this.setCellInternalValue(this.value || '')
    },
    activateEditMode () {
      this.editMode = true
      this.$refs.input.focus()
    },
    deactivateEditMode () {
      this.editMode = false
      this.$refs.input.focus()
    },
    deactivateEditModeIfInputLeft ({ srcElement, relatedTarget }) {
      switch (relatedTarget) {
        case this.$refs.input:
        case (this.$refs.buttonValidate || {}).$el:
        case (this.$refs.buttonCancel || {}).$el: break
        default:
          if (this.editMode) this.updateAndClose()
      }
    },
    keydownActions (event) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault()
          if (!this.editMode) {
            this.activateEditMode()
          } else {
            this.updateAndClose()
          }
      }
    },
    resetAndClose () {
      this.resetInternalValue()
      this.deactivateEditMode()
    },
    updateAndClose () {
      this.updateExternalValue()
      this.deactivateEditMode()
    }
  },
  mounted () {
    this.resetInternalValue()
  },
  watch: {
    value () {
      this.resetInternalValue()
    }
  },
  render (h) {
    const Cell = this.cellType
    const template =
    <Cell class="editable-cell">
      <span tabindex="0" role={this.editMode ? 'textbox' : 'button'} ref="input"
        class={['input-like', { 'edit-mode': this.editMode }]}
        onClick={this.activateEditMode}
        onKeydown={this.keydownActions}
        onBlur={this.deactivateEditModeIfInputLeft}
        contenteditable={this.editMode}
      ></span>
      <div class={['buttons', { 'is-hidden': !this.editMode }]}>
        <bulmaButton ref="buttonValidate"
          picto="check" purpose="success" apply-color-to="picto"
          tabindex={this.editMode ? 0 : -1}
          onClick={this.deactivateEditMode}
          onBlur={this.deactivateEditModeIfInputLeft}
        />
        <bulmaButton ref="buttonCancel"
          picto="ban"
          tabindex={this.editMode ? 0 : -1}
          purpose="danger" apply-color-to="picto"
          onClick={this.resetAndClose}
          onBlur={this.deactivateEditModeIfInputLeft}
        />
      </div>
    </Cell>

    return template
  }
}
</script>

<style lang="scss">

  .editable-cell {
    $radius : 4px;
    $border : 1px;
    $padding-lateral: 9px;
    $padding-vertical: 5px;

    cursor: pointer;
    position: relative;

    .buttons {
      position: absolute;
      top: 0;
      left: 100%;
      z-index: 999;
      > .button {
        margin: 0;
        border-bottom-width: 0;
        border-radius: 0;
        &:first-child {
          border-top-right-radius: $radius;
        }
        &:last-child {
          border-bottom-width: 1px;
          border-bottom-right-radius: $radius;
        }
      }
    }

    .input-like {
      position: relative;
      display: inline-block;
      padding: $padding-vertical $padding-lateral;
      margin-left: -$padding-lateral;
      margin-top: -$padding-vertical;
      margin-bottom: -$padding-vertical;
      width: calc(100% + #{2 * $padding-lateral});
      min-width: 4 * 1rem;
      min-height: 2 * 1rem;
      border: solid $border transparent;
      border-radius: $radius;
      &:hover, &:focus, &.edit-mode {
        border-color: #dbdbdb;
        background-color: #fff;
        color: #000;
        &:not(.edit-mode):after {
          content: "\F304";
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          padding: 5px $padding-lateral 0 $padding-lateral;
          height: 100%;
          border-left: solid $border #dbdbdb;
          border-radius: 0 $radius $radius 0;
          background-color: #fff;
        }
      }
    }
  }
</style>
