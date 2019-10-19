<template>
  <div id="app">
    <div id="nav" class="navbar is-spaced is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-item">
            <div class="buttons">
              <button class="button is-rounded is-black is-inverse" :disabled="isHome" @click="goHome">
                <span class="icon">
                  <i class="fas fa-home"></i>
                </span>
              </button>
            </div>
          </div>
          <div class="navbar-item">
            <h1 class="title">CSV Clean Assistant</h1>
          </div>
          <a role="button" class="navbar-burger" aria-label="menu"
            v-if="isDryrunReport"
            :class="{'is-active': menuShown}"
            :aria-expanded="menuShown.toString()"
            @click="toggleMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="{'is-active': menuShown}">
          <div class="navbar-start">
          </div>
          <div class="navbar-end" v-if="isDryrunReport">
            <div class="navbar-item is-pulled-right">
                <bulmaField is-grouped>
                  <bulmaButton purpose="success"
                    picto="file-import" label="Apply"
                    @click="applyModifications"
                  />
                  <bulmaButton
                    picto="ban" label="Cancel"
                    @click="cancelModifications"
                  />
                </bulmaField>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="section view-content">
      <div class="container">
        <router-view/>
      </div>
    </section>
    <loadingSpinner />
  </div>
</template>

<script>
import loadingSpinner from '@/components/commonModals/loadingSpinner.vue'

export default {
  name: 'app',
  components: {
    loadingSpinner
  },
  data () {
    return {
      menuShown: false
    }
  },
  computed: {
    fileUid () {
      return this.$store.state.userSettings.openedFile
    },
    isHome () {
      return this.$route.name === 'home'
    },
    isDryrunReport () {
      return this.$route.path === '/csv-dryrun-report'
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    applyModifications () {
      this.menuShown = false
      this.$store.dispatch('PROMOTE_DRYRUN', this.fileUid)
        .then(this.$router.push({ name: 'csv-display', params: { alreadyOpen: true } }))
    },
    cancelModifications () {
      this.menuShown = false
      this.$router.push({ name: 'csv-display', params: { alreadyOpen: true } })
    },
    toggleMenu () {
      this.menuShown = !this.menuShown
    }

  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
