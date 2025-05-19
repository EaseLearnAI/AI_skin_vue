<template>
  <div class="auth-header">

    
    <div class="header-content" :class="bgColor">
      <div class="back-button" v-if="showBackButton" @click="goBack">
        <font-awesome-icon icon="arrow-left" />
      </div>
      
      <div class="logo-container">
        <div class="logo">
          <font-awesome-icon icon="paw" />
        </div>
        <h1 class="app-name">AI猫咪护肤</h1>
      </div>
      
      <h2 class="page-title">{{ title }}</h2>
      <p class="page-subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script>


export default {
  name: 'AuthHeader',
  components: {

  },
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: 'bg-sakura'
    },
    showBackButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.auth-header {
  width: 100%;
}

.header-content {
  position: relative;
  padding: 1.5rem 1rem 2.5rem;
  text-align: center;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.bg-sakura {
  background: linear-gradient(135deg, #F8BBD0, #E1BEE7);
}

.back-button {
  position: absolute;
  top: 1.5rem;
  left: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.logo {
  width: 4rem;
  height: 4rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.75rem;
}

.logo svg {
  font-size: 2rem;
  color: #F8BBD0;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}
</style> 