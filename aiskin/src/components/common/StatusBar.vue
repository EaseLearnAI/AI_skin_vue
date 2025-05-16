<template>
  <div class="status-bar">
    <div class="status-items">
      <i class="fas fa-wifi"></i>
      <i class="fas fa-signal"></i>
      <i class="fas fa-battery-full"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBar'
}
</script>

<style scoped>
.status-bar {
  background-color: white;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: flex-end;
}

.status-items {
  display: flex;
  gap: 0.5rem;
  color: #757575;
  font-size: 0.75rem;
}
</style> 