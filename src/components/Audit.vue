<template>
  <Page>
    <div slot="body">
      <aside class="menu">
        <p class="menu-label">Dates</p>
        <ul class="menu-list">
          <li v-for="(name, index) in files" v-bind:key="`${name}_${index}`">
            <a>{{ name }}</a>
          </li>
        </ul>
      </aside>
    </div>
  </Page>
  
</template>

<script>
import storage from '../mixins/storage.js';
import Page from './base/Page.vue';

export default {
  name: 'Audit',
  components: { Page },
  mixins: [ storage ],
  data() {
    return {
      auditText: 'Audit',
      files: []
    }
  },
  methods: {},
  created() {
    this.files = this.getLogFilenames()
  }
}
</script>

<style scoped>
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
