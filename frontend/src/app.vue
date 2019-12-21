<template>
  <div class="app">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <router-link class="navbar-item" to="/">Home</router-link>
      <router-link class="navbar-item" to="/about">About</router-link>
    </nav>
    <section class="section">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </section>
  </div>
</template>

<style lang="scss">
.navbar {
  min-height: 3.25rem;
  align-items: stretch;
  display: flex;
}
.navbar-item, .navbar-link {
    align-items: center;
    display: flex !important;
}
.app {
  position: absolute;
  top: 24px;
  left: 32px;
  right: 32px;
  bottom: 24px;
  background: rgba(255, 255, 255, 0.5);
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
