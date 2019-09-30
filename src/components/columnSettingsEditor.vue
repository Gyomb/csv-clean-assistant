<template>
  <div>
    <span class="colhead" @click="openModal">
      <span class="colhdead-label">{{label}}</span>
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
    </span>
    <bulmaModal :is-active="columnModalIsActive" @close="closeModal">
      <h3 class="title" slot="header">Column "{{label}}"</h3>
      <bulmaField isHorizontal>
        <label class="checkbox" :for="label+'is-heading'">
          Heading&nbsp;column
        </label>
        <input type="checkbox" v-model="columnIsHeading" :name="label+'is-heading'">
      </bulmaField>
      <bulmaField isHorizontal hasAddons>
        <label :for="label+'-position'">Column&nbsp;position</label>
        <bulmaButton picto="angle-double-left" @click="columnPosition = 0" rounded />
        <bulmaButton picto="angle-left" @click="columnPosition > 0 ? columnPosition-- : 0" />
        <input type="number" :max="positionMax" class="input" :name="label+'-position'" v-model.number="columnPosition">
        <bulmaButton picto="angle-right" @click="columnPosition < positionMax ? columnPosition++ : positionMax" />
        <bulmaButton picto="angle-double-right" @click="columnPosition = positionMax" rounded />
      </bulmaField>
      <h4 class="subtitle">Rulesets</h4>
      <!-- presets drawer -->
      <bulmaLevel mobile-view>
        <h4 class="subtitle" slot="left">Applied Rules</h4>
        <bulmaButton slot="right"
            rounded class="is-small"
            picto="plus"
            purpose="success"
            title="Add a new column rule"
            @click="rules.push({ isRegex: true })"
          />
      </bulmaLevel>
      <!-- pattern list -->
        <ul>
          <li v-for="(rule, index) in rules" :key="index">
            <rule-editor :rule="rule"
              @update="updateRuleInRules(index, $event)"
              @move:up="moveRuleInRules(index, -1)"
              @move:down="moveRuleInRules(index, +1)"
              @delete="deleteRuleInRules(index)"
            />
          </li>
        </ul>
      <!-- add pattern button -->
      <div class="container" slot="footer">
        <bulmaLevel mobile-view>
          <bulmaButton slot="left" purpose="primary" label="Save settings"  @click="saveColumnSettings" />
          <bulmaButton slot="left" purpose="warning" label="Apply rules"  @click="saveAndApplyRules" />
          <bulmaButton slot="right" picto="redo" purpose="danger" apply-color-to="picto" label="Reset" @click="resetLocalData" />
          <bulmaButton slot="right" picto="times" label="Cancel" @click="closeModal" last />
        </bulmaLevel>
      </div>
      <!-- save preset button -->
    </bulmaModal>
  </div>
</template>

<script>
import { moveInArray } from '@/helpers/arrays.js'
import ruleEditor from '@/components/ui-toolbox/ruleEditor'

export default {
  name: 'columnSettingsEditor',
  components: {
    ruleEditor
  },
  data () {
    return {
      columnModalIsActive: false,
      columnIsHeading: false,
      columnPosition: this.position || 0,
      rules: []
    }
  },
  props: {
    label: String,
    position: Number,
    positionMax: {
      type: [Number, Boolean],
      default: false
    },
    settings: {
      type: Object,
      default () { return {} }
    }
  },
  methods: {
    openModal () {
      this.resetLocalData()
      this.columnModalIsActive = true
    },
    closeModal () {
      this.columnModalIsActive = false
    },
    updateRuleInRules (index, rule) {
      this.$set(this.rules, index, { ...rule })
    },
    deleteRuleInRules (index) {
      this.rules.splice(index, 1)
    },
    moveRuleInRules (index, direction) {
      moveInArray(this.rules, index, index + direction)
    },
    saveColumnSettings () {
      // This methods saves the column settings but without applying the defined rules
      this.$emit('save', {
        position: this.columnPosition,
        isHeading: this.columnIsHeading,
        rules: this.rules
      })
      this.closeModal()
    },
    saveAndApplyRules () {
      this.saveColumnSettings()
      // Add dispatch to apply rules
    },
    resetLocalData () {
      this.columnIsHeading = typeof this.settings.isHeading === 'boolean' ? this.settings.isHeading : false
      this.columnPosition = this.position || 0
      this.rules = Array.isArray(this.settings.rules) ? [...this.settings.rules] : []
    }
  },
  mounted () {
    this.resetLocalData()
  }
}
</script>

<style lang="scss">
  @import "bulma/sass/utilities/_all.sass";

  .colhead {
    cursor: pointer;
    &:hover {
      color: $link;
    }
  }
  .colhdead-label {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
</style>
