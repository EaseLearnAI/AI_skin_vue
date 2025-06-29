<template>
  <div class="achievement-badges">
    <div class="achievements-header">
      <h3 class="achievements-title">成就徽章</h3>
      <span class="achievements-count">{{ unlockedCount }}/{{ achievements.length }}</span>
    </div>
    
    <div class="achievements-grid">
      <div 
        v-for="(achievement, index) in unlockedAchievements" 
        :key="index"
        class="achievement-card"
        @click="showAchievementDetail(achievement)"
      >
        <div class="achievement-icon" :class="achievement.colorClass">
          <font-awesome-icon :icon="achievement.icon" />
        </div>
        <div class="achievement-name">{{ achievement.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AchievementBadges',
  props: {
    userStats: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      achievements: [
        {
          name: '新手上路',
          description: '完成首次皮肤分析',
          icon: ['fas', 'star'],
          colorClass: 'achievement-yellow',
          unlocked: true,
          requirement: 'skinAnalysis >= 1'
        },
        {
          name: '护肤达人',
          description: '添加10个护肤产品',
          icon: ['fas', 'heart'],
          colorClass: 'achievement-pink',
          unlocked: true,
          requirement: 'products >= 10'
        },
        {
          name: '天然主义',
          description: '使用5个天然成分产品',
          icon: ['fas', 'leaf'],
          colorClass: 'achievement-green',
          unlocked: true,
          requirement: 'naturalProducts >= 5'
        },
        {
          name: '精致生活',
          description: '坚持护肤30天',
          icon: ['fas', 'gem'],
          colorClass: 'achievement-purple',
          unlocked: true,
          requirement: 'accountAge >= 30'
        },
        {
          name: '补水专家',
          description: '使用补水产品达到15个',
          icon: ['fas', 'tint'],
          colorClass: 'achievement-blue',
          unlocked: true,
          requirement: 'hydratingProducts >= 15'
        },
        {
          name: '防晒卫士',
          description: '连续7天记录防晒',
          icon: ['fas', 'sun'],
          colorClass: 'achievement-orange',
          unlocked: true,
          requirement: 'sunscreenDays >= 7'
        },
        {
          name: '美肌魔法',
          description: '完成5次成分冲突检测',
          icon: ['fas', 'magic'],
          colorClass: 'achievement-indigo',
          unlocked: true,
          requirement: 'conflicts >= 5'
        },
        {
          name: '抗老先锋',
          description: '使用抗老产品达到8个',
          icon: ['fas', 'fire'],
          colorClass: 'achievement-red',
          unlocked: true,
          requirement: 'antiAgingProducts >= 8'
        },
        {
          name: '成分专家',
          description: '学习20种护肤成分',
          icon: ['fas', 'microscope'],
          colorClass: 'achievement-cyan',
          unlocked: false,
          requirement: 'ingredientsLearned >= 20'
        },
        {
          name: '护肤大师',
          description: '完成所有护肤挑战',
          icon: ['fas', 'trophy'],
          colorClass: 'achievement-gold',
          unlocked: false,
          requirement: 'allChallenges'
        },
        {
          name: '坚持之星',
          description: '连续使用APP 100天',
          icon: ['fas', 'calendar-check'],
          colorClass: 'achievement-emerald',
          unlocked: false,
          requirement: 'accountAge >= 100'
        },
        {
          name: '分享达人',
          description: '分享10次护肤心得',
          icon: ['fas', 'share-alt'],
          colorClass: 'achievement-lime',
          unlocked: false,
          requirement: 'shares >= 10'
        }
      ]
    }
  },
  computed: {
    unlockedCount() {
      return this.achievements.filter(achievement => achievement.unlocked).length
    },
    unlockedAchievements() {
      return this.achievements.filter(achievement => achievement.unlocked)
    }
  },
  methods: {
    showAchievementDetail(achievement) {
      this.$emit('achievement-click', achievement)
    }
  }
}
</script>

<style scoped>
.achievement-badges {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.achievements-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}

.achievements-count {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 16px 12px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  background: #fafbfc;
}

.achievement-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.achievement-card:hover .achievement-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 柔和配色方案 */
.achievement-yellow {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.achievement-pink {
  background: linear-gradient(135deg, #ec4899, #db2777);
}

.achievement-green {
  background: linear-gradient(135deg, #10b981, #059669);
}

.achievement-purple {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.achievement-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.achievement-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.achievement-indigo {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.achievement-red {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.achievement-cyan {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.achievement-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.achievement-emerald {
  background: linear-gradient(135deg, #10b981, #047857);
}

.achievement-lime {
  background: linear-gradient(135deg, #84cc16, #65a30d);
}

.achievement-name {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
  max-width: 100%;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .achievement-badges {
    margin: 16px 8px;
    padding: 20px;
  }
  
  .achievements-grid {
    gap: 12px;
  }
  
  .achievement-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .achievement-name {
    font-size: 11px;
  }
  
  .achievement-card {
    padding: 12px 8px;
  }
  
  .achievements-title {
    font-size: 16px;
  }
  
  .achievements-count {
    font-size: 12px;
    padding: 5px 10px;
  }
}

@media (max-width: 480px) {
  .achievement-badges {
    padding: 16px;
    margin: 12px 4px;
  }
  
  .achievements-grid {
    gap: 8px;
  }
  
  .achievements-title {
    font-size: 15px;
  }
  
  .achievements-count {
    font-size: 11px;
    padding: 4px 8px;
  }
  
  .achievement-icon {
    width: 36px;
    height: 36px;
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .achievement-name {
    font-size: 10px;
  }
  
  .achievement-card {
    padding: 10px 6px;
  }
}

@media (max-width: 360px) {
  .achievement-badges {
    padding: 14px;
    margin: 8px 2px;
  }
  
  .achievements-grid {
    gap: 6px;
  }
  
  .achievements-title {
    font-size: 14px;
  }
  
  .achievements-count {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .achievement-icon {
    width: 32px;
    height: 32px;
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .achievement-name {
    font-size: 9px;
  }
  
  .achievement-card {
    padding: 8px 4px;
  }
}

/* 平板横屏优化 */
@media (min-width: 768px) and (max-width: 1024px) {
  .achievements-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  
  .achievement-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}
</style> 