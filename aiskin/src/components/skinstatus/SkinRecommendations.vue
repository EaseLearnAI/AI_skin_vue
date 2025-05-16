<template>
  <div class="skin-recommendations">
    <h2 class="section-title">
      <span class="icon">🐱</span>
      猫咪的护理建议
    </h2>
    <div class="recommendations-list">
      <!-- Priority Recommendation -->
      <div class="recommendation-card priority">
        <div class="recommendation-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="recommendation-content">
          <div class="recommendation-header">
            <h3 class="recommendation-title">加强保湿防护</h3>
            <span class="priority-tag">优先级高</span>
          </div>
          <p class="recommendation-description">建议使用含玻尿酸的保湿精华，提升肌肤水润度</p>
          <div class="recommendation-footer">
            <div class="timing">
              <i class="fas fa-clock"></i>
              建议立即使用
            </div>
            <button class="show-products">
              查看推荐产品
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Regular Recommendations -->
      <div class="recommendation-card" v-for="(rec, index) in recommendations" :key="index">
        <div class="recommendation-icon">
          <i :class="['fas', `fa-${rec.icon}`]"></i>
        </div>
        <div class="recommendation-content">
          <h3 class="recommendation-title">{{ rec.title }}</h3>
          <p class="recommendation-description">{{ rec.description }}</p>
        </div>
        <button class="action-button">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinRecommendations',
  props: {
    recommendations: {
      type: Array,
      default: () => [
        {
          title: '防晒提醒',
          description: '今日紫外线较强，记得涂防晒喵～',
          icon: 'sun'
        },
        {
          title: '护理时间表',
          description: '查看今日护理时间安排',
          icon: 'clock'
        }
      ]
    }
  }
}
</script>

<style scoped>
.skin-recommendations {
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

.icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #fff9fb;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-card.priority {
  background-color: #fff9fb;
  padding: 1rem;
  background: linear-gradient(to right, #fce4ec, #f3e5f5);
}

.recommendation-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #ffd6e5;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.recommendation-icon i {
  color: white;
  font-size: 1.25rem;
}

.recommendation-content {
  flex: 1;
}

.recommendation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.recommendation-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.priority-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #ffd6e5;
  color: #ad1457;
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
}

.priority-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.recommendation-description {
  font-size: 0.75rem;
  color: #616161;
  margin-bottom: 0.5rem;
}

.recommendation-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
}

.timing {
  display: flex;
  align-items: center;
  color: #F8BBD0;
}

.timing i {
  margin-right: 0.25rem;
}

.show-products {
  display: flex;
  align-items: center;
  color: #F8BBD0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 0.75rem;
}

.show-products i {
  margin-left: 0.25rem;
}

.action-button {
  color: #F8BBD0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}
</style> 