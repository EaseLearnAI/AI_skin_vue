<template>
  <header class="skin-header">
    <div class="header-content">
      <button @click="$router.go(-1)" class="header-btn">
        <font-awesome-icon icon="arrow-left" />
      </button>
      <h1 class="header-title">
        <font-awesome-icon icon="camera" />
        肌肤检测
      </h1>
      <button @click="$emit('showHistory')" class="header-btn">
        <font-awesome-icon icon="history" />
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
.skin-header {
  background: linear-gradient(to right, #F8BBD0, #E1BEE7);
  padding: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 430px;
  margin: 0 auto;
}

.header-btn {
  color: white;
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.5rem;
}

.header-btn:hover {
  color: #FFF9FB;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}
</style> 