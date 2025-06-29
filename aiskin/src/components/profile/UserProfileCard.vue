<template>
  <div class="user-profile-card">
    <!-- 用户基本信息区域 -->
    <div class="profile-header">
      <!-- 头像 -->
      <div class="avatar-container">
        <img 
          :src="user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'" 
          :alt="user.name + '的头像'" 
          class="avatar"
          @click="$emit('avatar-click')"
        >
      </div>
      
      <!-- 用户信息 -->
      <div class="user-info">
        <!-- 用户名和等级徽章 -->
        <div class="name-badge-row">
          <h2 class="username">{{ user.name }}</h2>
          <div class="level-badge">
            <font-awesome-icon :icon="['fas', 'crown']" class="crown-icon" />
            <span class="badge-text">护肤达人</span>
          </div>
        </div>
        
        <!-- 性别信息 -->
        <div class="gender-info" v-if="user.gender">
          <div class="gender-display">
            <font-awesome-icon :icon="['fas', user.gender === 'male' ? 'mars' : 'venus']" class="gender-icon" />
            <span class="gender-text">{{ user.gender === 'male' ? '男生' : '女生' }}</span>
            <button class="edit-gender-btn" @click="$emit('edit-gender')">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
          </div>
        </div>
        
        <!-- 等级进度条 -->
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="progress-info">
            <span class="level-text">Lv.{{ userLevel }} 护肤专家</span>
            <span class="exp-text">距离下一级还需 {{ expNeeded }} 经验</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 编辑按钮 -->
    <button class="edit-btn" @click="$emit('edit-profile')">
      <font-awesome-icon :icon="['fas', 'edit']" />
      编辑资料
    </button>
    
    <!-- 统计信息卡片 -->
    <div class="stats-grid">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="stat-card"
        :class="`stat-card-${index + 1}`"
      >
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfileCard',
  props: {
    user: {
      type: Object,
      required: true
    },
    stats: {
      type: Array,
      required: true
    }
  },
  emits: ['avatar-click', 'edit-profile', 'edit-gender'],
  computed: {
    userLevel() {
      return Math.min(Math.floor(this.totalStats / 10) + 1, 99)
    },
    progressPercentage() {
      return Math.min((this.totalStats % 10) * 10, 100)
    },
    expNeeded() {
      const needed = 10 - (this.totalStats % 10)
      return needed * 25 // 每点经验25个单位
    },
    totalStats() {
      return this.stats.reduce((sum, stat) => sum + (stat.value || 0), 0)
    }
  }
}
</script>

<style scoped>
.user-profile-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.avatar-container {
  flex-shrink: 0;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.name-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.username {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
}

.level-badge {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  gap: 4px;
}

.crown-icon {
  font-size: 10px;
}

.badge-text {
  font-size: 12px;
}

.gender-info {
  margin-bottom: 12px;
}

.gender-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gender-icon {
  font-size: 12px;
  color: #6b7280;
}

.gender-text {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.edit-gender-btn {
  background: none;
  border: none;
  padding: 2px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: #6b7280;
  font-size: 10px;
  transition: color 0.2s ease;
}

.edit-gender-btn:hover {
  color: #ec4899;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  transition: width 2s ease-out;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.4;
}

.level-text {
  color: #64748b;
  font-weight: 600;
}

.exp-text {
  color: #3b82f6;
  font-weight: 600;
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  gap: 6px;
  margin-bottom: 20px;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-card-1 {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.stat-card-2 {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.stat-card-3 {
  background: linear-gradient(135deg, #fdf2f8, #fce7f3);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-card-1 .stat-value {
  color: #2563eb;
}

.stat-card-2 .stat-value {
  color: #059669;
}

.stat-card-3 .stat-value {
  color: #db2777;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  line-height: 1.2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-profile-card {
    margin: 16px 8px;
    padding: 20px;
  }
  
  .profile-header {
    gap: 12px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .level-badge {
    font-size: 11px;
    padding: 5px 10px;
  }
  
  .crown-icon {
    font-size: 9px;
  }
  
  .badge-text {
    font-size: 11px;
  }
  
  .progress-info {
    font-size: 11px;
  }
  
  .edit-btn {
    font-size: 11px;
    padding: 6px 12px;
  }
  
  .stats-grid {
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px 12px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .user-profile-card {
    padding: 16px;
    margin: 12px 4px;
  }
  
  .profile-header {
    gap: 10px;
  }
  
  .avatar {
    width: 72px;
    height: 72px;
  }
  
  .username {
    font-size: 16px;
  }
  
  .level-badge {
    font-size: 10px;
    padding: 4px 8px;
  }
  
  .crown-icon {
    font-size: 8px;
  }
  
  .badge-text {
    font-size: 10px;
  }
  
  .progress-info {
    font-size: 10px;
  }
  
  .edit-btn {
    font-size: 10px;
    padding: 5px 10px;
  }
  
  .stats-grid {
    gap: 8px;
  }
  
  .stat-card {
    padding: 14px 10px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .stat-label {
    font-size: 10px;
  }
}

@media (max-width: 360px) {
  .user-profile-card {
    padding: 14px;
    margin: 8px 2px;
  }
  
  .profile-header {
    gap: 8px;
  }
  
  .avatar {
    width: 64px;
    height: 64px;
  }
  
  .username {
    font-size: 14px;
  }
  
  .name-badge-row {
    gap: 6px;
  }
  
  .level-badge {
    font-size: 9px;
    padding: 3px 6px;
  }
  
  .crown-icon {
    font-size: 7px;
  }
  
  .badge-text {
    font-size: 9px;
  }
  
  .progress-info {
    font-size: 9px;
  }
  
  .edit-btn {
    font-size: 9px;
    padding: 4px 8px;
  }
  
  .stats-grid {
    gap: 6px;
  }
  
  .stat-card {
    padding: 12px 8px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .stat-label {
    font-size: 9px;
  }
}
</style> 