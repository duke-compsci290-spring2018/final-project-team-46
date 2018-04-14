import Vue from 'vue'
import App from './App.vue'
import { TRAIL_KEY } from './secrets.js';

new Vue({
  el: '#app',
  render: h => h(App)
})
