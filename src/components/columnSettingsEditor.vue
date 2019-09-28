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
      <h4 class="subtitle">Applied Rules</h4>
      <!-- pattern list -->
        <!-- regex => action widget -->
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
export default {
  name: 'columnSettingsEditor',
  data () {
    return {
      columnModalIsActive: false,
      columnIsHeading: false,
      columnPosition: this.position || 0
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
    saveColumnSettings () {
      // This methods saves the column settings but without applying the defined rules
      this.$emit('save', {
        position: this.columnPosition,
        isHeading: this.columnIsHeading
      })
      this.closeModal()
    },
    saveAndApplyRules () {
      // Add dispatch to save and apply rules
      this.closeModal()
    },
    resetLocalData () {
      this.columnIsHeading = typeof this.settings.isHeading === 'boolean' ? this.settings.isHeading : false
      this.columnPosition = this.position || 0
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
