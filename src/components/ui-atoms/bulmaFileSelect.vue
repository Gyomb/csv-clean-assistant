<template>
  <div class="file has-name">
    <label :for="fieldId" class="file-label">
      <input type="file" name="resume" :id="fieldId" class="file-input">
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
      type: String,
      default: 'Select a folder...'
    }
  },
  computed: {
    faPicto () {
      return 'fas fa-' + this.picto
    },
    filenameDisplay () {
      return this.filename ? this.filename : this.placeholder
    }
  }
}
</script>
