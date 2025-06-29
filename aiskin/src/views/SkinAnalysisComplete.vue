<template>
  <div class="skin-analysis-complete">
    <!-- 模拟iPhone状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="time">9:41</span>
      </div>
      <div class="status-right">
        <span class="signal">📶</span>
        <span class="wifi">📶</span>
        <span class="battery">🔋</span>
      </div>
    </div>

    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <div class="btn-icon">←</div>
        </button>
        <h1 class="header-title">

          肌肤检测
        </h1>
        <button class="history-btn">
          <div class="btn-icon">🕐</div>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Overall Health Score -->
      <div class="health-score-card">
        <div class="score-header">
          <div class="score-info">
            <h2 class="score-title">
              <div class="title-icon">✨</div>
              AI肌肤健康评分
            </h2>
            <p class="score-subtitle">基于深度学习智能分析</p>
          </div>
          <div class="score-circle">
            <svg class="progress-ring" width="80" height="80">
              <circle stroke="#f3f4f6" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"/>
              <circle stroke="#ffffff" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"
                  stroke-dasharray="213.6" :stroke-dashoffset="scoreOffset" stroke-linecap="round"/>
            </svg>
            <div class="score-display">
              <span class="score-number">{{ healthScore }}</span>
              <div class="score-label">健康分</div>
            </div>
          </div>
        </div>
        <div class="score-summary">
          <div class="summary-content">
            <div class="summary-icon">💬</div>
            <p class="summary-text">{{ overallSummary }}</p>
          </div>
        </div>
      </div>

      <!-- Skin Status Overview -->
      <SkinStatusOverview 
        :blackheads="analysisData.blackheads"
        :acne="analysisData.acne"
        :pores="analysisData.pores"
        :skinToneEvenness="analysisData.skinToneEvenness"
        :redness="analysisData.redness"
        :hyperpigmentation="analysisData.hyperpigmentation"
        :fineLines="analysisData.fineLines"
        :sensitivity="analysisData.sensitivity"
      />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="action-btn primary-btn" @click="retakePhoto">
          <div class="btn-content">
            <div class="btn-icon">📷</div>
            <span>重新检测</span>
          </div>
        </button>
        
        <button class="action-btn secondary-btn" @click="shareReport">
          <div class="btn-content">
            <div class="btn-icon">📤</div>
            <span>分享报告</span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import SkinStatusOverview from '@/components/skin-analysis/SkinStatusOverview.vue'

export default {
  name: 'SkinAnalysisComplete',
  components: {
    SkinStatusOverview
  },
  data() {
    return {
      healthScore: 75,
      overallSummary: '混合偏油性皮肤，T区油脂分泌旺盛伴随毛孔粗大，局部存在少量闭口型粉刺及黑头，肤色均匀度良好但需加强控油护理',
      analysisData: {
        blackheads: {
          exists: true,
          severity: '少量',
          distribution: ['鼻翼', '下巴']
        },
        acne: {
          exists: true,
          count: '少量',
          types: ['粉刺'],
          distribution: ['额头', '下巴']
        },
        pores: {
          enlarged: true,
          severity: '中度',
          distribution: ['T区']
        },
        skinToneEvenness: {
          score: 7,
          description: '较为均匀'
        },
        redness: {
          exists: true,
          severity: '轻度',
          description: '轻微敏感性泛红',
          distribution: ['鼻翼', '脸颊']
        },
        hyperpigmentation: {
          exists: true,
          severity: '轻度',
          description: '少量晒斑痘印',
          types: ['晒斑', '痘印'],
          distribution: []
        },
        fineLines: {
          exists: false,
          severity: '良好',
          description: '眼周轻微细纹',
          distribution: []
        },
        sensitivity: {
          exists: false,
          severity: '轻度',
          description: '轻度敏感肌',
          signs: []
        }
      }
    }
  },
  computed: {
    scoreOffset() {
      const radius = 34;
      const circumference = radius * 2 * Math.PI;
      return circumference - (this.healthScore / 100 * circumference);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    retakePhoto() {
      console.log('重新检测');
    },
    shareReport() {
      console.log('分享报告');
    }
  }
}
</script>

<style scoped>
.skin-analysis-complete {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #fef7f0 0%, #fff9fb 100%);
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 0 8px #1a1a1a, 0 0 0 10px #333, 0 20px 40px rgba(0,0,0,0.3);
  border-radius: 2.5rem;
  overflow: hidden;
}

/* iPhone状态栏 */
.status-bar {
  background: linear-gradient(135deg, #f8bbd0, #e1bee7);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-left .time {
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}

.status-right {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #f8bbd0, #e1bee7);
  padding: 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn,
.history-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 300ms ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover,
.history-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.btn-icon {
  font-size: 1.125rem;
  font-weight: 600;
}

.header-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.title-icon {
  font-size: 1rem;
}

/* Main Content */
.main-content {
  padding: 1rem 0.5rem;
}

/* Health Score Card */
.health-score-card {
  background: linear-gradient(135deg, #f8bbd0, #e1bee7);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.05);
  transition: all 300ms ease-out;
}

.health-score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08), 0 20px 25px rgba(0, 0, 0, 0.08);
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.score-title {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
}

.score-subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.score-circle {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.score-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

.score-summary {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.summary-icon {
  font-size: 1rem;
  margin-top: 0.125rem;
}

.summary-text {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 1.25rem;
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 300ms ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.secondary-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 850px) {
  .skin-analysis-complete {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}

@media (max-width: 430px) {
  .main-content {
    padding: 0.75rem;
  }
  
  .health-score-card {
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .score-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .score-info {
    order: 2;
  }
  
  .score-circle {
    order: 1;
  }
}

@media (max-width: 320px) {
  .header-title {
    font-size: 1rem;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .action-btn {
    padding: 1rem;
  }
}
</style> 