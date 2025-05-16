<template>
  <div class="profile-view">
    <StatusBar />
    
    <AppHeader 
      title="个人中心" 
      icon="user" 
      right-icon="cog"
      bg-color="bg-sakura"
    />

    <main class="main-content">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <img src="https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?w=200" alt="User Avatar">
          </div>
          <div class="user-info">
            <h2 class="username">猫咪护肤使用者</h2>
            <p class="user-description">喵喵喵～爱护肤爱生活</p>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">12</span>
            <span class="stat-label">产品数量</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">32</span>
            <span class="stat-label">使用天数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">5</span>
            <span class="stat-label">皮肤检测</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <div class="menu-group">
          <div class="menu-item">
            <div class="menu-icon">
              <font-awesome-icon icon="history" />
            </div>
            <div class="menu-content">
              <span class="menu-title">历史记录</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon icon="chevron-right" />
            </div>
          </div>
          
          <div class="menu-item">
            <div class="menu-icon">
              <font-awesome-icon icon="save" />
            </div>
            <div class="menu-content">
              <span class="menu-title">我的收藏</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon icon="chevron-right" />
            </div>
          </div>
        </div>
        
        <div class="menu-group">
          <div class="menu-item">
            <div class="menu-icon">
              <font-awesome-icon icon="question-circle" />
            </div>
            <div class="menu-content">
              <span class="menu-title">帮助和反馈</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon icon="chevron-right" />
            </div>
          </div>
          
          <div class="menu-item">
            <div class="menu-icon">
              <font-awesome-icon icon="cog" />
            </div>
            <div class="menu-content">
              <span class="menu-title">设置</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon icon="chevron-right" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavigation />
  </div>
</template>

<script>
import StatusBar from '@/components/common/StatusBar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'

export default {
  name: 'ProfileView',
  components: {
    StatusBar,
    AppHeader,
    BottomNavigation
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}

.profile-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-description {
  font-size: 0.875rem;
  color: #757575;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #F8BBD0;
}

.stat-label {
  font-size: 0.75rem;
  color: #757575;
  margin-top: 0.25rem;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-group {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  position: relative;
}

.menu-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0;
  height: 1px;
  background-color: #f5f5f5;
}

.menu-icon {
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

.menu-icon i {
  color: white;
  font-size: 1.25rem;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.menu-action {
  color: #bdbdbd;
}
</style> 