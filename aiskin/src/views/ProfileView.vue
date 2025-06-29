<template>
  <div class="profile-view">
    <AppHeader 
      title="我的护肤档案" 
      icon="user-circle" 
      right-icon="cog"
      bg-color="bg-gradient"
    />

    <main class="main-content">
      <!-- 用户资料卡片 -->
      <UserProfileCard 
        :user="user"
        :stats="statsArray"
        @avatar-click="handleAvatarClick"
        @edit-profile="showUsernameModal = true"
        @edit-gender="handleEditGender"
      />
      
      <!-- 成就徽章 -->
      <AchievementBadges 
        :user-stats="stats"
        @achievement-click="handleAchievementClick"
      />
      
      <!-- 设置菜单 -->
      <SettingsMenu 
        @menu-click="handleMenuClick"
      />
    </main>

    <!-- 用户名修改弹窗 -->
    <div class="modal-overlay" v-if="showUsernameModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">修改用户名</h3>
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
          <button 
            class="save-btn" 
            @click="updateUsername" 
            :disabled="!newUsername.trim()"
          >
            保存
          </button>
        </div>
      </div>
    </div>
    
    <!-- 性别修改弹窗 -->
    <div class="modal-overlay" v-if="showGenderModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">修改性别</h3>
          <button class="close-btn" @click="showGenderModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>选择性别</label>
            <div class="gender-selection">
              <div class="gender-option" :class="{ 'selected': newGender === 'male' }" @click="selectGender('male')">
                <font-awesome-icon :icon="['fas', 'mars']" />
                <span>男生</span>
              </div>
              <div class="gender-option" :class="{ 'selected': newGender === 'female' }" @click="selectGender('female')">
                <font-awesome-icon :icon="['fas', 'venus']" />
                <span>女生</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showGenderModal = false">取消</button>
          <button 
            class="save-btn" 
            @click="updateGender" 
            :disabled="!newGender"
          >
            保存
          </button>
        </div>
      </div>
    </div>
    
    <!-- 反馈弹窗 -->
    <div class="modal-overlay" v-if="showFeedbackModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">提交反馈</h3>
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
    <div class="modal-overlay" v-if="showLogoutModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">退出登录</h3>
          <button class="close-btn" @click="showLogoutModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        <div class="modal-body">
          <div class="logout-confirmation">
            <div class="logout-icon">
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
            </div>
            <p>确定要退出登录吗？</p>
            <p class="logout-hint">退出后需要重新登录才能使用完整功能</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLogoutModal = false">取消</button>
          <button class="logout-btn" @click="logout">确定退出</button>
        </div>
      </div>
    </div>
    
    <!-- 消息提示 -->
    <div class="toast-container" v-if="toast.show">
      <div class="toast" :class="toast.type">
        <div class="toast-icon">
          <font-awesome-icon :icon="['fas', toast.type === 'success' ? 'check-circle' : 'exclamation-circle']" />
        </div>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>

    <BottomNavigation />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import UserProfileCard from '@/components/profile/UserProfileCard.vue'
import AchievementBadges from '@/components/profile/AchievementBadges.vue'
import SettingsMenu from '@/components/profile/SettingsMenu.vue'
import authService from '@/services/authService'
import axios from 'axios'

export default {
  name: 'ProfileView',
  components: {
    AppHeader,
    BottomNavigation,
    UserProfileCard,
    AchievementBadges,
    SettingsMenu
  },
  data() {
    return {
      user: {
        name: '猫咪护肤使用者',
        email: '',
        avatar: '',
        gender: ''
      },
      stats: {
        productsCount: 0,
        accountAge: 0,
        skinAnalysisCount: 0,
        conflictsCount: 0
      },
      showUsernameModal: false,
      showGenderModal: false,
      showFeedbackModal: false,
      showLogoutModal: false,
      newUsername: '',
      newGender: '',
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
  computed: {
    statsArray() {
      return [
        { label: '已用产品', value: this.stats.productsCount || 28 },
        { label: '护肤天数', value: this.stats.accountAge || 15 },
        { label: '皮肤检测', value: this.stats.skinAnalysisCount || 8 }
      ]
    }
  },
  async created() {
    await this.fetchUserData()
    await this.fetchUserStats()
    this.addPageLoadAnimation()
  },
  methods: {
    async fetchUserData() {
      try {
        const user = authService.getCurrentUser()
        if (user) {
          this.user = {
            name: user.name || '猫咪护肤使用者',
            email: user.email || user.phone || '',
            avatar: user.avatar || '',
            gender: user.gender || ''
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
              email: userData.email || userData.phone || '',
              avatar: userData.avatar || '',
              gender: userData.gender || ''
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
          
          this.stats.skinAnalysisCount = 0
        }
      } catch (error) {
        console.error('获取用户统计数据失败', error)
        // 使用默认值
        this.stats = {
          productsCount: 28,
          accountAge: 15,
          skinAnalysisCount: 8,
          conflictsCount: 3
        }
      }
    },
    
    handleMenuClick(action) {
      switch (action) {
        case 'history':
          this.goToHistory()
          break
        case 'favorites':
          this.goToFavorites()
          break
        case 'notifications':
          this.showToast('通知设置功能开发中', 'info')
          break
        case 'theme':
          this.showToast('主题设置功能开发中', 'info')
          break
        case 'privacy':
          this.showToast('隐私设置功能开发中', 'info')
          break
        case 'feedback':
          this.showFeedbackModal = true
          break
        case 'about':
          this.showToast('关于我们功能开发中', 'info')
          break
        case 'logout':
          this.confirmLogout()
          break
        default:
          break
      }
    },
    
    handleAvatarClick() {
      this.showToast('头像点击效果', 'info')
    },
    
    handleAchievementClick(achievement) {
      this.showToast(`点击了成就：${achievement.name}`, 'info')
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
        
        authService.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('退出登录失败', error)
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
    
    closeModal() {
      this.showUsernameModal = false
      this.showGenderModal = false
      this.showFeedbackModal = false
      this.showLogoutModal = false
    },
    
    goToHistory() {
      this.showToast('历史记录功能开发中', 'info')
    },
    
    goToFavorites() {
      this.showToast('收藏功能开发中', 'info')
    },
    
    addPageLoadAnimation() {
      // 添加页面加载动画效果
      this.$nextTick(() => {
        const elements = document.querySelectorAll('.user-profile-card, .achievement-badges, .settings-menu')
        elements.forEach((el, index) => {
          el.style.opacity = '0'
          el.style.transform = 'translateY(20px)'
          setTimeout(() => {
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, index * 150)
        })
      })
    },
    
    selectGender(gender) {
      this.newGender = gender
    },
    
    async updateGender() {
      if (!this.newGender) return
      
      try {
        const response = await axios.patch('/api/users/update-gender', 
          { gender: this.newGender },
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`
            }
          }
        )
        
        if (response.data.success) {
          this.user.gender = this.newGender
          this.newGender = ''
          this.showGenderModal = false
          this.showToast('性别更新成功', 'success')
          
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            currentUser.gender = this.user.gender
            authService.setCurrentUser(currentUser)
          }
        } else {
          this.showToast(response.data.message || '性别更新失败', 'error')
        }
      } catch (error) {
        console.error('更新性别失败', error)
        this.showToast('更新性别失败', 'error')
      }
    },
    
    handleEditGender() {
      this.newGender = this.user.gender || ''
      this.showGenderModal = true
    }
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 5rem;
  position: relative;
}

.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 120px);
  border-radius: 24px 24px 0 0;
  margin-top: 1rem;
  padding-top: 0.5rem;
  overflow-y: auto;
}

/* 模态框样式 */
.modal-overlay {
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
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: white;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #1f2937;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background-color: white;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.logout-confirmation {
  text-align: center;
  padding: 1rem 0;
}

.logout-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

.logout-confirmation p {
  margin: 0.5rem 0;
  color: #374151;
}

.logout-hint {
  font-size: 0.875rem;
  color: #6b7280 !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  gap: 0.75rem;
  background-color: #f9fafb;
}

.cancel-btn, .save-btn, .logout-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #6b7280;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Toast 样式 */
.toast-container {
  position: fixed;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
}

.toast {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: toastSlideUp 0.3s ease-out;
  min-width: 300px;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast.success .toast-icon {
  color: #10b981;
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast.info .toast-icon {
  color: #3b82f6;
}

.toast-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

@keyframes toastSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* AppHeader 样式覆盖 */
:deep(.bg-gradient) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }
  
  .toast {
    min-width: 280px;
    margin: 0 1rem;
  }
}

/* 性别选择样式 */
.gender-selection {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.gender-option {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.gender-option:hover {
  border-color: #667eea;
  background-color: white;
}

.gender-option.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #667eea;
}

.gender-option svg {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.gender-option span {
  font-weight: 500;
  font-size: 0.875rem;
}
</style>