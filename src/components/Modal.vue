<template>
  <transition name="modal">
    <div class="modal-mask">

        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header"></slot>
            </div>

            <div class="modal-body">
              <slot name="body"></slot>
            </div>

            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>

          </div>
        </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal'
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  max-width: 60%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  position: relative;
}
.modal-header,
.modal-body,
.modal-footer {
  padding: 16px 16px;
}
.modal-header {
  text-align: left;
  color: #42b983;
  background-color: whitesmoke;
  border-bottom: 1px solid #dbdbdb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  background-color: whitesmoke;
  border-top: 1px solid #dbdbdb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
.modal-leave
.modal-enter-to {
  opacity: 1;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity .3s ease;
}
</style>