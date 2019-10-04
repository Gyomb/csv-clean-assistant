<template>
  <bulmaField has-addons>
      <bulmaButton
        label="Select a color"
        @click="displayParameters = !displayParameters"
      />
      <bulmaModal is-small no-overlay
        :is-active="displayParameters"
        @close="displayParameters = false"
      >
        <h4 class="title is-4" slot="header">Select a color</h4>
        <swatchSelect
          :options="highlightOptions"
          :value="selectedHighlight"
          @input="updateColorAndCloseModal($event)"
        />
      </bulmaModal>
      <div class="button is-static" :class="'has-background-'+selectedHighlight">
        <span class="icon">
          <i class="fas fa-empty"></i>
        </span>
      </div>
    </bulmaField>
</template>

<script>

const highlightOptions = [
  'primary',
  'info',
  'link',
  'success',
  'warning',
  'danger'
]

export default {
  name: 'highlightSelector',
  model: {
    prop: 'highlight',
    event: 'update'
  },
  data () {
    return {
      displayParameters: false,
      highlightOptions
    }
  },
  props: {
    highlight: {
      type: String,
      default: 'primary',
      validator (value) {
        return highlightOptions.includes(value)
      }
    }
  },
  computed: {
    selectedHighlight: {
      get () { return this.highlight },
      set (value) {
        this.$emit('update', value)
      }
    }
  },
  methods: {
    updateColorAndCloseModal (value) {
      this.$emit('update', value)
      this.displayParameters = false
    }
  }
}
</script>
