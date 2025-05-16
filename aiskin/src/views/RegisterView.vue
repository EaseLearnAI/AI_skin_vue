<template>
  <div class="register-view">
    <AuthHeader 
      title="创建账号" 
      subtitle="加入我们的护肤社区喵～"
      bg-color="bg-sakura"
    />
    
    <main class="main-content">
      <RegisterForm @register-success="onRegisterSuccess" />
    </main>
  </div>
</template>

<script>
import AuthHeader from '@/components/login/AuthHeader.vue'
import RegisterForm from '@/components/login/RegisterForm.vue'

export default {
  name: 'RegisterView',
  components: {
    AuthHeader,
    RegisterForm
  },
  methods: {
    onRegisterSuccess(user) {
      console.log('注册成功:', user)
      // 跳转到首页或者登录后的欢迎页面
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.register-view {
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