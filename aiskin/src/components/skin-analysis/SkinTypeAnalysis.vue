<template>
  <div class="skin-type-card">
    <div class="card-header">
      <h3 class="card-title">
        <font-awesome-icon icon="microscope" class="title-icon" />
        皮肤类型分析
      </h3>
      <div class="ai-tag">
        <span class="tag-text">AI识别</span>
      </div>
    </div>
    
    <div class="skin-type-summary">
      <div class="summary-content">
        <div class="summary-info">
          <h4 class="skin-type-name">{{ skinType.type }}</h4>
          <p class="skin-type-desc">{{ skinType.subtype === '混油性' ? 'T区偏油，U区正常偏干' : skinType.subtype }}</p>
          <div class="analysis-basis">
            <div class="basis-dot"></div>
            <span class="basis-text">基于面部油脂分布分析</span>
          </div>
        </div>
        <div class="skin-type-emoji">🧴</div>
      </div>
    </div>
    
    <div class="analysis-metrics">
      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-label">
            <font-awesome-icon icon="oil-can" class="metric-icon oil-icon" />
            T区油脂分泌
          </span>
          <span class="metric-status oil-status">{{ getOilLevel() }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill oil-progress" 
            :style="{ width: oilPercentage + '%' }"
          ></div>
        </div>
        <p class="metric-suggestion">建议使用控油洁面产品</p>
      </div>
      
      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-label">
            <font-awesome-icon icon="tint" class="metric-icon moisture-icon" />
            U区水分含量
          </span>
          <span class="metric-status moisture-status">{{ getMoistureLevel() }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill moisture-progress" 
            :style="{ width: moisturePercentage + '%' }"
          ></div>
        </div>
        <p class="metric-suggestion">保持现有保湿护理</p>
      </div>
      
      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-label">
            <font-awesome-icon icon="circle" class="metric-icon pore-icon" />
            毛孔粗细度
          </span>
          <span class="metric-status pore-status">{{ getPoreLevel() }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill pore-progress" 
            :style="{ width: porePercentage + '%' }"
          ></div>
        </div>
        <p class="metric-suggestion">T区毛孔略显粗大</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinTypeAnalysis',
  props: {
    skinType: {
      type: Object,
      default: () => ({
        type: '混合偏油性皮肤',
        subtype: '混油性',
        basis: 'T区偏油，U区正常偏干'
      })
    },
    oilLevel: {
      type: String,
      default: '偏高'
    },
    moistureLevel: {
      type: String,
      default: '正常'
    },
    poreLevel: {
      type: String,
      default: '中等'
    }
  },
  computed: {
    oilPercentage() {
      const levels = { '低': 30, '正常': 50, '偏高': 75, '高': 90 };
      return levels[this.oilLevel] || 60;
    },
    moisturePercentage() {
      const levels = { '低': 30, '正常': 60, '偏高': 80, '高': 95 };
      return levels[this.moistureLevel] || 60;
    },
    porePercentage() {
      const levels = { '细': 25, '正常': 45, '中等': 55, '粗大': 75 };
      return levels[this.poreLevel] || 55;
    }
  },
  methods: {
    getOilLevel() {
      return this.oilLevel;
    },
    getMoistureLevel() {
      return this.moistureLevel;
    },
    getPoreLevel() {
      return this.poreLevel;
    }
  }
}
</script>

<style scoped>
.skin-type-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.skin-type-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  margin: 0;
}

.title-icon {
  color: #F8BBD0;
  margin-right: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

.ai-tag {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.ai-tag:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.tag-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #E1BEE7;
}

.skin-type-summary {
  background: linear-gradient(135deg, #FEF7F0, #F0FDF4);
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #FFF9FB;
}

.summary-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-info {
  flex: 1;
}

.skin-type-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.skin-type-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 0.75rem 0;
}

.analysis-basis {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.basis-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #FFBBD0;
  border-radius: 50%;
}

.basis-text {
  font-size: 0.75rem;
  color: #6B7280;
}

.skin-type-emoji {
  font-size: 2.5rem;
  opacity: 0.8;
}

.analysis-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-item {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #F3F4F6;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
}

.metric-icon {
  margin-right: 0.5rem;
}

.oil-icon {
  color: #F59E0B;
}

.moisture-icon {
  color: #3B82F6;
}

.pore-icon {
  color: #8B5CF6;
}

.metric-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
}

.oil-status {
  color: #F59E0B;
  background-color: #FEF3C7;
}

.moisture-status {
  color: #3B82F6;
  background-color: #DBEAFE;
}

.pore-status {
  color: #8B5CF6;
  background-color: #EDE9FE;
}

.progress-bar {
  height: 0.5rem;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.oil-progress {
  background: linear-gradient(to right, #F59E0B, #EA580C);
}

.moisture-progress {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
}

.pore-progress {
  background: linear-gradient(to right, #8B5CF6, #EC4899);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

.metric-suggestion {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 