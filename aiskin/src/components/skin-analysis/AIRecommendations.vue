<template>
  <div class="ai-recommendations-card">
    <div class="card-header">
      <h3 class="card-title">
        <font-awesome-icon icon="brain" class="title-icon" />
        AI智能护肤建议
      </h3>
      <div class="personalized-tag">
        <span class="tag-text">个性化定制</span>
      </div>
    </div>
    
    <div class="recommendations-list">
      <div 
        v-for="(recommendation, index) in recommendationCards" 
        :key="index"
        :class="['recommendation-card', recommendation.bgClass]"
      >
        <div :class="['decoration-circle', recommendation.decorationClass]"></div>
        <div class="card-content">
          <h4 class="recommendation-title">
            <div :class="['icon-container', recommendation.iconBgClass]">
              <font-awesome-icon :icon="recommendation.icon" class="rec-icon" />
            </div>
            {{ recommendation.title }}
          </h4>
          <p class="recommendation-description">{{ recommendation.description }}</p>
          <div class="tags-container">
            <span 
              v-for="tag in recommendation.tags" 
              :key="tag"
              :class="['tag', recommendation.tagClass]"
            >
              {{ tag }}
            </span>
          </div>
          <div :class="['info-container', recommendation.infoClass]">
            <font-awesome-icon :icon="recommendation.infoIcon" class="info-icon" />
            <span class="info-text">{{ recommendation.info }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIRecommendations',
  props: {
    recommendations: {
      type: Array,
      default: () => [
        '使用温和氨基酸洁面产品早晚清洁',
        '每周1-2次化学去角质（如水杨酸棉片）疏通毛孔',
        '选择含烟酰胺成分的保湿霜平衡水油',
        '每日使用SPF30+广谱防晒霜'
      ]
    }
  },
  computed: {
    recommendationCards() {
      return [
        {
          title: '清洁护理方案',
          description: '基于您的混合偏油性肌肤特点，建议使用温和的氨基酸洁面乳，早晚各一次，避免过度清洁导致水油失衡。',
          tags: ['氨基酸洁面', '温和清洁', 'pH平衡'],
          info: '建议使用频率：早晚各1次',
          icon: 'droplet',
          iconBgClass: 'blue-icon',
          bgClass: 'blue-bg',
          decorationClass: 'blue-decoration',
          tagClass: 'blue-tag',
          infoClass: 'blue-info',
          infoIcon: 'clock'
        },
        {
          title: '控油平衡护理',
          description: '针对T区油脂分泌旺盛的问题，推荐使用含2%水杨酸的爽肤水，有效疏通毛孔，控制油脂分泌。',
          tags: ['2%水杨酸', '控油平衡', '疏通毛孔'],
          info: '重点区域：T区（额头、鼻翼、下巴）',
          icon: 'leaf',
          iconBgClass: 'emerald-icon',
          bgClass: 'emerald-bg',
          decorationClass: 'emerald-decoration',
          tagClass: 'emerald-tag',
          infoClass: 'emerald-info',
          infoIcon: 'map-marker-alt'
        },
        {
          title: '防晒保护计划',
          description: '每日使用SPF30+广谱防晒霜，预防紫外线损伤和色素沉着，特别注意补涂频率。',
          tags: ['SPF30+', '广谱防护', '抗氧化'],
          info: '建议每2-3小时补涂一次',
          icon: 'sun',
          iconBgClass: 'amber-icon',
          bgClass: 'amber-bg',
          decorationClass: 'amber-decoration',
          tagClass: 'amber-tag',
          infoClass: 'amber-info',
          infoIcon: 'redo'
        },
        {
          title: '保湿修护建议',
          description: 'U区使用含透明质酸的保湿精华，维持肌肤水油平衡，避免外油内干的情况。',
          tags: ['透明质酸', '深层保湿', '水油平衡'],
          info: '重点护理：U区（两颊、眼周）',
          icon: 'heart',
          iconBgClass: 'purple-icon',
          bgClass: 'purple-bg',
          decorationClass: 'purple-decoration',
          tagClass: 'purple-tag',
          infoClass: 'purple-info',
          infoIcon: 'tint'
        }
      ];
    }
  }
}
</script>

<style scoped>
.ai-recommendations-card {
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

.ai-recommendations-card::before {
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
  color: #3B82F6;
  margin-right: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

.personalized-tag {
  background: linear-gradient(to right, #DBEAFE, #EDE9FE);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
}

.tag-text {
  font-size: 0.75rem;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.recommendation-card {
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid;
  position: relative;
  overflow: hidden;
}

.blue-bg {
  background: linear-gradient(135deg, #EFF6FF, #F0F9FF);
  border-color: #BFDBFE;
}

.emerald-bg {
  background: linear-gradient(135deg, #ECFDF5, #F0FDF4);
  border-color: #A7F3D0;
}

.amber-bg {
  background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
  border-color: #FDE68A;
}

.purple-bg {
  background: linear-gradient(135deg, #F3F4F6, #FAF5FF);
  border-color: #DDD6FE;
}

.decoration-circle {
  position: absolute;
  top: 0;
  right: 0;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  opacity: 0.2;
  margin-top: -2.5rem;
  margin-right: -2.5rem;
}

.blue-decoration {
  background-color: #BFDBFE;
}

.emerald-decoration {
  background-color: #A7F3D0;
}

.amber-decoration {
  background-color: #FDE68A;
}

.purple-decoration {
  background-color: #DDD6FE;
}

.card-content {
  position: relative;
  z-index: 10;
}

.recommendation-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
}

.icon-container {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.blue-icon {
  background-color: #3B82F6;
}

.emerald-icon {
  background-color: #10B981;
}

.amber-icon {
  background-color: #F59E0B;
}

.purple-icon {
  background-color: #8B5CF6;
}

.rec-icon {
  color: white;
  font-size: 0.875rem;
}

.recommendation-description {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 50px;
  font-weight: 500;
  border: 1px solid;
}

.blue-tag {
  background-color: #DBEAFE;
  color: #1D4ED8;
  border-color: #BFDBFE;
}

.emerald-tag {
  background-color: #D1FAE5;
  color: #047857;
  border-color: #A7F3D0;
}

.amber-tag {
  background-color: #FDE68A;
  color: #92400E;
  border-color: #F59E0B;
}

.purple-tag {
  background-color: #E9D5FF;
  color: #7C3AED;
  border-color: #C4B5FD;
}

.info-container {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.blue-info {
  color: #1E40AF;
}

.emerald-info {
  color: #047857;
}

.amber-info {
  color: #92400E;
}

.purple-info {
  color: #7C3AED;
}

.info-icon {
  margin-right: 0.5rem;
}

.info-text {
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