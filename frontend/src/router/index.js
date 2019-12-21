import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home.vue'
import About from '@/views/about.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router
