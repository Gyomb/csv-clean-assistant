<template>
  <div id="app">
    <div id="nav" class="navbar is-spaced" role="navigation" aria-label="main navigation">
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
        </div>
      </div>
      </div>
    <section class="section view-content">
      <div class="container">
        <router-view/>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    isHome () {
      return this.$route.path === '/'
    }
  },
  methods: {
    goHome () {
      this.$store.commit('SETTINGS_SET_PROP', { prop: 'openedFile', value: false })
      this.$router.push('/')
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
.section.view-content {
  padding-top: 0;
}
</style>
