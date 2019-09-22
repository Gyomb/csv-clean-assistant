<template>
  <div class="file has-name">
    <label :for="fieldId" class="file-label">
      <input type="file" class="file-input"
        :id="fieldId" :name="fieldId"
        :webkitdirectory="isFolder"
        :multiple="isMultiple"
        :accept="accept"
        @change="fileSelected"
      >
      <span class="file-cta is-primary">
        <span class="file-icon">
          <i :class="faPicto"></i>
        </span>
        <span :v-if="label" class="file-label">
          {{label}}
        </span>
      </span>
      <span class="file-name">
        {{filenameDisplay}}
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'bulmaFileSelect',
  model: {
    prop: 'fileData',
    event: 'select'
  },
  props: {
    fileData: {
      type: [Object],
      default () { return { displayValue: '', files: [] } },
      validator (value) {
        if (typeof value.displayValue !== 'string' && !Array.isArray(value.displayValue)) return false
        if (!Array.isArray(value.files)) return false
        return true
      }
    },
    fieldId: String,
    picto: {
      String,
      default: 'search'
    },
    label: { default: '' },
    placeholder: {
      type: [String, Boolean],
      default: false
    },
    display: {
      type: String,
      default: 'name',
      validator (value) {
        return value === 'name' || value === 'path'
      }
    },
    selectType: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    }
  },
  computed: {
    faPicto () {
      return 'fas fa-' + this.picto
    },
    filenameDisplay () {
      if (this.fileData.displayValue) {
        let folderEndString = ''
        if (this.isFolder) { // NOTE: folder input don't allow multiple selection (no need to check for Arrays)
          folderEndString = this.fileData.displayValue.includes('\\') ? `\\` : '/' // use 'slash' as folder ending, except on windows, if the fullpath was provided
        }
        if (Array.isArray(this.fileData.displayValue)) return this.fileData.displayValue.join(folderEndString + ', ') + folderEndString
        return this.fileData.displayValue + folderEndString
      } else if (this.placeholder) {
        return this.placeholder
      } else if (this.placeholder === '') {
        return this.isFolder ? 'Select a folder...' : 'Select a file...'
      } else {
        return ''
      }
    },
    isFolder () {
      return /folder|directory/.test(this.selectType)
    },
    isMultiple () {
      return /multiple/.test(this.selectType)
    }
  },
  methods: {
    fileSelected (e) {
      let displayValue = Array.from(e.target.files).map(file => file[this.display])
      let files = e.target.files
      if (!this.isMultiple) {
        displayValue = displayValue[0]
        files = [e.target.files[0]]
      }
      this.$emit('select', { displayValue, files })
    }
  }
}
</script>
