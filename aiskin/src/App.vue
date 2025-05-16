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
        authService.getCurrentUser()
          .then(response => {
            if (!response.success) {
              // Token无效，清除登录状态
              authService.logout()
              this.redirectToLogin()
            }
          })
          .catch(() => {
            // 获取用户信息失败，清除登录状态
            authService.logout()
            this.redirectToLogin()
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
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

body {
  background-color: #f8f8f8;
  color: #333;
  line-height: 1.6;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bg-sakura {
  background: linear-gradient(135deg, #F8BBD0, #E1BEE7);
}
</style>
