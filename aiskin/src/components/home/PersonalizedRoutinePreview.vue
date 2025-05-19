<template>
  <div class="routine-preview" v-if="plan">
    <div class="preview-header">
      <h3 class="preview-title">
        <font-awesome-icon :icon="['fas', 'magic']" class="mr-2" />
        {{ plan.name }}
      </h3>
      <p class="preview-description">{{ plan.requirement || '日常基础护肤' }}</p>
    </div>
    
    <div class="preview-content">
      <!-- Morning Routine -->
      <div class="routine-section">
        <h4 class="section-title">
          <font-awesome-icon :icon="['fas', 'sun']" class="mr-2" />
          早间护理
        </h4>
        <div class="routine-steps">
          <div 
            v-for="(step, index) in plan.morning" 
            :key="index"
            class="step-item"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-product">{{ step.product }}</div>
          </div>
        </div>
      </div>
      
      <!-- Evening Routine -->
      <div class="routine-section">
        <h4 class="section-title">
          <font-awesome-icon :icon="['fas', 'moon']" class="mr-2" />
          晚间护理
        </h4>
        <div class="routine-steps">
          <div 
            v-for="(step, index) in plan.evening" 
            :key="index"
            class="step-item"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-product">{{ step.product }}</div>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="recommendations-section" v-if="plan.recommendations && plan.recommendations.length > 0">
        <h4 class="section-title">
          <font-awesome-icon :icon="['fas', 'lightbulb']" class="mr-2" />
          专业建议
        </h4>
        <ul class="recommendations-list">
          <li 
            v-for="(tip, index) in plan.recommendations" 
            :key="index"
            class="recommendation-item"
          >
            <font-awesome-icon :icon="['fas', 'check-circle']" class="tip-icon" />
            <span>{{ tip }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="preview-actions">
      <button class="save-button" @click="saveRoutine">
        <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
        保存到我的方案
      </button>
      <button class="customize-button" @click="customizeRoutine">
        <font-awesome-icon :icon="['fas', 'edit']" class="mr-2" />
        重新定制
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalizedRoutinePreview',
  props: {
    plan: {
      type: Object,
      default: null
    }
  },
  methods: {
    saveRoutine() {
      this.$emit('save-routine', this.plan);
    },
    customizeRoutine() {
      this.$emit('customize-routine');
    }
  }
}
</script>

<style scoped>
.routine-preview {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.preview-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.preview-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
}

.preview-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
}

.routine-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.step-item:hover {
  background-color: #f5f5f5;
  transform: translateX(3px);
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #9c27b0;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.step-product {
  font-size: 0.9375rem;
  color: #333;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.875rem;
  color: #555;
  line-height: 1.5;
}

.tip-icon {
  color: #9c27b0;
  margin-right: 0.625rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1.5rem;
}

.save-button, .customize-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.save-button {
  background: linear-gradient(135deg, #ab47bc, #7b1fa2);
  color: white;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(123, 31, 162, 0.25);
}

.customize-button {
  background-color: #f5f5f5;
  color: #666;
}

.customize-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.mr-2 {
  margin-right: 0.5rem;
}
</style> 