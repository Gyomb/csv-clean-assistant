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
    switchEditMode () { this.editMode = !this.editMode }
  },
  render (h) {
    const Cell = this.cellType
    const displayTemplate =
      <button class="button is-text" onClick={this.switchEditMode}>
        { this.cellValue }
      </button>
    const editTemplate =
      <input class="input" type="text" vModel={this.cellInternalValue} onChange={this.switchEditMode} onBlur={this.switchEditMode}/>
    const template =
    <Cell>
      { this.editMode ? editTemplate : displayTemplate }
    </Cell>

    return template
  }
}
</script>
