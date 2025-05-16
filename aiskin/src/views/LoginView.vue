<template>
  <div class="login-view">
    <AuthHeader 
      title="欢迎回来" 
      subtitle="开始你的护肤之旅喵～"
      bg-color="bg-sakura"
    />
    
    <main class="main-content">
      <LoginForm @login-success="onLoginSuccess" />
    </main>
  </div>
</template>

<script>
import AuthHeader from '@/components/login/AuthHeader.vue'
import LoginForm from '@/components/login/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    AuthHeader,
    LoginForm
  },
  methods: {
    onLoginSuccess(user) {
      console.log('登录成功:', user)
      // 跳转到首页或者之前的页面
      const redirectPath = this.$route.query.redirect || '/'
      this.$router.push(redirectPath)
    }
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background-color: #fff9fb;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
  margin-top: -1.5rem;
}
</style> 