<template>
  <div class="analysis-grid">
    <!-- Blackheads -->
    <div class="analysis-card">
      <div class="card-header">
        <h4 class="card-title">
          <font-awesome-icon icon="dot-circle" class="title-icon blackhead-icon" />
          黑头情况
        </h4>
        <div class="status-indicator blackhead-indicator"></div>
      </div>
      <div class="card-content">
        <div class="severity-level">{{ blackheads.severity }}</div>
        <div class="progress-container">
          <div 
            class="progress-fill blackhead-progress" 
            :style="{ width: getSeverityPercentage(blackheads.severity) + '%' }"
          ></div>
        </div>
        <div class="info-tag blackhead-tag">
          <p class="tag-text">{{ blackheads.distribution.join('、') }}</p>
        </div>
        <div class="rating-dots">
          <div 
            v-for="(dot, index) in 5" 
            :key="index"
            :class="['rating-dot', index < getSeverityLevel(blackheads.severity) ? 'active blackhead-active' : 'inactive']"
          ></div>
        </div>
      </div>
    </div>

    <!-- Acne -->
    <div class="analysis-card">
      <div class="card-header">
        <h4 class="card-title">
          <font-awesome-icon icon="exclamation-triangle" class="title-icon acne-icon" />
          痘痘情况
        </h4>
        <div class="status-indicator acne-indicator"></div>
      </div>
      <div class="card-content">
        <div class="severity-level">{{ acne.count }}</div>
        <div class="progress-container">
          <div 
            class="progress-fill acne-progress" 
            :style="{ width: getSeverityPercentage(acne.count) + '%' }"
          ></div>
        </div>
        <div class="info-tag acne-tag">
          <p class="tag-text">{{ acne.distribution.join('、') }}{{ acne.types.join('') }}</p>
        </div>
        <div class="rating-dots">
          <div 
            v-for="(dot, index) in 5" 
            :key="index"
            :class="['rating-dot', index < getSeverityLevel(acne.count) ? 'active acne-active' : 'inactive']"
          ></div>
        </div>
      </div>
    </div>

    <!-- Pores -->
    <div class="analysis-card">
      <div class="card-header">
        <h4 class="card-title">
          <font-awesome-icon icon="circle" class="title-icon pore-icon" />
          毛孔状态
        </h4>
        <div class="status-indicator pore-indicator"></div>
      </div>
      <div class="card-content">
        <div class="severity-level">{{ pores.severity }}</div>
        <div class="progress-container">
          <div 
            class="progress-fill pore-progress" 
            :style="{ width: getSeverityPercentage(pores.severity) + '%' }"
          ></div>
        </div>
        <div class="info-tag pore-tag">
          <p class="tag-text">{{ pores.distribution.join('、') }}粗大</p>
        </div>
        <div class="rating-dots">
          <div 
            v-for="(dot, index) in 5" 
            :key="index"
            :class="['rating-dot', index < getSeverityLevel(pores.severity) ? 'active pore-active' : 'inactive']"
          ></div>
        </div>
      </div>
    </div>

    <!-- Skin Tone Evenness -->
    <div class="analysis-card">
      <div class="card-header">
        <h4 class="card-title">
          <font-awesome-icon icon="palette" class="title-icon tone-icon" />
          肤色均匀度
        </h4>
        <div class="status-indicator tone-indicator"></div>
      </div>
      <div class="card-content">
        <div class="severity-level">{{ getSkinToneStatus() }}</div>
        <div class="progress-container">
          <div 
            class="progress-fill tone-progress" 
            :style="{ width: (skinToneEvenness.score * 10) + '%' }"
          ></div>
        </div>
        <div class="info-tag tone-tag">
          <p class="tag-text">{{ skinToneEvenness.description }}</p>
        </div>
        <div class="rating-dots">
          <div 
            v-for="(dot, index) in 5" 
            :key="index"
            :class="['rating-dot', index < Math.floor(skinToneEvenness.score / 2) ? 'active tone-active' : 'inactive']"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailedAnalysisGrid',
  props: {
    blackheads: {
      type: Object,
      default: () => ({
        exists: true,
        severity: '少量',
        distribution: ['鼻翼', '下巴']
      })
    },
    acne: {
      type: Object,
      default: () => ({
        exists: true,
        count: '少量',
        types: ['粉刺'],
        distribution: ['额头', '下巴']
      })
    },
    pores: {
      type: Object,
      default: () => ({
        enlarged: true,
        severity: '中度',
        distribution: ['T区']
      })
    },
    skinToneEvenness: {
      type: Object,
      default: () => ({
        score: 7,
        description: '较为均匀'
      })
    }
  },
  methods: {
    getSeverityPercentage(severity) {
      const severityMap = {
        '无': 0,
        '轻度': 25,
        '少量': 30,
        '正常': 45,
        '中度': 60,
        '大量': 80,
        '严重': 90
      };
      return severityMap[severity] || 0;
    },
    getSeverityLevel(severity) {
      const levelMap = {
        '无': 0,
        '轻度': 1,
        '少量': 1,
        '正常': 2,
        '中度': 3,
        '大量': 4,
        '严重': 5
      };
      return levelMap[severity] || 0;
    },
    getSkinToneStatus() {
      if (this.skinToneEvenness.score >= 8) return '优秀';
      if (this.skinToneEvenness.score >= 6) return '良好';
      if (this.skinToneEvenness.score >= 4) return '一般';
      return '需改善';
    }
  }
}
</script>

<style scoped>
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.analysis-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.analysis-card:hover {
  box-shadow: 0 20px 40px rgba(248, 187, 208, 0.2);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  margin: 0;
}

.title-icon {
  margin-right: 0.5rem;
}

.blackhead-icon {
  color: #F59E0B;
}

.acne-icon {
  color: #EF4444;
}

.pore-icon {
  color: #EAB308;
}

.tone-icon {
  color: #22C55E;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  position: relative;
  animation: pulse 2s infinite;
}

.blackhead-indicator {
  background-color: #F59E0B;
}

.acne-indicator {
  background-color: #FB923C;
}

.pore-indicator {
  background-color: #EAB308;
}

.tone-indicator {
  background-color: #22C55E;
}

.status-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

.card-content {
  text-align: center;
}

.severity-level {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.progress-container {
  height: 0.5rem;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  position: relative;
  overflow: hidden;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.blackhead-progress {
  background: linear-gradient(to right, #F59E0B, #EA580C);
}

.acne-progress {
  background: linear-gradient(to right, #FB923C, #EF4444);
}

.pore-progress {
  background: linear-gradient(to right, #EAB308, #F97316);
}

.tone-progress {
  background: linear-gradient(to right, #22C55E, #16A34A);
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

.info-tag {
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.blackhead-tag {
  background-color: #FEF3C7;
}

.acne-tag {
  background-color: #FED7AA;
}

.pore-tag {
  background-color: #FEF08A;
}

.tone-tag {
  background-color: #DCFCE7;
}

.tag-text {
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
}

.blackhead-tag .tag-text {
  color: #92400E;
}

.acne-tag .tag-text {
  color: #C2410C;
}

.pore-tag .tag-text {
  color: #A16207;
}

.tone-tag .tag-text {
  color: #166534;
}

.rating-dots {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.rating-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.rating-dot.inactive {
  background-color: #E5E7EB;
}

.rating-dot.active.blackhead-active {
  background-color: #F59E0B;
}

.rating-dot.active.acne-active {
  background-color: #FB923C;
}

.rating-dot.active.pore-active {
  background-color: #EAB308;
}

.rating-dot.active.tone-active {
  background-color: #22C55E;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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