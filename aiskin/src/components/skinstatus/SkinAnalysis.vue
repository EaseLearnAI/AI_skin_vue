<template>
  <div class="skin-analysis">
    <h2 class="section-title">
      <i class="fas fa-tint"></i>
      肌肤状态分析
    </h2>
    <div class="analysis-content">
      <!-- Hydration Status -->
      <div class="analysis-card">
        <div class="analysis-header">
          <h3 class="analysis-title">水分状态</h3>
          <div class="status-value">
            {{ hydration.value }}%
            <span v-if="hydration.change > 0" class="status-change positive">
              <i class="fas fa-arrow-up"></i>
              {{ hydration.change }}%
            </span>
            <span v-else-if="hydration.change < 0" class="status-change negative">
              <i class="fas fa-arrow-down"></i>
              {{ Math.abs(hydration.change) }}%
            </span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${hydration.value}%` }"></div>
        </div>
        <p class="analysis-description">{{ hydration.description }}</p>
      </div>
      
      <!-- Oil Status -->
      <div class="analysis-card">
        <div class="analysis-header">
          <h3 class="analysis-title">油脂状态</h3>
          <div class="status-value">{{ oil.value }}%</div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${oil.value}%`, backgroundColor: getOilStatusColor(oil.value) }"
          ></div>
        </div>
        <p class="analysis-description">{{ oil.description }}</p>
      </div>
      
      <!-- Sensitivity Status -->
      <div class="analysis-card">
        <div class="analysis-header">
          <h3 class="analysis-title">敏感程度</h3>
          <div class="sensitivity-level">
            <span 
              v-for="i in 5" 
              :key="i" 
              class="level-dot"
              :class="{ active: i <= sensitivity.level }"
            ></span>
          </div>
        </div>
        <p class="analysis-description">{{ sensitivity.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinAnalysis',
  props: {
    hydration: {
      type: Object,
      default: () => ({
        value: 50,
        description: '皮肤水分处于正常水平',
        change: 0
      })
    },
    oil: {
      type: Object,
      default: () => ({
        value: 50,
        description: '皮肤油分处于正常水平'
      })
    },
    sensitivity: {
      type: Object,
      default: () => ({
        level: 1,
        description: '皮肤敏感度较低，可以使用一般护肤品'
      })
    }
  },
  methods: {
    getOilStatusColor(value) {
      if (value <= 30) return '#4caf50' // 低油脂，绿色
      if (value <= 60) return '#ff9800' // 中等油脂，橙色
      return '#f44336' // 高油脂，红色
    }
  }
}
</script>

<style scoped>
.skin-analysis {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title i {
  color: #2196f3;
  margin-right: 0.5rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-card {
  background-color: #fff9fb;
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.analysis-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.status-change {
  font-size: 0.75rem;
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
}

.status-change.positive {
  color: #4caf50;
}

.status-change.negative {
  color: #f44336;
}

.status-change i {
  font-size: 0.625rem;
  margin-right: 0.125rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: #e0e0e0;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #2196f3;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.analysis-description {
  font-size: 0.75rem;
  color: #616161;
}

.sensitivity-level {
  display: flex;
  gap: 0.25rem;
}

.level-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.level-dot.active {
  background-color: #f44336;
}
</style> 