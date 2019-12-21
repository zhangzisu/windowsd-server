<template>
  <div class="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" to="/">
          <img src="@/assets/logo.png">
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/">
          Home
        </b-navbar-item>
        <b-navbar-item v-if="isLogin" tag="router-link" to="/manage">
          Manage
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/about">
          About
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="div">
          <div v-if="isLogin" class="buttons">
            <b-button type="is-danger" @click="logout">Log Out</b-button>
          </div>
          <div v-else class="buttons">
            <b-button tag="router-link" to="/register" type="is-primary">Sign Up</b-button>
            <b-button tag="router-link" to="/login" type="is-light">Log In</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="section">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </section>
  </div>
</template>

<script>
import { bus } from '@/bus'
import { disconnect } from '@/io'

export default {
  name: 'App',
  data: () => ({
    isLogin: false
  }),
  created () {
    bus.$on('login', () => { this.isLogin = true })
    bus.$on('logout', () => { this.isLogin = false })
  },
  methods: {
    logout () {
      disconnect()
    }
  }
}
</script>

<style lang="scss">
.app {
  position: absolute;
  top: 24px;
  left: 32px;
  right: 32px;
  bottom: 24px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  overflow-y: scroll;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
