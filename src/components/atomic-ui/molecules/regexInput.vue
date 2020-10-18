<template>
  <div class="regex-input">
    <bulmaField has-addons slot="left" :expands="[0]">
      <input type="text" class="input"
        v-model="pattern"
        v-bind="$attrs"
      >
      <buttonToggle
        v-model="multipleMatchState"
        label="/g"
        :title="multipleMatchTitle"
        :on-state="{
          purpose: 'info',
        }"
        :off-state="{
        }"
      />
      <buttonToggle
        v-model="caseSensistiveState"
        label="/i"
        :title="caseSensistiveTitle"
        :on-state="{
        }"
        :off-state="{
          purpose: 'success',
        }"
      />
    </bulmaField>
    <bulmaLevel mobile-view>
      <a href="https://regex101.com/" target="_blank" title="Get help on regex101.com websiste (opens in your default browser)" @click="getHelp($event)" slot="left">
        <span class="icon has-text-info">
          <i class="fas fa-info"></i>
        </span>
      </a>
      <div class="is-size-7" slot="left">
        <p class="help">{{multipleMatchTitle}}</p>
        <p class="help">{{caseSensistiveTitle}}</p>
      </div>
    </bulmaLevel>
  </div>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'regexInput',
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    pattern: {
      get () { return this.value.pattern || '' },
      set (value) { this.updateValue({ pattern: value }) }
    },
    multipleMatchState: {
      get () { return this.value.global || false },
      set (value) { this.updateValue({ global: value }) }
    },
    caseSensistiveState: {
      get () { return this.value.caseSensitive || false },
      set (value) { this.updateValue({ caseSensitive: value }) }
    },
    multipleMatchTitle () {
      return this.multipleMatchState ? `The pattern will match all occurences` : `The pattern will match only the first occurence`
    },
    caseSensistiveTitle () {
      return this.caseSensistiveState ? `The pattern will not ignore the case of the characters` : `The pattern will ignore the case of the characters`
    }
  },
  methods: {
    getHelp (event) {
      event.preventDefault()
      let link = event.currentTarget.href
      shell.openExternal(link)
    },
    updateValue (newValues) {
      this.$emit('input', {
        ...this.value,
        ...newValues
      })
    }
  }
}
</script>
