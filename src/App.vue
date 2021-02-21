<template>
  <div id="app">

    <div class="tabs is-boxed is-centered">
      <ul>
        <li v-bind:class="{'is-active': isSelected('waitingList')}" 
            @click="select('waitingList')">
          <a>
            <span class="small-margin-right">
              <font-awesome-icon :icon="['fas', 'list']"/>
            </span>
            <span>Waiting List</span>
          </a>
        </li>
        <li v-bind:class="{'is-active': isSelected('audit')}" 
            @click="select('audit')">
          <a>
            <span class="small-margin-right">
              <font-awesome-icon :icon="['fas', 'search']"/>
            </span>
            <span>Audit</span>
          </a>
        </li>
        <li v-bind:class="{'is-active': isSelected('analytics')}" 
            @click="select('analytics')">
          <a>
            <span class="small-margin-right">
              <font-awesome-icon :icon="['fas', 'chart-bar']"/>
            </span>
            <span>Analytics</span>
          </a>
        </li>
      </ul>
    </div>

    <div id="app-content">
      <WaitingList v-if="isSelected('waitingList')" />
      <Audit v-if="isSelected('audit')" />
      <Analytics v-if="isSelected('analytics')" />
    </div>

  </div>
</template>

<script>
import WaitingList from './components/WaitingList.vue';
import Audit from './components/Audit.vue';
import Analytics from './components/Analytics.vue';

export default {
  name: 'App',
  components: {
    WaitingList,
    Audit,
    Analytics
  },
  data() {
    return {
      selection: 'waitingList'
    }
  },
  methods: {
    select(name) {
      this.selection = name;
    },
    isSelected(name) {
      return name === this.selection;
    }
  }
}
</script>

<style lang="scss">

/* CUSTOM BULMA */
@import "../node_modules/bulma/sass/utilities/initial-variables";
$input-placeholder-color: $grey;
$primary: #3273dc;

/* TODO: what can we cut down on? */
@import "../node_modules/bulma/sass/utilities/_all.sass";
@import "../node_modules/bulma/sass/base/_all.sass";
@import "../node_modules/bulma/sass/elements/_all.sass";
@import "../node_modules/bulma/sass/form/_all.sass";
@import "../node_modules/bulma/sass/components/_all.sass";
@import "../node_modules/bulma/sass/grid/_all.sass";
@import "../node_modules/bulma/sass/layout/_all.sass";

/* CALENDAR */
@import "../node_modules/bulma-calendar/src/sass/index.sass";
@import "../node_modules/bulma-calendar/src/sass/timepicker.sass";

/* CUSTOM */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
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
  overflow: hidden;
}
#app-content {
  flex: 1;
  overflow: hidden;
}
.small-margin-right {
  margin-right: 8px;
}
.large-margin-right {
  margin-right: 32px;
}
</style>
