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
  data () {
    return {
      filename: ''
    }
  },
  props: {
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
      if (this.filename) {
        return this.filename
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
      if (this.isMultiple) {
        this.filename = Array.from(e.target.files).map(file => file.name).join(', ')
      } else {
        this.filename = e.target.files[0].name
      }
      this.$emit('file-selected', e.target.files)
    }
  }
}
</script>
