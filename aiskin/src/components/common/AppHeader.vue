<template>
  <header class="app-header" :class="[bgColor]">
    <div class="header-content">
      <div v-if="showBackButton" @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
      </div>
      <h1 class="title">
        <i v-if="icon" :class="['fas', `fa-${icon}`]" class="title-icon"></i>
        {{ title }}
      </h1>
      <div v-if="rightIcon" class="right-action">
        <i :class="['fas', `fa-${rightIcon}`]"></i>
      </div>
    </div>
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    },
    showBackButton: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: 'bg-sakura'
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.app-header {
  padding: 1rem;
}

.bg-sakura {
  background: linear-gradient(to right, #F8BBD0, #E1BEE7);
}

.bg-red {
  background: linear-gradient(to right, #ef5350, #e53935);
}

.bg-green {
  background: linear-gradient(to right, #66bb6a, #43a047);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.back-button {
  color: white;
  cursor: pointer;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 0.5rem;
}

.right-action {
  color: white;
}
</style> 