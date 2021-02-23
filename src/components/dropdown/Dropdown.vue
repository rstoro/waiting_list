<template>

  <div class="dropdown" v-bind:class="{'is-active': isActive}">

    <div class="dropdown-trigger">
      <button class="button" v-bind:disabled="isDisabled" @click="toggleIsActive()">
        <span>{{ buttonText }}</span>
        <span class="icon rotate-icon" v-bind:class="{'rotate': isActive}">
          <font-awesome-icon :icon="['fas', 'angle-right']"/>
        </span>
      </button>
    </div>

    <div class="dropdown-menu">
      <div class="dropdown-content">
        <a class="dropdown-item" 
          v-bind:class="{'is-active': val === value}"
          v-for="val in values" 
          @click="select(val)">
          {{ val }}
        </a>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    values: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedValue: '',
      isActive: false
    }
  },
  methods: {
    toggleIsActive() {
      this.isActive = !this.isActive;
    },
    select(val) {
      this.selectedValue = val;
      this.$emit('input', val);
      this.toggleIsActive();
    }
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
.rotate-icon {
  transform: rotate(0deg);
  transition-duration: 0.1s;
}
.rotate-icon.rotate {
  transform: rotate(90deg);
  transition-duration: 0.1s;
}
</style>
