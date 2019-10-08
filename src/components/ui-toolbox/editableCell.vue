<script>
export default {
  name: 'editableCell',
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
    cellValue: String
  },
  computed: {
    cellInternalValue: {
      get () {
        return this.cellValue
      },
      set (value) {
        this.$emit('update', value)
      }

    }
  },
  methods: {
    activateEditMode () {
      this.editMode = true
      this.$refs.input.focus()
    },
    deactivateEditMode () {
      this.editMode = false
    },
    switchEditMode () {
      this.editMode = !this.editMode
      if (this.editMode) this.$refs.input.focus()
    },
    deactivateEditModeIfInputLeft ({ relatedTarget }) {
      switch (relatedTarget) {
        case this.$refs.input:
        case this.$refs.button: break
        default: this.editMode = false
      }
    },
    keyupActions (event) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault()
          if (!this.editMode) {
            this.activateEditMode()
          } else {
            this.editMode = false
            this.$emit('update', this.cellInternalValue)
          }
      }
    }
  },
  render (h) {
    const Cell = this.cellType
    const template =
    <Cell class="editable-cell">
      <span tabindex="0" role="button"
        class={['input-like', { 'is-hidden': this.editMode }]}
        onClick={this.activateEditMode}
        onKeyup={this.keyupActions}
      >{this.cellInternalValue}</span>
      <bulmaField hasAddons class={{ 'is-hidden': !this.editMode }}>
        <input type="text" ref="input"
          class="input"
          isreadonly={!this.editMode}
          vModel_lazy={this.cellInternalValue}
          onBlur={this.deactivateEditModeIfInputLeft}
          onKeyup={this.keyupActions}
        />
        <button class="button" ref="button"
          onClick={this.switchEditMode}
          onBlur={this.deactivateEditModeIfInputLeft}
        >
          <span class="icon">
            <i class={`fas fa-${this.editMode ? 'check has-text-success' : 'pen'}`} />
          </span>
        </button>
      </bulmaField>
    </Cell>

    return template
  }
}
</script>

<style lang="scss">

  th.editable-cell .input {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  .editable-cell {
    $radius : 4px;
    $border : 1px;
    $padding-lateral: 9px;

    cursor: pointer;

    .field {
      margin-left: -$padding-lateral;
    }

    .input-like {
      position: relative;
      display: inline-block;
      padding: 5px $padding-lateral;
      margin-left: -$padding-lateral;
      min-width: 4 * 1rem;
      min-height: 2 * 1rem;
      border: solid $border transparent;
      border-radius: $radius;
      &:hover, &:focus {
        border-color: #dbdbdb;
        background-color: #fff;
        &:after {
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
