<template>
  <div class="conflict-analysis">
    <!-- Analysis Results Section -->
    <div class="analysis-results">
      <div class="header">
        <h2 class="title">
          <font-awesome-icon :icon="['fas', 'search-plus']" />
          检测结果
        </h2>
        <div class="update-info">
          <font-awesome-icon :icon="['fas', 'clock']" />
          刚刚更新
        </div>
      </div>
      
      <!-- 无冲突提示 -->
      <div v-if="!hasConflicts && safeCombo.length === 0" class="no-conflicts-banner">
        <font-awesome-icon :icon="['fas', 'smile']" />
        <p>太棒了！这些产品没有发现成分冲突，可以安心使用喵~</p>
      </div>

      <!-- 产品冲突 -->
      <div v-if="hasConflicts" class="conflict-section high-risk">
        <div class="risk-label">
          <span class="risk-dot"></span>
          <h3>这些成分会打架哦！</h3>
        </div>
        <div v-for="(conflict, index) in conflicts" :key="'conflict-'+index" class="conflict-card">
          <div class="conflict-item">
            <div class="icon-container">
              <font-awesome-icon :icon="['fas', 'paw']" class="heartbeat" />
            </div>
            <div class="conflict-detail">
              <h4>{{ formatComponents(conflict.components) }}</h4>
              <p>{{ conflict.description }}</p>
              
              <div class="risk-level">
                <span :class="[
                  'severity-badge', 
                  {'high': conflict.severity === '高', 
                   'medium': conflict.severity === '中', 
                   'low': conflict.severity === '低'}
                ]">
                  {{ conflict.severity }}度风险
                </span>
              </div>
              
              <div v-if="conflict.effects && conflict.effects.length > 0" class="effects-list">
                <div v-for="(effect, effIndex) in conflict.effects" :key="'effect-'+effIndex" class="effect-item">
                  <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
                  <span>{{ effect }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全组合 -->
      <div v-if="safeCombo.length > 0" class="conflict-section safe">
        <div class="risk-label">
          <span class="risk-dot"></span>
          <h3>这些组合很和谐喵～</h3>
        </div>
        <div v-for="(combo, index) in safeCombo" :key="'safe-'+index" class="conflict-card">
          <div class="conflict-item">
            <div class="icon-container">
              <font-awesome-icon :icon="['fas', 'check']" />
            </div>
            <div class="conflict-detail">
              <h4>{{ formatComponents(combo.components) }}</h4>
              <p>{{ combo.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用建议 -->
      <div v-if="hasRecommendations" class="recommendations-section">
        <h3 class="recommendations-title">
          <font-awesome-icon :icon="['fas', 'lightbulb']" />
          猫咪护肤建议
        </h3>

        <!-- 产品搭配建议 -->
        <div class="recommendation-group">
          <h4>产品搭配:</h4>
          
          <!-- 不能一起使用的产品 -->
          <div v-if="hasCannotUseTogether" class="recommendation-list">
            <div class="recommendation-label warning">
              <font-awesome-icon :icon="['fas', 'ban']" />
              <span>不能一起使用:</span>
            </div>
            <div v-for="(item, index) in recommendations.productPairings.cannotUseTogether" 
                 :key="'cannot-'+index" 
                 class="recommendation-item">
              <p class="product-pair">{{ formatProductPair(item.products) }}</p>
              <p class="reason">{{ item.reason }}</p>
            </div>
          </div>

          <!-- 可以一起使用的产品 -->
          <div v-if="hasCanUseTogether" class="recommendation-list">
            <div class="recommendation-label success">
              <font-awesome-icon :icon="['fas', 'check-circle']" />
              <span>可以一起使用:</span>
            </div>
            <div v-for="(item, index) in recommendations.productPairings.canUseTogether" 
                 :key="'can-'+index" 
                 class="recommendation-item">
              <p class="product-pair">{{ formatProductPair(item.products) }}</p>
              <p class="reason">{{ item.reason }}</p>
            </div>
          </div>
        </div>

        <!-- 护肤步骤建议 -->
        <div v-if="hasRoutines" class="recommendation-group">
          <h4>护肤步骤:</h4>
          
          <!-- 早晨护肤 -->
          <div v-if="hasMorningRoutine" class="routine-container">
            <div class="routine-time">
              <font-awesome-icon :icon="['fas', 'sun']" />
              <span>早晨</span>
            </div>
            <div class="routine-steps">
              <div v-for="(step, index) in recommendations.routines.morning" 
                   :key="'morning-'+index" 
                   class="routine-step">
                {{ step }}
              </div>
            </div>
          </div>

          <!-- 晚上护肤 -->
          <div v-if="hasEveningRoutine" class="routine-container">
            <div class="routine-time">
              <font-awesome-icon :icon="['fas', 'moon']" />
              <span>晚上</span>
            </div>
            <div class="routine-steps">
              <div v-for="(step, index) in recommendations.routines.evening" 
                   :key="'evening-'+index" 
                   class="routine-step">
                {{ step }}
              </div>
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
    },
    safeCombo: {
      type: Array,
      default: () => []
    },
    recommendations: {
      type: Object,
      default: () => ({
        productPairings: {
          cannotUseTogether: [],
          canUseTogether: []
        },
        routines: {
          morning: [],
          evening: []
        }
      })
    }
  },
  computed: {
    hasConflicts() {
      return this.conflicts && this.conflicts.length > 0
    },
    hasRecommendations() {
      return this.recommendations && 
        (this.hasCannotUseTogether || 
         this.hasCanUseTogether || 
         this.hasRoutines)
    },
    hasCannotUseTogether() {
      return this.recommendations.productPairings &&
        this.recommendations.productPairings.cannotUseTogether &&
        this.recommendations.productPairings.cannotUseTogether.length > 0
    },
    hasCanUseTogether() {
      return this.recommendations.productPairings &&
        this.recommendations.productPairings.canUseTogether &&
        this.recommendations.productPairings.canUseTogether.length > 0
    },
    hasRoutines() {
      return this.recommendations.routines &&
        (this.hasMorningRoutine || this.hasEveningRoutine)
    },
    hasMorningRoutine() {
      return this.recommendations.routines &&
        this.recommendations.routines.morning &&
        this.recommendations.routines.morning.length > 0
    },
    hasEveningRoutine() {
      return this.recommendations.routines &&
        this.recommendations.routines.evening &&
        this.recommendations.routines.evening.length > 0
    }
  },
  methods: {
    formatComponents(components) {
      return components && components.length > 0 
        ? components.join(' + ')
        : '未检测到成分'
    },
    formatProductPair(products) {
      return products && products.length > 0
        ? products.join(' + ')
        : '未指定产品'
    }
  }
}
</script>

<style scoped>
.conflict-analysis {
  margin-bottom: 2rem;
}

.analysis-results {
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #f8f9fa;
  transition: all 0.3s ease;
}

.analysis-results:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: #333;
}

.title i {
  color: #4caf50;
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.update-info {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #888;
  background-color: #f8f9fa;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
}

.update-info i {
  margin-right: 0.5rem;
  color: #666;
}

/* No Conflicts Banner */
.no-conflicts-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  background-color: #f1f8e9;
  border-radius: 20px;
  text-align: center;
  margin: 1rem 0;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

.no-conflicts-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15);
}

.no-conflicts-banner i {
  font-size: 2.5rem;
  color: #66bb6a;
  margin-bottom: 1rem;
}

.no-conflicts-banner p {
  color: #388e3c;
  font-weight: 500;
  font-size: 1.1rem;
  line-height: 1.5;
}

/* Conflict Sections */
.conflict-section {
  margin-bottom: 2rem;
}

.risk-label {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.risk-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.high-risk .risk-dot {
  background-color: #f44336;
}

.safe .risk-dot {
  background-color: #4caf50;
}

.high-risk h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #d32f2f;
}

.safe h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2e7d32;
}

.conflict-card {
  padding: 1.25rem;
  border-radius: 16px;
  position: relative;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.high-risk .conflict-card {
  background-color: #ffebee;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.high-risk .conflict-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(244, 67, 54, 0.1);
}

.safe .conflict-card {
  background-color: #e8f5e9;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.safe .conflict-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.1);
}

.conflict-item {
  display: flex;
  align-items: flex-start;
}

.icon-container {
  width: 3rem;
  height: 3rem;
  background-color: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.high-risk .icon-container {
  box-shadow: 0 4px 10px rgba(244, 67, 54, 0.15);
}

.high-risk .icon-container i {
  color: #f44336;
  font-size: 1.25rem;
}

.safe .icon-container {
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.15);
}

.safe .icon-container i {
  color: #4caf50;
  font-size: 1.25rem;
}

.conflict-detail {
  flex: 1;
}

.conflict-detail h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.conflict-detail p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.risk-level {
  margin-top: 0.75rem;
}

.severity-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.severity-badge.high {
  background-color: #ffebee;
  color: #d32f2f;
}

.severity-badge.medium {
  background-color: #fff8e1;
  color: #ff8f00;
}

.severity-badge.low {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.effects-list {
  margin-top: 1rem;
  background-color: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.effect-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.effect-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.effect-item i {
  color: #f44336;
  margin-right: 0.75rem;
  font-size: 0.85rem;
}

/* Recommendations Section */
.recommendations-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.recommendations-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  color: #333;
}

.recommendations-title i {
  color: #ffb300;
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.recommendation-group {
  margin-bottom: 2rem;
  background-color: #f9fafb;
  border-radius: 16px;
  padding: 1.25rem;
}

.recommendation-group h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #424242;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.recommendation-list {
  margin-bottom: 1.5rem;
}

.recommendation-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.recommendation-label.warning {
  color: #d32f2f;
}

.recommendation-label.warning i {
  color: #f44336;
}

.recommendation-label.success {
  color: #2e7d32;
}

.recommendation-label.success i {
  color: #4caf50;
}

.recommendation-label i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.recommendation-item {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.recommendation-item .product-pair {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.recommendation-item .reason {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.routine-container {
  margin-bottom: 1.5rem;
}

.routine-time {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #424242;
}

.routine-time i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.routine-time i.fa-sun {
  color: #ff9800;
}

.routine-time i.fa-moon {
  color: #5e35b1;
}

.routine-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.routine-step {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #424242;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border-left: 3px solid #9c27b0;
}

.routine-step:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.heartbeat {
  animation: heartbeat 1.5s infinite;
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .conflict-item {
    flex-direction: column;
  }
  
  .icon-container {
    margin-bottom: 1rem;
    margin-right: 0;
  }
  
  .conflict-detail h4 {
    text-align: center;
  }
  
  .recommendations-section {
    padding-top: 1rem;
  }
  
  .recommendation-group {
    padding: 1rem;
  }
}
</style> 