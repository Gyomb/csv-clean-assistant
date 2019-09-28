<template>
  <div>
    <span class="colhead" @click="columnModalIsActive = true">
      <span class="colhdead-label">{{label}}</span>
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
    </span>
    <bulmaModal :is-active="columnModalIsActive" @close="columnModalIsActive = false">
      <h3 class="title" slot="header">Column "{{label}}"</h3>
      <bulmaField isHorizontal>
        <label class="checkbox" :for="label+'is-heading'">
          Heading&nbsp;column
        </label>
        <input type="checkbox" v-model="columnIsHeading" :name="label+'is-heading'">
      </bulmaField>
      <bulmaField isHorizontal hasAddons>
        <label :for="label+'-position'">Column&nbsp;position</label>
        <bulmaButton picto="angle-double-left" @click="columnPosition = 0"/>
        <bulmaButton picto="angle-left" @click="columnPosition > 0 ? columnPosition-- : 0"/>
        <input type="number" :max="positionMax" class="input" :name="label+'-position'" v-model.number="columnPosition">
        <bulmaButton picto="angle-right" @click="columnPosition < positionMax ? columnPosition++ : positionMax"/>
        <bulmaButton picto="angle-double-right" @click="columnPosition = positionMax"/>
      </bulmaField>
      <h4 class="subtitle">Rulesets</h4>
      <!-- presets drawer -->
      <h4 class="subtitle">Applied Rules</h4>
      <!-- pattern list -->
        <!-- regex => action widget -->
      <!-- add pattern button -->
      <div class="container" slot="footer">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-primary" @click="saveColumnSettings">
                Save column settings
              </button>
              <button class="button is-warning">
                Apply rules
              </button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button" @click="columnModalIsActive = false">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- save preset button -->
    </bulmaModal>
  </div>
</template>

<script>
export default {
  name: 'columnSettings',
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
    saveColumnSettings () {
      // This methods saves the column settings but without applying the defined rules
      this.$emit('save', {
        position: this.columnPosition,
        isHeading: this.columnIsHeading
      })
    }
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
