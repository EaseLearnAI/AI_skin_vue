<template>
  <div>
    <slot v-if="userAuthenticated"></slot>
    <div v-else class="loading-container">
      <div class="loading-spinner">
        <font-awesome-icon icon="spinner" spin size="2x" />
      </div>
      <p class="loading-text">检查登录状态...</p>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService'

export default {
  name: 'AuthChecker',
  data() {
    return {
      userAuthenticated: false,
      checkingAuth: true
    }
  },
  created() {
    this.checkAuth()
  },
  methods: {
    async checkAuth() {
      // 如果已经登录，继续显示内容
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser()
          if (response.success) {
            this.userAuthenticated = true
          } else {
            this.redirectToLogin()
          }
        } catch (error) {
          this.redirectToLogin()
        }
      } else {
        this.redirectToLogin()
      }
      
      this.checkingAuth = false
    },
    redirectToLogin() {
      // 重定向到登录页面
      this.$router.push({
        path: '/login',
        query: { redirect: this.$route.fullPath }
      })
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff9fb;
}

.loading-spinner {
  color: #F8BBD0;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 1rem;
  color: #757575;
}
</style> 