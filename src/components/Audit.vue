<template>
  <div class="audit">
    <div class="audit-body">
      
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'Audit',
  components: {},
  data() {
    return {
      auditText: 'Audit'
    }
  },
  methods: {},
  created() {
    console.log('created')
  }
}
</script>

<style scoped>
.audit {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.audit-body {
  display: flex;
  flex-flow: column;
  flex: 1;
  overflow: auto;
}
.true-center {
  display:flex;
  flex-flow: column;
  height:100%;
  justify-content: center;
}
</style>
