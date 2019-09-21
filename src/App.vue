<template>
  <div id="app">
    <nav uk-navbar uk-sticky :class="navbarClasses">
      <div class="uk-navbar-left uk-container">
        <ul class="uk-navbar-nav">
          <li class="uk-active"><a href="javascript:void(0)">{{ $store.state.appName }}</a></li>
        </ul>
      </div>
    </nav>
    <div class="uk-section">
      <div class="uk-container">
        <Home />
      </div>
    </div>
  </div>
</template>

<script>
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';
import Home from './components/Home.vue';

export default {
  name: 'app',
  components: {
    Home
  },
  data () {
    return {
      navbarClasses: [
        'uk-navbar-container',
        'uk-background-primary',
        'uk-navbar-transparent',
        'uk-light'
      ]
    }
  }
}
</script>

<style>
  #app > .uk-navbar-container .uk-navbar-nav > li > a {
    min-height: 60px;
  }
</style>