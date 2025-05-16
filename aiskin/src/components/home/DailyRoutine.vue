<template>
  <div class="daily-routine">
    <h3 class="title">
      <i class="fas fa-calendar-check"></i>
      今日使用方案
    </h3>
    <div class="routine-sections">
      <!-- Morning Routine -->
      <div class="routine-section">
        <div class="section-header">
          <i class="fas fa-sun"></i>
          <h4>早间护理</h4>
        </div>
        <div class="routine-items">
          <div v-for="(item, index) in morningRoutine" :key="'morning-'+index" class="routine-item">
            <span class="step-number">{{ index + 1 }}</span>
            <span class="product-name">{{ item }}</span>
          </div>
        </div>
      </div>
      
      <!-- Evening Routine -->
      <div class="routine-section">
        <div class="section-header">
          <i class="fas fa-moon"></i>
          <h4>晚间护理</h4>
        </div>
        <div class="routine-items">
          <div v-for="(item, index) in eveningRoutine" :key="'evening-'+index" class="routine-item">
            <span class="step-number">{{ index + 1 }}</span>
            <span class="product-name">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyRoutine',
  props: {
    morningRoutine: {
      type: Array,
      default: () => [
        'COSRX 低pH洁面啫喱',
        '理肤泉特安舒缓保湿霜',
        '安耐晒金瓶防晒霜'
      ]
    },
    eveningRoutine: {
      type: Array,
      default: () => [
        'COSRX 低pH洁面啫喱',
        'The Ordinary 维生素C精华',
        '理肤泉特安舒缓保湿霜'
      ]
    }
  }
}
</script>

<style scoped>
.daily-routine {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.title i {
  color: #F8BBD0;
  margin-right: 0.5rem;
}

.routine-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-header i {
  margin-right: 0.5rem;
}

.section-header:first-child i {
  color: #ffc107;
}

.section-header:last-child i {
  color: #2196f3;
}

.section-header h4 {
  font-size: 0.875rem;
  font-weight: 500;
}

.routine-items {
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.routine-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #fff9fb;
  border-radius: 0.5rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #ffd6e5;
  border-radius: 50%;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 0.75rem;
}

.product-name {
  font-size: 0.875rem;
}
</style> 