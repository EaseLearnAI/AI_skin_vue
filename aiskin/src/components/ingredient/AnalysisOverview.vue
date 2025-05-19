<template>
  <div class="analysis-overview">
    <h3 class="section-title">安全性分析</h3>
    
    <div class="score-cards">
      <div class="score-card">
        <div class="score">{{ analysis.safetyIndex || 0 }}</div>
        <div class="score-label">安全指数</div>
      </div>
      <div class="score-card">
        <div class="score">{{ analysis.efficacyScore || 0 }}</div>
        <div class="score-label">功效评分</div>
      </div>
      <div class="score-card">
        <div class="score">{{ analysis.activeIngredients || 0 }}</div>
        <div class="score-label">活性成分</div>
      </div>
    </div>
    
    <div class="risk-indicators">
      <div class="risk-indicator">
        <span class="risk-label">致痘风险</span>
        <div class="risk-bar-wrapper">
          <div class="risk-bar">
            <div 
              class="risk-fill" 
              :style="{ width: `${analysis.acneRisk?.percentage || 0}%` }"
              :class="getRiskLevelClass(analysis.acneRisk?.level)"
            ></div>
          </div>
          <span class="risk-level" :class="getRiskLevelClass(analysis.acneRisk?.level)">
            {{ analysis.acneRisk?.level || '低' }}
          </span>
        </div>
      </div>
      
      <div class="risk-indicator">
        <span class="risk-label">刺激风险</span>
        <div class="risk-bar-wrapper">
          <div class="risk-bar">
            <div 
              class="risk-fill" 
              :style="{ width: `${analysis.irritationRisk?.percentage || 0}%` }"
              :class="getRiskLevelClass(analysis.irritationRisk?.level)"
            ></div>
          </div>
          <span class="risk-level" :class="getRiskLevelClass(analysis.irritationRisk?.level)">
            {{ analysis.irritationRisk?.level || '低' }}
          </span>
        </div>
      </div>
      
      <div class="risk-indicator">
        <span class="risk-label">过敏风险</span>
        <div class="risk-bar-wrapper">
          <div class="risk-bar">
            <div 
              class="risk-fill" 
              :style="{ width: `${analysis.allergyRisk?.percentage || 0}%` }"
              :class="getRiskLevelClass(analysis.allergyRisk?.level)"
            ></div>
          </div>
          <span class="risk-level" :class="getRiskLevelClass(analysis.allergyRisk?.level)">
            {{ analysis.allergyRisk?.level || '低' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisOverview',
  props: {
    analysis: {
      type: Object,
      required: true,
      default: () => ({
        safetyIndex: 0,
        efficacyScore: 0,
        activeIngredients: 0,
        acneRisk: { level: '低', percentage: 10 },
        irritationRisk: { level: '低', percentage: 15 },
        allergyRisk: { level: '低', percentage: 20 }
      })
    }
  },
  methods: {
    getRiskLevelClass(level) {
      if (!level) return 'low-risk'
      
      switch (level) {
        case '低':
          return 'low-risk'
        case '中':
          return 'medium-risk'
        case '高':
          return 'high-risk'
        default:
          return 'low-risk'
      }
    }
  }
}
</script>

<style scoped>
.analysis-overview {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #333;
}

.score-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.score-card {
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
}

.score-card:nth-child(1) {
  background-color: #e8f5e9;
}

.score-card:nth-child(2) {
  background-color: #e3f2fd;
}

.score-card:nth-child(3) {
  background-color: #f3e5f5;
}

.score {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.score-card:nth-child(1) .score {
  color: #2e7d32;
}

.score-card:nth-child(2) .score {
  color: #1565c0;
}

.score-card:nth-child(3) .score {
  color: #6a1b9a;
}

.score-label {
  font-size: 0.75rem;
  color: #666;
}

.risk-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.risk-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.risk-label {
  font-size: 0.875rem;
  color: #555;
}

.risk-bar-wrapper {
  display: flex;
  align-items: center;
}

.risk-bar {
  width: 6rem;
  height: 0.5rem;
  background-color: #f1f1f1;
  border-radius: 9999px;
  overflow: hidden;
  margin-right: 0.5rem;
}

.risk-fill {
  height: 100%;
  border-radius: 9999px;
}

.risk-fill.low-risk {
  background-color: #4caf50;
}

.risk-fill.medium-risk {
  background-color: #ff9800;
}

.risk-fill.high-risk {
  background-color: #f44336;
}

.risk-level {
  font-size: 0.75rem;
}

.risk-level.low-risk {
  color: #4caf50;
}

.risk-level.medium-risk {
  color: #ff9800;
}

.risk-level.high-risk {
  color: #f44336;
}
</style> 