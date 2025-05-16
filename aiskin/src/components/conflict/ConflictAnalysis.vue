<template>
  <div class="conflict-analysis">
    <!-- Analysis Results Section -->
    <div class="analysis-results">
      <div class="header">
        <h2 class="title">
          <i class="fas fa-search-plus"></i>
          检测结果
        </h2>
        <div class="update-info">
          <i class="fas fa-clock"></i>
          刚刚更新
        </div>
      </div>
      
      <!-- High Risk Conflicts -->
      <div class="conflict-section high-risk">
        <div class="risk-label">
          <span class="risk-dot"></span>
          <h3>这两个搭档会打架哦！</h3>
        </div>
        <div class="conflict-card">
          <div class="conflict-item">
            <div class="icon-container">
              <i class="fas fa-paw heartbeat"></i>
            </div>
            <div class="conflict-detail">
              <h4>维生素C + 烟酰胺</h4>
              <p>这两种成分混在一起会互相把对方吃掉喵～效果都没啦！</p>
            </div>
          </div>
          <div class="solution-box">
            <h5>猫咪建议方案：</h5>
            <div class="solution-items">
              <div class="solution-item">
                <i class="fas fa-sun"></i>
                <span>早晨：使用烟酰胺产品</span>
              </div>
              <div class="solution-item">
                <i class="fas fa-moon"></i>
                <span>晚上：使用维生素C产品</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium Risk Conflicts -->
      <div class="conflict-section medium-risk">
        <div class="risk-label">
          <span class="risk-dot"></span>
          <h3>小心它们可能有点小摩擦喵～</h3>
        </div>
        <div class="conflict-card">
          <div class="conflict-item">
            <div class="icon-container">
              <i class="fas fa-exclamation"></i>
            </div>
            <div class="conflict-detail">
              <h4>水杨酸 + AHA</h4>
              <p>同时使用这两个成分会让皮肤变得敏感，容易泛红发痒喵！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Safe Combinations -->
      <div class="conflict-section safe">
        <div class="risk-label">
          <span class="risk-dot"></span>
          <h3>这些组合很和谐喵～</h3>
        </div>
        <div class="conflict-card">
          <div class="conflict-item">
            <div class="icon-container">
              <i class="fas fa-check"></i>
            </div>
            <div class="conflict-detail">
              <h4>神经酰胺 + 玻尿酸</h4>
              <p>这两个成分是好朋友，一起使用能锁住更多水分，皮肤会很开心！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConflictAnalysis',
  props: {
    conflicts: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.conflict-analysis {
  margin-bottom: 1rem;
}

.analysis-results {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.title i {
  color: #f44336;
  margin-right: 0.5rem;
}

.update-info {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #757575;
}

.update-info i {
  margin-right: 0.25rem;
}

.conflict-section {
  margin-bottom: 1.5rem;
}

.risk-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.risk-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.high-risk .risk-dot {
  background-color: #f44336;
}

.medium-risk .risk-dot {
  background-color: #ff9800;
}

.safe .risk-dot {
  background-color: #4caf50;
}

.high-risk h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #b71c1c;
}

.medium-risk h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e65100;
}

.safe h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2e7d32;
}

.conflict-card {
  padding: 1rem;
  border-radius: 0.75rem;
  position: relative;
}

.high-risk .conflict-card {
  background-color: #ffebee;
}

.medium-risk .conflict-card {
  background-color: #fff3e0;
}

.safe .conflict-card {
  background-color: #e8f5e9;
}

.conflict-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.icon-container {
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.high-risk .icon-container {
  background-color: rgba(244, 67, 54, 0.1);
}

.high-risk .icon-container i {
  color: #f44336;
}

.medium-risk .icon-container {
  background-color: rgba(255, 152, 0, 0.1);
}

.medium-risk .icon-container i {
  color: #ff9800;
}

.safe .icon-container {
  background-color: rgba(76, 175, 80, 0.1);
}

.safe .icon-container i {
  color: #4caf50;
}

.conflict-detail h4 {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.high-risk .conflict-detail h4 {
  color: #b71c1c;
}

.medium-risk .conflict-detail h4 {
  color: #e65100;
}

.safe .conflict-detail h4 {
  color: #2e7d32;
}

.conflict-detail p {
  font-size: 0.75rem;
  color: #b71c1c;
}

.medium-risk .conflict-detail p {
  color: #e65100;
}

.safe .conflict-detail p {
  color: #2e7d32;
}

.solution-box {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.solution-box h5 {
  font-size: 0.75rem;
  font-weight: 500;
  color: #b71c1c;
  margin-bottom: 0.5rem;
}

.solution-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.solution-item {
  display: flex;
  align-items: center;
}

.solution-item i {
  width: 1rem;
  margin-right: 0.5rem;
}

.solution-item:first-child i {
  color: #ffc107;
}

.solution-item:last-child i {
  color: #2196f3;
}

.solution-item span {
  font-size: 0.75rem;
  color: #424242;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.heartbeat {
  animation: heartbeat 1s infinite;
}
</style> 