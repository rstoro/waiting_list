<template>
  <div class="group">

    <header class="card-header">
      <p class="card-header-title remove-font-weight">
        <span class="icon icon-margin-right">
          <font-awesome-icon :icon="['fas', 'user']"/>
        </span>
        <span>{{ group.fullname }}</span>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options" @click="isSelected = !isSelected">
        <span class="icon">
          <!-- NOTE: this is crap, I wish there was a conditional to prevent this garbage. -->
          <font-awesome-icon v-if="isSelected" :icon="['fas', 'angle-right']"/>
          <font-awesome-icon v-if="!isSelected" :icon="['fas', 'angle-down']"/>
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </a>
    </header>

    <div v-if="isSelected" class="card-content">
      <transition name="selected">
        <div class="content">
          <p>Phone Number:&nbsp;{{ group.phonenumber }}</p>
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
export default {
  name: 'GroupCard',
  data: () => {
    return {
      'isSelected': false
    }
  },
  props: {
    'group': {}
  }
}
</script>

<style scoped>
.icon-margin-right {
  margin-right: 8px;
}
.remove-font-weight {
  font-weight: 100;
}
/* TODO: group-selected animations */
</style>