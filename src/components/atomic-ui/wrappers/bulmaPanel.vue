<script>
export default {
  name: 'bulmaPanel',
  data () {
    return {
      activeTab: ''
    }
  },
  props: {
    heading: String,
    tabs: {
      type: Array,
      default () {
        return []
      },
      validator (arr) {
        return arr.every(entry => typeof entry === 'string')
      }
    }
  },
  computed: {
    activeTabIndex () {
      const activeTabIndex = this.tabs.indexOf(this.activeTab)
      return activeTabIndex >= 0 ? activeTabIndex : 0
    }
  },
  methods: {
    setActiveTab (tabName) {
      if (this.tabs.includes(tabName)) {
        this.activeTab = tabName
      } else {
        this.activeTab = this.tabs[0]
      }
    }
  },
  render (h) {
    const panelHeading = this.heading ? <div class="panel-heading">{this.heading}</div> : ''
    let tabs = [...this.tabs]
    let slots = [...this.$slots.default]
    if (tabs.length > slots.length) tabs.splice(slots.length - 1)
    if (slots.length > tabs.length) slots.splice(tabs.length - 1)
    const panelTabs = tabs.length
      ? <div class="panel-tabs">
        {tabs.map(tab => {
          return <a class={{ 'is-active': this.activeTab === tab }} onClick={() => this.setActiveTab(tab)}>{tab}</a>
        })}
      </div>
      : ''
    const panelTabContent = slots[this.activeTabIndex] || h('span')
    const isTabContainer = panelTabContent.tag === 'tab-container'
    const panelBlockWrapper = (element) => <div class="panel-block">{element}</div>
    const panelTabContentWrapped = isTabContainer
      ? panelTabContent.children.map(el => panelBlockWrapper(el))
      : panelBlockWrapper(slots[this.activeTabIndex])
    const template =
    <div class="panel">
      {panelHeading}
      {panelTabs}
      {panelTabContentWrapped}
    </div>
    return template
  }
}
</script>
