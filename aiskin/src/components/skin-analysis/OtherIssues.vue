<template>
  <div class="other-issues-card">
    <div class="card-header">
      <h3 class="card-title">
        <font-awesome-icon icon="search-plus" class="title-icon" />
        其他皮肤问题
      </h3>
      <div class="analysis-tag">
        <span class="tag-text">深度分析</span>
      </div>
    </div>
    
    <div class="issues-list">
      <!-- Redness -->
      <div class="issue-item redness-item">
        <div class="issue-header">
          <div class="issue-info">
            <div class="issue-icon-container redness-icon-bg">
              <font-awesome-icon icon="thermometer-half" class="issue-icon" />
            </div>
            <div class="issue-details">
              <h4 class="issue-title">泛红情况</h4>
              <p class="issue-description">{{ redness.description }}</p>
            </div>
          </div>
          <div class="severity-tag redness-tag">
            <span class="severity-text">{{ redness.severity }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill redness-progress" 
            :style="{ width: getSeverityPercentage(redness.severity) + '%' }"
          ></div>
        </div>
        <p class="suggestion-text">建议使用舒缓类护肤品</p>
      </div>

      <!-- Hyperpigmentation -->
      <div class="issue-item pigmentation-item">
        <div class="issue-header">
          <div class="issue-info">
            <div class="issue-icon-container pigmentation-icon-bg">
              <font-awesome-icon icon="sun" class="issue-icon" />
            </div>
            <div class="issue-details">
              <h4 class="issue-title">色素沉着</h4>
              <p class="issue-description">{{ hyperpigmentation.description }}</p>
            </div>
          </div>
          <div class="severity-tag pigmentation-tag">
            <span class="severity-text">{{ hyperpigmentation.severity }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill pigmentation-progress" 
            :style="{ width: getSeverityPercentage(hyperpigmentation.severity) + '%' }"
          ></div>
        </div>
        <p class="suggestion-text">建议加强防晒和美白护理</p>
      </div>
      
      <!-- Fine Lines -->
      <div class="issue-item lines-item">
        <div class="issue-header">
          <div class="issue-info">
            <div class="issue-icon-container lines-icon-bg">
              <font-awesome-icon icon="eye" class="issue-icon" />
            </div>
            <div class="issue-details">
              <h4 class="issue-title">细纹状况</h4>
              <p class="issue-description">{{ fineLines.description }}</p>
            </div>
          </div>
          <div class="severity-tag lines-tag">
            <span class="severity-text">{{ fineLines.severity }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill lines-progress" 
            :style="{ width: getSeverityPercentage(fineLines.severity) + '%' }"
          ></div>
        </div>
        <p class="suggestion-text">建议使用抗氧化眼霜</p>
      </div>
      
      <!-- Sensitivity -->
      <div class="issue-item sensitivity-item">
        <div class="issue-header">
          <div class="issue-info">
            <div class="issue-icon-container sensitivity-icon-bg">
              <font-awesome-icon icon="shield-alt" class="issue-icon" />
            </div>
            <div class="issue-details">
              <h4 class="issue-title">敏感程度</h4>
              <p class="issue-description">{{ sensitivity.description }}</p>
            </div>
          </div>
          <div class="severity-tag sensitivity-tag">
            <span class="severity-text">{{ sensitivity.severity }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill sensitivity-progress" 
            :style="{ width: getSeverityPercentage(sensitivity.severity) + '%' }"
          ></div>
        </div>
        <p class="suggestion-text">建议选择温和无刺激产品</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherIssues',
  props: {
    redness: {
      type: Object,
      default: () => ({
        exists: true,
        severity: '轻度',
        description: '轻微敏感性泛红',
        distribution: ['鼻翼', '脸颊']
      })
    },
    hyperpigmentation: {
      type: Object,
      default: () => ({
        exists: true,
        severity: '轻度',
        description: '少量晒斑痘印',
        types: ['晒斑', '痘印'],
        distribution: []
      })
    },
    fineLines: {
      type: Object,
      default: () => ({
        exists: false,
        severity: '良好',
        description: '眼周轻微细纹',
        distribution: []
      })
    },
    sensitivity: {
      type: Object,
      default: () => ({
        exists: false,
        severity: '轻度',
        description: '轻度敏感肌',
        signs: []
      })
    }
  },
  methods: {
    getSeverityPercentage(severity) {
      const severityMap = {
        '无': 0,
        '良好': 15,
        '轻度': 30,
        '正常': 50,
        '中度': 60,
        '偏高': 75,
        '严重': 90
      };
      return severityMap[severity] || 0;
    }
  }
}
</script>

<style scoped>
.other-issues-card {
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

.other-issues-card::before {
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
  color: #F97316;
  margin-right: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

.analysis-tag {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.analysis-tag:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.tag-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #F97316;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.issue-item {
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid;
}

.redness-item {
  background: linear-gradient(to right, #FEF2F2, #FDF2F8);
  border-color: #FECACA;
}

.pigmentation-item {
  background: linear-gradient(to right, #FFFBEB, #FEF3C7);
  border-color: #FDE68A;
}

.lines-item {
  background: linear-gradient(to right, #F3F4F6, #E5E7EB);
  border-color: #D1D5DB;
}

.sensitivity-item {
  background: linear-gradient(to right, #EFF6FF, #DBEAFE);
  border-color: #BFDBFE;
}

.issue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.issue-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.issue-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.redness-icon-bg {
  background-color: #FECACA;
}

.pigmentation-icon-bg {
  background-color: #FDE68A;
}

.lines-icon-bg {
  background-color: #D1D5DB;
}

.sensitivity-icon-bg {
  background-color: #BFDBFE;
}

.issue-icon {
  color: #374151;
}

.issue-details {
  flex: 1;
}

.issue-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.issue-description {
  font-size: 0.75rem;
  margin: 0;
}

.redness-item .issue-description {
  color: #DC2626;
}

.pigmentation-item .issue-description {
  color: #D97706;
}

.lines-item .issue-description {
  color: #8B5CF6;
}

.sensitivity-item .issue-description {
  color: #2563EB;
}

.severity-tag {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
}

.redness-tag {
  border-color: #FECACA;
}

.pigmentation-tag {
  border-color: #FDE68A;
}

.lines-tag {
  background-color: #DCFCE7;
  border-color: #BBF7D0;
}

.sensitivity-tag {
  border-color: #BFDBFE;
}

.severity-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.redness-tag .severity-text {
  color: #DC2626;
}

.pigmentation-tag .severity-text {
  color: #D97706;
}

.lines-tag .severity-text {
  color: #16A34A;
}

.sensitivity-tag .severity-text {
  color: #2563EB;
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

.redness-progress {
  background: linear-gradient(to right, #EF4444, #EC4899);
}

.pigmentation-progress {
  background: linear-gradient(to right, #F59E0B, #F97316);
}

.lines-progress {
  background: linear-gradient(to right, #22C55E, #10B981);
}

.sensitivity-progress {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
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

.suggestion-text {
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