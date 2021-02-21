<template>
  <div class="analytics">
    <div slot="body">
      
    </div>
  </div>
  
</template>

<script>
import Page from './base/Page.vue';

export default {
  name: 'Analytics',
  components: {},
  data() {
    return {
    }
  },
  methods: {},
  created() {
    console.log('created')
  }
}
</script>

<style scoped>
.analytics {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
