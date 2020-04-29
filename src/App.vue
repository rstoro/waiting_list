<template>
  <div id="app">
    <img class="logo" src="./assets/logo.png" alt="Station300 Logo">
    <WaitingList/>
  </div>
</template>

<script>
import WaitingList from './components/WaitingList.vue'

export default {
  name: 'App',
  components: {
    WaitingList
  }
}
</script>

<style>
img.logo {
  display: flex;
  max-width: 128px;
  height: auto;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
