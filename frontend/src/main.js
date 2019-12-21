import Vue from 'vue'
import Buefy from 'buefy'
import App from '@/app.vue'
import router from '@/router'

import '@mdi/font/css/materialdesignicons.css'
import 'vue-fluent/dist/vue-fluent.min.css'
import '@/styles/main.css'

Vue.config.productionTip = false
Vue.use(Buefy)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
