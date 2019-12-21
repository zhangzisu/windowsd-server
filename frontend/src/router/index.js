import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/home.vue')
    },
    {
      path: '/about',
      component: () => import('@/views/about.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/login.vue')
    },
    {
      path: '/register',
      component: () => import('@/views/register.vue')
    },
    {
      path: '/manage',
      component: () => import('@/views/manage.vue')
    }
  ]
})

export default router
