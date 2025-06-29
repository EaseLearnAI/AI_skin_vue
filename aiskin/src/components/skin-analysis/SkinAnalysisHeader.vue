<template>
  <header class="product-header">
    <div class="header-container">
      <a href="#" class="back-button" @click.prevent="$router.go(-1)">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
      </a>
      <h1 class="header-title">
        <font-awesome-icon :icon="['fas', 'paw']" class="header-icon" />
        肌肤检测
      </h1>
      <button class="menu-button" @click="$emit('showHistory')">
        <font-awesome-icon :icon="['fas', 'history']" />
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SkinAnalysisHeader',
  emits: ['showHistory']
}
</script>

<style scoped>
.product-header {
  background: linear-gradient(135deg, #f8bbd0, #e1bee7);
  padding: 1rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
}

.header-icon {
  margin-right: 0.5rem;
  font-size: 1.125rem;
}

.menu-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>