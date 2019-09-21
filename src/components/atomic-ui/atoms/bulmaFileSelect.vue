<template>
  <div class="file has-name">
    <label :for="fieldId" class="file-label">
      <input type="file" class="file-input"
        :id="fieldId" :name="fieldId"
        :webkitdirectory="isFolder"
        :multiple="isMultiple"
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
  props: {
    value: {
      type: [String, Array],
      default: ''
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
    }
  },
  computed: {
    faPicto () {
      return 'fas fa-' + this.picto
    },
    filenameDisplay () {
      if (this.value) {
        let folderEndString = ''
        if (this.isFolder) {
          folderEndString = this.value.includes('\\') ? `\\` : '/' // use 'slash' as folder ending, except on windows, if the fullpath was provided
        }
        console.log(folderEndString)
        if (Array.isArray(this.value)) return this.value.join(folderEndString + ', ') + folderEndString
        return this.value + folderEndString
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
      let value = Array.from(e.target.files).map(file => file[this.display])
      let files = e.target.files
      if (!this.isMultiple) {
        value = value[0]
        files = [e.target.files[0]]
      }
      this.$emit('select', { value, files })
    }
  }
}
</script>
