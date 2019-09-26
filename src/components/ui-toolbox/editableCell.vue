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
            this.editMode = true
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
    <Cell>
      <bulmaField hasAddons>
        <input type="text" ref="input"
          class={`input ${this.editMode ? '' : 'borderonhover is-static'}`}
          isreadonly={!this.editMode}
          vModel_lazy={this.cellInternalValue}
          onBlur={this.deactivateEditModeIfInputLeft}
          onClick={this.activateEditMode}
          onKeyup={this.keyupActions}
        />
        <button class={`button ${this.editMode ? '' : 'revealonhover'}`} ref="button"
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
  th .input {
    font-weight: bold;
  }
  .revealonhover {
    opacity: 0;
    transition: opacity .2s;
  }
  .field:hover {
    .revealonhover {
        opacity: 1;
    }
    .borderonhover {
      cursor: pointer;
      border: #dbdbdb solid 1px;
      padding: 5px 9px;
    }
  }
</style>
