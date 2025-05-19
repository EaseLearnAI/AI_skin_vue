<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import authService from '@/services/authService'

export default {
  name: 'App',
  created() {
    // 在应用启动时检查用户是否已登录
    this.checkAuthStatus()
  },
  methods: {
    checkAuthStatus() {
      // 如果有token但尚未验证，则验证token有效性
      if (authService.isAuthenticated()) {
        // 首先从本地存储获取用户数据
        const user = authService.getCurrentUser()
        if (!user) {
          // 没有用户信息，清除登录状态
          authService.logout()
          this.redirectToLogin()
          return
        }
        
        // 尝试从服务器获取最新的用户数据
        // 如果 API 不支持，则忽略错误，保持当前登录状态
        authService.fetchCurrentUser()
          .then(response => {
            if (response && !response.success) {
              console.log('Failed to refresh user data, but continuing with local data')
            }
          })
          .catch(() => {
            // 忽略错误，保持当前登录状态
            console.log('Failed to fetch user data, but continuing with local data')
          })
      }
    },
    redirectToLogin() {
      if (this.$route.path !== '/login' && this.$route.path !== '/register') {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 
    Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

:root {
  --system-green: #34C759;
  --system-green-dark: #30D158;
  --system-gray-1: #8E8E93;
  --system-gray-2: #AEAEB2;
  --system-gray-3: #C7C7CC;
  --system-gray-4: #D1D1D6;
  --system-gray-5: #E5E5EA;
  --system-gray-6: #F2F2F7;
  --system-background: #F5F5F7;
  --system-red: #FF3B30;
  --system-blue: #007AFF;
  --system-shadow: rgba(0, 0, 0, 0.1);
}

body {
  background-color: var(--system-background);
  color: #111;
  line-height: 1.6;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Buttons */
button {
  cursor: pointer;
  font-weight: 600;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--system-green), var(--system-green-dark));
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.4);
}

/* Container paddings */
.page-container {
  padding: 1rem;
  margin-bottom: 70px; /* Space for bottom navigation */
}

/* Replace old color scheme */
.bg-sakura {
  background: linear-gradient(135deg, var(--system-green), var(--system-green-dark));
}

/* Card styles */
.card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 14px var(--system-shadow);
  overflow: hidden;
}
</style>
