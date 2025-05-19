<template>
  <div class="analysis-summary">
    <div class="summary-header">
      <h3 class="summary-title">
        <font-awesome-icon :icon="['fas', 'robot']" class="summary-icon" />
        AI智能解析
      </h3>
      <div class="summary-update">
        <font-awesome-icon :icon="['fas', 'sync-alt']" class="update-icon" />
        刚刚更新
      </div>
    </div>

    <div class="summary-content">
      <!-- Efficacy Analysis -->
      <div class="analysis-card efficacy">
        <div class="card-header">
          <div class="icon-wrapper efficacy-icon">
            <font-awesome-icon :icon="['fas', 'magic']" />
          </div>
          <h4 class="card-title">功效分析</h4>
        </div>
        <ul class="analysis-list">
          <li v-for="(item, index) in analysis.efficacyAnalysis" :key="`efficacy-${index}`" class="analysis-item">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="item-icon" />
            <p class="item-text">{{ item }}</p>
          </li>
        </ul>
      </div>

      <!-- Potential Risks -->
      <div class="analysis-card risks">
        <div class="card-header">
          <div class="icon-wrapper risks-icon">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
          </div>
          <h4 class="card-title">潜在风险</h4>
        </div>
        <ul class="analysis-list">
          <li v-for="(item, index) in analysis.potentialRisks" :key="`risk-${index}`" class="analysis-item">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="item-icon" />
            <p class="item-text">{{ item }}</p>
          </li>
        </ul>
      </div>

      <!-- Recommendations -->
      <div class="analysis-card recommendations">
        <div class="card-header">
          <div class="icon-wrapper recommendations-icon">
            <font-awesome-icon :icon="['fas', 'lightbulb']" />
          </div>
          <h4 class="card-title">使用建议</h4>
        </div>
        <ul class="analysis-list">
          <li v-for="(item, index) in analysis.recommendations" :key="`recommendation-${index}`" class="analysis-item">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="item-icon" />
            <p class="item-text">{{ item }}</p>
          </li>
        </ul>
      </div>

      <!-- Overall Rating -->
      <div class="analysis-card rating">
        <div class="rating-header">
          <div class="rating-title">
            <font-awesome-icon :icon="['fas', 'star']" class="rating-icon" />
            <span>AI综合评分</span>
          </div>
          <div class="rating-score">{{ analysis.overallRating || 0 }}/5.0</div>
        </div>
        <p class="rating-summary">{{ analysis.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalysisSummary',
  props: {
    analysis: {
      type: Object,
      required: true,
      default: () => ({
        efficacyAnalysis: [
          '主要功效为温和清洁，适合日常基础清洁使用',
          '含有氨基酸表活，清洁力温和不刺激',
          '添加泛醇成分，具有一定舒缓功效'
        ],
        potentialRisks: [
          '含有少量香精，敏感肌需要注意是否耐受',
          '防腐剂浓度虽在安全范围内，但长期使用需观察'
        ],
        recommendations: [
          '建议早晚各使用一次，可搭配温水使用',
          '敏感肌第一次使用建议在小面积测试',
          '如出现不适感，建议立即停用并咨询医生'
        ],
        overallRating: 4.5,
        summary: '总体来说是一款温和的基础清洁产品，适合大多数肤质使用。敏感肌需要谨慎测试，建议从小面积开始尝试。'
      })
    }
  }
}
</script>

<style scoped>
.analysis-summary {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: #333;
}

.summary-icon {
  color: #9c27b0;
  margin-right: 0.5rem;
}

.summary-update {
  font-size: 0.75rem;
  color: #757575;
  display: flex;
  align-items: center;
}

.update-icon {
  margin-right: 0.25rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-card {
  border-radius: 12px;
  padding: 1rem;
}

.analysis-card.efficacy {
  background-color: #f3e5f5;
}

.analysis-card.risks {
  background-color: #fff8e1;
}

.analysis-card.recommendations {
  background-color: #e3f2fd;
}

.analysis-card.rating {
  background: linear-gradient(to right, #f3e5f5, #ffe0f0);
}

.card-header {
  display: flex;
  align-items: start;
  margin-bottom: 0.75rem;
}

.icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.efficacy-icon {
  background-color: #e1bee7;
  color: #8e24aa;
}

.risks-icon {
  background-color: #ffe082;
  color: #ff8f00;
}

.recommendations-icon {
  background-color: #bbdefb;
  color: #1976d2;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.analysis-card.efficacy .card-title {
  color: #6a1b9a;
}

.analysis-card.risks .card-title {
  color: #ef6c00;
}

.analysis-card.recommendations .card-title {
  color: #0d47a1;
}

.analysis-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.analysis-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.analysis-item:last-child {
  margin-bottom: 0;
}

.item-icon {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.analysis-card.efficacy .item-icon {
  color: #4caf50;
}

.analysis-card.risks .item-icon {
  color: #ff9800;
}

.analysis-card.recommendations .item-icon {
  color: #1e88e5;
}

.item-text {
  font-size: 0.875rem;
  color: #424242;
  margin: 0;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.rating-title {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.rating-icon {
  color: #fbc02d;
  margin-right: 0.5rem;
}

.rating-score {
  font-size: 1.125rem;
  font-weight: 600;
  color: #6a1b9a;
}

.rating-summary {
  font-size: 0.875rem;
  color: #424242;
  margin: 0;
  line-height: 1.5;
}
</style> 