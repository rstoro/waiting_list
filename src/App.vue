<template>
  <div id="app">
    <WaitingList/>
  </div>
</template>

<script>
import WaitingList from './components/WaitingList.vue';

export default {
  name: 'App',
  components: {
    WaitingList
  }
}
</script>

<style lang="scss">

/* CUSTOM BULMA */
@import "../node_modules/bulma/sass/utilities/initial-variables";
$input-placeholder-color: $grey;

// TODO: what can we cut down on?
@import "../node_modules/bulma/sass/utilities/_all.sass";
@import "../node_modules/bulma/sass/base/_all.sass";
@import "../node_modules/bulma/sass/elements/_all.sass";
@import "../node_modules/bulma/sass/form/_all.sass";
@import "../node_modules/bulma/sass/components/_all.sass";
@import "../node_modules/bulma/sass/layout/_all.sass";

/* CUSTOM */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* REQUIRED FOR DRAGULA */
.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
  filter: alpha(opacity=80);
}
.gu-hide {
  display: none !important;
}
.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
.gu-transit {
  opacity: 0.2;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";
  filter: alpha(opacity=20);
}
/* GLOBAL CSS */
html,
body,
#app {
  height: 100%;
  width: 100%;
}
body {
  overflow: hidden;
}
.small-margin-right {
  margin-right: 8px;
}
.large-margin-right {
  margin-right: 32px;
}
</style>
