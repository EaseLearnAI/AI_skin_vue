<template>
  <header class="app-header" :class="[bgColor]">
    <div class="header-content">
      <div v-if="showBackButton" @click="goBack" class="back-button">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </div>
      <div class="title-container">
        <h1 class="title">
          <font-awesome-icon v-if="icon" :icon="['fas', icon]" class="title-icon" />
          {{ title }}
        </h1>
      </div>
      <div v-if="rightIcon" class="right-action">
        <font-awesome-icon :icon="['fas', rightIcon]" />
      </div>
      <div v-else class="right-placeholder"></div>
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
  position: relative;
}

.back-button {
  color: white;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.title-container {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  pointer-events: auto;
}

.title-icon {
  margin-right: 0.5rem;
}

.right-action {
  color: white;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.right-action:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.right-placeholder {
  width: 36px;
}
</style> 