<template>
  <transition name="fade-up">
    <div v-if="display" class="notification notification-alert" v-bind:class="colourClass">
      <button class="delete" @click="closeNotification()"></button>
      <p>{{message}}</p>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';

//NOTE: this is how the alert "buffer" will be accessed
export const openNotificationAlert = (propsData) => {
  const notificationAlertComponent = Vue.extend(NotificationAlert);
  return new notificationAlertComponent({
    el: document.createElement('div'),
    propsData
  });
}

const NotificationAlert = {
  name: 'NotificationAlert',
  data() {
    // NOTE: '$_' is used for private properties that should not be 
    // accessible and cannot be restricted by scope.
    // https://vuejs.org/v2/style-guide/ 
    return {
      display: false,
      $_notificationParent: null
    }
  },
  props: {
    message: {
      type: String,
      required: true
    },
    colour: {
      type: String,
      default: 'info',
      validator: function(value) {
        return ['danger', 'info', 'success'].includes(value);
      }
    },
    colourIsLight: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 3000,
      validator: function(value) {
        return value > 0;
      }
    },
    //NOTE: this is really dangerous due to potential collisions preexisting before insertion
    containerId: {
      type: String,
      default: 'notification-alerts'
    }
  },
  computed: {
    colourClass: function() {
      //NOTE: this syntax is really disgusting... thanks ES6.
      return {
        [`is-${this.colour}`]: true,
        'is-light': this.colourIsLight
      };
    }
  },
  methods: {
    closeNotification() {
      clearTimeout(this.notificationUnsub);
      this.display = false;

      // give it some time to animate before destroying
      setTimeout(() => {
        this.$destroy();
      }, 1000);
    }
  },
  created() {
    // we are creating a root element if it does not already exist
    // otherwise we are storing the soon to be parent. 
    const vm = this;
    let parent = document.getElementById(vm.containerId);
    
    if (parent == null) {
      const Notifications = Vue.extend({
        render(h) {
          return h('div', {
            attrs: { 
              id: vm.containerId 
            },
            style: {
              position: 'absolute',
              right: '50%',
              zIndex: '9999',
              pointerEvents: 'none',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexFlow: 'column',
              alignItems: 'center'
            }
          });
        }
      });
      parent = new Notifications().$mount();
      document.body.appendChild(parent.$el);
    }
    else {
      parent = parent.__vue__;
    }

    this.$_notificationParent = parent;
  },
  mounted() {
    // we are injecting the template into the parent element
    // then setting our parent element to the previously stored element
    // and deleting the private property
    if (this.$_notificationParent != null) {
      this.$_notificationParent.$el.appendChild(this.$el);
      this.$parent = this.$_notificationParent;
      delete this.$_notificationParent;
    }

    this.notificationUnsub = setTimeout(() => {
      this.closeNotification();
    }, this.duration);
    
    //HACK: transition is weird and if the child element is not
    //      initially hidden, it will not trigger the transition
    this.display = true;
  },
  destroyed() {
    // this is absolutely necessary due to how we are injecting the element into the parent
    this.$el.remove();
  }
}

export default NotificationAlert;

</script>

<style scoped>
.fade-up-enter-active, 
.fade-up-leave-active {
  transition: opacity .3s, transform 1s;
}
.fade-up-enter {
  opacity: 0;
  transform: translate3d(0, 50px, 0);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translate3d(0, -50px, 0);
}
.fade-up-enter-to,
.fade-up-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.notification-alert {
  overflow-wrap: break-word;
  max-width: 50%;
  margin-top: 16px;
  margin-bottom: 0 !important;
}
</style>