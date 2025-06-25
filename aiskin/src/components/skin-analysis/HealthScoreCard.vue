<template>
  <div class="health-score-card">
    <div class="score-header">
      <div class="score-info">
        <h2 class="score-title">
          <font-awesome-icon icon="sparkles" class="title-icon" />
          AI肌肤健康评分
        </h2>
        <p class="score-subtitle">基于深度学习智能分析</p>
      </div>
      <div class="score-circle-container">
        <svg class="progress-ring" width="96" height="96">
          <circle stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="transparent" r="42" cx="48" cy="48"/>
          <circle 
            ref="healthScoreCircle" 
            stroke="#ffffff" 
            stroke-width="4" 
            fill="transparent" 
            r="42" 
            cx="48" 
            cy="48"
            :stroke-dasharray="circleCircumference" 
            :stroke-dashoffset="circleProgress"
            class="progress-circle"
          />
        </svg>
        <div class="score-display">
          <span class="score-number">{{ animatedScore }}</span>
          <span class="score-unit">分</span>
        </div>
      </div>
    </div>
    
    <div class="score-details">
      <div class="score-rating">
        <span class="rating-label">健康等级:</span>
        <div class="rating-container">
          <span :class="['rating-text', getRatingClass()]">{{ getRatingText() }}</span>
          <div class="rating-stars">
            <span 
              v-for="star in 5" 
              :key="star"
              :class="['star', star <= getStarRating() ? 'active' : 'inactive']"
            >
              ★
            </span>
          </div>
        </div>
      </div>
      
      <div class="achievement-badge">
        <div class="badge-content">
          <font-awesome-icon icon="award" class="badge-icon" />
          <span class="badge-text">{{ getAchievementText() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HealthScoreCard',
  props: {
    score: {
      type: Number,
      default: 85
    }
  },
  data() {
    return {
      animatedScore: 0
    }
  },
  computed: {
    circleCircumference() {
      return 2 * Math.PI * 42; // r = 42
    },
    circleProgress() {
      const progressPercent = this.animatedScore / 100;
      return this.circleCircumference * (1 - progressPercent);
    }
  },
  mounted() {
    this.animateScore();
  },
  methods: {
    animateScore() {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const startScore = 0;
      const endScore = this.score;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用 easeOutCubic 缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        this.animatedScore = Math.floor(startScore + (endScore - startScore) * easeOutCubic);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.animatedScore = endScore;
        }
      };
      
      requestAnimationFrame(animate);
    },
    getRatingText() {
      if (this.score >= 90) return '优秀';
      if (this.score >= 80) return '良好';
      if (this.score >= 70) return '一般';
      if (this.score >= 60) return '尚可';
      return '需改善';
    },
    getRatingClass() {
      if (this.score >= 90) return 'excellent';
      if (this.score >= 80) return 'good';
      if (this.score >= 70) return 'average';
      if (this.score >= 60) return 'fair';
      return 'poor';
    },
    getStarRating() {
      return Math.ceil(this.score / 20);
    },
    getAchievementText() {
      if (this.score >= 90) return '肌肤状态极佳，继续保持！';
      if (this.score >= 80) return '肌肤状态良好，小有成就！';
      if (this.score >= 70) return '肌肤状态正常，继续努力！';
      if (this.score >= 60) return '肌肤有改善空间，加油！';
      return '需要更多护理，不要放弃！';
    }
  }
}
</script>

<style scoped>
.health-score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: fadeInUp 0.6s ease-out;
}

.health-score-card::before {
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

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.score-info {
  flex: 1;
}

.score-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 0.75rem;
  animation: sparkle 2s ease-in-out infinite;
}

.score-subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.score-circle-container {
  position: relative;
  width: 6rem;
  height: 6rem;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1);
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.score-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.score-unit {
  font-size: 0.875rem;
  opacity: 0.8;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.score-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-text {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.rating-text.excellent {
  background: rgba(34, 197, 94, 0.3);
}

.rating-text.good {
  background: rgba(59, 130, 246, 0.3);
}

.rating-text.average {
  background: rgba(245, 158, 11, 0.3);
}

.rating-text.fair {
  background: rgba(249, 115, 22, 0.3);
}

.rating-text.poor {
  background: rgba(239, 68, 68, 0.3);
}

.rating-stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.star.active {
  color: #FCD34D;
  text-shadow: 0 0 8px rgba(252, 211, 77, 0.8);
}

.star.inactive {
  color: rgba(255, 255, 255, 0.3);
}

.achievement-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-icon {
  color: #FCD34D;
  font-size: 1rem;
  animation: pulse 2s infinite;
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.9;
}

@keyframes sparkle {
  0%, 100% { 
    transform: rotate(0deg) scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: rotate(180deg) scale(1.1);
    filter: brightness(1.3);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
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