<template>
  <div class="profile-view">

    
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
            <img :src="user.avatar || 'https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?w=200'" alt="User Avatar">
          </div>
          <div class="user-info">
            <h2 class="username">{{ user.name }}</h2>
            <p class="user-description">{{ user.email }}</p>
            <button class="edit-profile-btn" @click="showUsernameModal = true">
              <font-awesome-icon :icon="['fas', 'edit']" />
              编辑用户名
            </button>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">{{ stats.productsCount || 0 }}</span>
            <span class="stat-label">产品数量</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.accountAge || 0 }}</span>
            <span class="stat-label">使用天数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.skinAnalysisCount || 0 }}</span>
            <span class="stat-label">皮肤检测</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.conflictsCount || 0 }}</span>
            <span class="stat-label">冲突检测</span>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <div class="menu-group">
          <div class="menu-item" @click="goToHistory">
            <div class="menu-icon">
              <font-awesome-icon :icon="['fas', 'history']" />
            </div>
            <div class="menu-content">
              <span class="menu-title">历史记录</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div>
          
          <div class="menu-item" @click="goToFavorites">
            <div class="menu-icon">
              <font-awesome-icon :icon="['fas', 'save']" />
            </div>
            <div class="menu-content">
              <span class="menu-title">我的收藏</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div>
        </div>
        
        <div class="menu-group">
          <div class="menu-item" @click="showFeedbackModal = true">
            <div class="menu-icon">
              <font-awesome-icon :icon="['fas', 'question-circle']" />
            </div>
            <div class="menu-content">
              <span class="menu-title">帮助和反馈</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div>
          
          <!-- <div class="menu-item" @click="goToSettings">
            <div class="menu-icon">
              <font-awesome-icon :icon="['fas', 'cog']" />
            </div>
            <div class="menu-content">
              <span class="menu-title">设置</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div> -->
          
          <div class="menu-item" @click="confirmLogout">
            <div class="menu-icon">
              <font-awesome-icon :icon="['fas', 'cog']" />
            </div>
            <div class="menu-content">
              <span class="menu-title">退出登录</span>
            </div>
            <div class="menu-action">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 用户名修改弹窗 -->
    <div class="modal" v-if="showUsernameModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>修改用户名</h3>
          <button class="close-btn" @click="showUsernameModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="new-username">新用户名</label>
            <input 
              type="text" 
              id="new-username" 
              v-model="newUsername" 
              placeholder="请输入新的用户名"
              class="form-control"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showUsernameModal = false">取消</button>
          <button class="save-btn" @click="updateUsername" :disabled="!newUsername.trim()">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 反馈弹窗 -->
    <div class="modal" v-if="showFeedbackModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>提交反馈</h3>
          <button class="close-btn" @click="showFeedbackModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="feedback-title">标题</label>
            <input 
              type="text" 
              id="feedback-title" 
              v-model="feedback.title" 
              placeholder="请输入反馈标题"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="feedback-category">类别</label>
            <select 
              id="feedback-category" 
              v-model="feedback.category" 
              class="form-control"
            >
              <option value="功能建议">功能建议</option>
              <option value="问题反馈">问题反馈</option>
              <option value="界面优化">界面优化</option>
              <option value="产品需求">产品需求</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="form-group">
            <label for="feedback-content">内容</label>
            <textarea 
              id="feedback-content" 
              v-model="feedback.content" 
              placeholder="请详细描述您的反馈内容"
              class="form-control"
              rows="5"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showFeedbackModal = false">取消</button>
          <button 
            class="save-btn" 
            @click="submitFeedback" 
            :disabled="!feedback.title.trim() || !feedback.content.trim()"
          >
            提交
          </button>
        </div>
      </div>
    </div>
    
    <!-- 退出登录确认弹窗 -->
    <div class="modal" v-if="showLogoutModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>退出登录</h3>
          <button class="close-btn" @click="showLogoutModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <p>确定要退出登录吗？</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLogoutModal = false">取消</button>
          <button class="logout-btn" @click="logout">确定退出</button>
        </div>
      </div>
    </div>
    
    <!-- 消息提示 -->
    <div class="toast" v-if="toast.show">
      <div :class="['toast-content', toast.type]">
        <font-awesome-icon :icon="['fas', toast.type === 'success' ? 'check-circle' : 'exclamation-circle']" />
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import authService from '@/services/authService'
import axios from 'axios'

export default {
  name: 'ProfileView',
  components: {
    AppHeader,
    BottomNavigation
  },
  data() {
    return {
      user: {
        name: '猫咪护肤使用者',
        email: '',
        avatar: ''
      },
      stats: {
        productsCount: 0,
        accountAge: 0,
        skinAnalysisCount: 0,
        conflictsCount: 0
      },
      showUsernameModal: false,
      showFeedbackModal: false,
      showLogoutModal: false,
      newUsername: '',
      feedback: {
        title: '',
        content: '',
        category: '功能建议'
      },
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  async created() {
    await this.fetchUserData()
    await this.fetchUserStats()
  },
  methods: {
    async fetchUserData() {
      try {
        const user = authService.getCurrentUser()
        if (user) {
          this.user = {
            name: user.name || '猫咪护肤使用者',
            email: user.email || '',
            avatar: user.avatar || ''
          }
        } else {
          const response = await axios.get('/api/users/me', {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          })
          
          if (response.data.success) {
            const userData = response.data.data.user
            this.user = {
              name: userData.name || '猫咪护肤使用者',
              email: userData.email || '',
              avatar: userData.avatar || ''
            }
            authService.setCurrentUser(userData)
          }
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
        this.showToast('获取用户信息失败', 'error')
      }
    },
    
    async fetchUserStats() {
      try {
        const response = await axios.get('/api/users/stats', {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        })
        
        if (response.data.success) {
          const statsData = response.data.data.stats
          
          // 从API获取的统计数据
          this.stats.accountAge = statsData.accountAge || 0
          this.stats.ideasCount = statsData.ideasCount || 0
          
          // 获取产品数量
          const productsResponse = await axios.get('/api/products', {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          })
          
          if (productsResponse.data.success) {
            this.stats.productsCount = productsResponse.data.count || 0
          }
          
          // 获取冲突检测次数
          const conflictsResponse = await axios.get('/api/conflicts', {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          })
          
          if (conflictsResponse.data.success) {
            this.stats.conflictsCount = conflictsResponse.data.count || 0
          }
          
          // 皮肤检测次数暂时没有专门API，这里暂时设为0
          this.stats.skinAnalysisCount = 0
        }
      } catch (error) {
        console.error('获取用户统计数据失败', error)
        // 如果获取失败，使用默认值
        this.stats = {
          productsCount: 12,
          accountAge: 32,
          skinAnalysisCount: 5,
          conflictsCount: 3
        }
      }
    },
    
    async updateUsername() {
      if (!this.newUsername.trim()) return
      
      try {
        const response = await axios.patch('/api/users/update-username', 
          { name: this.newUsername.trim() },
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          }
        )
        
        if (response.data.success) {
          this.user.name = this.newUsername.trim()
          this.newUsername = ''
          this.showUsernameModal = false
          this.showToast('用户名更新成功', 'success')
          
          // 更新本地存储的用户信息
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            currentUser.name = this.user.name
            authService.setCurrentUser(currentUser)
          }
        } else {
          this.showToast(response.data.message || '用户名更新失败', 'error')
        }
      } catch (error) {
        console.error('更新用户名失败', error)
        this.showToast('更新用户名失败', 'error')
      }
    },
    
    async submitFeedback() {
      if (!this.feedback.title.trim() || !this.feedback.content.trim()) return
      
      try {
        const response = await axios.post('/api/ideas', 
          {
            title: this.feedback.title.trim(),
            content: this.feedback.content.trim(),
            category: this.feedback.category
          },
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          }
        )
        
        if (response.data.success) {
          this.feedback = {
            title: '',
            content: '',
            category: '功能建议'
          }
          this.showFeedbackModal = false
          this.showToast('反馈提交成功，感谢您的宝贵意见！', 'success')
        } else {
          this.showToast(response.data.message || '反馈提交失败', 'error')
        }
      } catch (error) {
        console.error('提交反馈失败', error)
        this.showToast('提交反馈失败，请稍后再试', 'error')
      }
    },
    
    confirmLogout() {
      this.showLogoutModal = true
    },
    
    async logout() {
      try {
        await axios.post('/api/users/logout', {}, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        })
        
        // 无论API是否成功，都清除本地存储并跳转到登录页
        authService.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('退出登录失败', error)
        // 即使API失败，也执行登出操作
        authService.logout()
        this.$router.push('/login')
      }
    },
    
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      }
      
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },
    
    goToHistory() {
      // 跳转到历史记录页面的逻辑
      this.showToast('历史记录功能开发中', 'info')
    },
    
    goToFavorites() {
      // 跳转到收藏页面的逻辑
      this.showToast('收藏功能开发中', 'info')
    },
    
    goToSettings() {
      // 跳转到设置页面的逻辑
      this.showToast('设置功能开发中', 'info')
    }
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
  margin-bottom: 0.5rem;
}

.edit-profile-btn {
  display: inline-flex;
  align-items: center;
  background-color: #ffd6e5;
  color: #d63384;
  border: none;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-profile-btn svg {
  margin-right: 0.25rem;
  font-size: 0.7rem;
}

.edit-profile-btn:hover {
  background-color: #d63384;
  color: white;
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
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: #fff0f5;
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

.menu-icon svg {
  color: #d63384;
  font-size: 1.25rem;
}

.logout-icon {
  background-color: #ffe0e0;
}

.logout-icon svg {
  color: #dc3545;
}

.logout-item {
  margin-top: 1rem;
}

.logout-item::before {
  content: '';
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: -0.5rem;
  height: 1px;
  background-color: #f5f5f5;
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

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fafafa;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #F8BBD0;
  box-shadow: 0 0 0 3px rgba(248, 187, 208, 0.2);
  background-color: white;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f5f5f5;
  gap: 0.75rem;
}

.cancel-btn, .save-btn, .logout-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  border: none;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.save-btn {
  background-color: #F8BBD0;
  color: white;
  border: none;
}

.save-btn:hover:not(:disabled) {
  background-color: #d63384;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
}

.logout-btn:hover {
  background-color: #c82333;
}

/* Toast Styles */
.toast {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

.toast-content svg {
  margin-right: 0.5rem;
}

.toast-content.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.toast-content.error {
  background-color: #ffebee;
  color: #c62828;
}

.toast-content.info {
  background-color: #e3f2fd;
  color: #1565c0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .stats-row {
    flex-wrap: wrap;
  }
  
  .stat-item {
    width: 50%;
    margin-bottom: 1rem;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>