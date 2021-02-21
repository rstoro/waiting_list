<template>
  <div class="page">
    <div class="page-header">
      <slot name="header"></slot>
    </div>

    <div class="line-wrapper"><div class="line"></div></div>

    <div class="page-body">
      <slot name="body"></slot>
    </div>

    <div class="line-wrapper"><div class="line"></div></div>

    <div class="page-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page'
}
</script>

<style scoped>
  .page {
    display: flex;
    flex-flow: column;
    overflow: hidden;
    height: 100%;
  }
  .page > .page-footer,
  .page > .page-header {
    padding: 0 16px;
  }
  .page > .page-body {
    flex: 1;
    padding: 0 16px;
    overflow-y: scroll;
  }
  .line-wrapper {
    padding: 24px 16px;
  }
  .line {
    border-top: 2px solid rgb(10, 10, 10, 0.1);
    font-size: 1px;
  }
</style>


