<template>
  <bulmaModal class="column-settings-editor" :is-active="columnModalIsActive" @close="closeModal">
    <h3 class="title" slot="header">Column "{{columnName}}"</h3>
    <bulmaField isHorizontal>
      <label :for="columnName+'-is-heading'" field-label>
        Heading&nbsp;column
      </label>
      <label class="checkbox">
        <input type="checkbox" v-model="columnIsHeading" :name="columnName+'-is-heading'">
        <span>This column is a heading column</span>
      </label>
    </bulmaField>
    <bulmaField isHorizontal hasAddons>
      <label field-label :for="columnName+'-position'">Column&nbsp;position</label>
      <bulmaButton picto="angle-double-left" @click="columnPosition = 0" rounded />
      <bulmaButton picto="angle-left" @click="columnPosition > 0 ? columnPosition-- : 0" />
      <input type="number" :max="positionMax" class="input" :name="columnName+'-position'" v-model.number="columnPosition">
      <bulmaButton picto="angle-right" @click="columnPosition < positionMax ? columnPosition++ : positionMax" />
      <bulmaButton picto="angle-double-right" @click="columnPosition = positionMax" rounded />
    </bulmaField>
    <h4 class="subtitle">Rulesets</h4>
    <!-- presets drawer -->
    <bulmaLevel mobile-view>
      <h4 class="subtitle" slot="left">Column Modifiers</h4>
      <bulmaButton slot="right"
        rounded class="is-small"
        picto="plus"
        purpose="success"
        title="Add a new column modifier"
        @click="rules.push({ isRegex: true })"
      />
    </bulmaLevel>
    <!-- Rules list -->
      <ul>
        <li v-for="(rule, index) in rules" :key="index">
          <rule-editor :rule="rule" :column-list="columnList" :current-column="columnName"
            @update="updateItemInList(rules, index, $event)"
            @move:up="moveItemInList(rules, index, -1)"
            @move:down="moveItemInList(rules, index, +1)"
            @delete="deleteItemInList(rules, index)"
          />
        </li>
      </ul>
    <bulmaLevel mobile-view>
      <h4 class="subtitle" slot="left">Highlights</h4>
      <bulmaButton slot="right"
        rounded class="is-small"
        picto="plus"
        purpose="success"
        title="Add a new column highlight"
        @click="highlights.push({ isRegex: true })"
      />
    </bulmaLevel>
    <!-- Highlights list -->
      <ul>
        <li v-for="(highlightRule, index) in highlights" :key="index">
          <highlight-editor :rule="highlightRule"
            @update="updateItemInList(highlights, index, $event)"
            @move:up="moveItemInList(highlights, index, -1)"
            @move:down="moveItemInList(highlights, index, +1)"
            @delete="deleteItemInList(highlights, index)"
          />
        </li>
      </ul>
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
</template>

<script>
import { moveInArray } from '@/helpers/arrays.js'
import ruleEditor from '@/components/ui-toolbox/ruleEditor'
import highlightEditor from '@/components/ui-toolbox/highlightEditor'

export default {
  name: 'columnSettingsEditor',
  components: {
    highlightEditor,
    ruleEditor
  },
  data () {
    return {
      columnIsHeading: false,
      columnPosition: this.position || 0,
      highlights: [],
      rules: []
    }
  },
  computed: {
    columnModalIsActive () {
      return this.$store.state.commonModals.columnSettingsEditorOpened || false
    },
    fileUid () {
      return this.$store.state.userSettings.openedFile
    },
    columnList () {
      return this.$store.state.csv.header || []
    },
    columnName () {
      const parameters = this.$store.state.commonModals.columnSettingsEditorParameters || {}
      return parameters.columnName || ''
    },
    position () {
      const positionInColumnList = this.columnList.indexOf(this.columnName)
      return positionInColumnList >= 0 ? positionInColumnList : 0
    },
    positionMax () {
      return this.columnList.length - 1 || false
    },
    settings () {
      return (this.$store.state.files.list[this.fileUid].columns || {})[this.columnName] || {}
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('MODAL_CLOSE', 'columnSettingsEditor')
    },
    updateItemInList (array, index, item) {
      this.$set(array, index, { ...item })
    },
    deleteItemInList (array, index) {
      array.splice(index, 1)
    },
    moveItemInList (array, index, direction) {
      moveInArray(array, index, index + direction)
    },
    saveColumnSettings () {
      // This methods saves the column settings but without applying the defined rules
      const setIsRegex = rule => {
        if (typeof rule.isRegex !== 'boolean') rule.isRegex = true
        return rule
      }
      this.$store.dispatch('SAVE_AND_APPLY_COL_SETTINGS_WO_RULES', {
        uid: this.fileUid,
        heading: this.columnName,
        settings: {
          position: this.columnPosition,
          isHeading: this.columnIsHeading,
          highlights: this.highlights.map(setIsRegex),
          rules: this.rules.map(setIsRegex)
        }
      })
      this.closeModal()
    },
    saveAndApplyRules () {
      this.saveColumnSettings()
      this.$store.dispatch('APPLY_MODIFICATION_RULES', {
        column: this.columnName,
        uid: this.fileUid
      })
        .then(this.$router.push('/csv-dryrun-report'))
    },
    resetLocalData () {
      this.columnIsHeading = typeof this.settings.isHeading === 'boolean' ? this.settings.isHeading : false
      this.columnPosition = this.position
      this.rules = Array.isArray(this.settings.rules) ? [...this.settings.rules] : []
      this.highlights = Array.isArray(this.settings.highlights) ? [...this.settings.highlights] : []
    }
  },
  watch: {
    columnModalIsActive: {
      handler () {
        if (this.columnModalIsActive) this.resetLocalData()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
  .column-settings-editor {
    font-weight: normal;
  }
</style>