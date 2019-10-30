import Vue from 'vue';
import AppComponent from './components/App.vue';
import store from './store/store'

window.$ = window.jQuery = require('jquery')
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap");
require("./assets/glyphicons/html_css/css/glyphicons.css");
require("./assets/glyphicons/html_css/css/glyphicons.css");

new Vue({
  store,
  render: h => h(AppComponent)
}).$mount('#app')
