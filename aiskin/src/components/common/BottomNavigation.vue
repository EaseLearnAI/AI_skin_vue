<template>
  <nav class="bottom-navigation">
    <div class="nav-links">
      <router-link to="/" class="nav-item" :class="{ active: currentRoute === '/' }">
        <font-awesome-icon icon="home" />
        <span>首页</span>
      </router-link>
      <router-link to="/product" class="nav-item" :class="{ active: currentRoute === '/product' }">
        <font-awesome-icon icon="flask" />
        <span>产品分析</span>
      </router-link>
      <router-link to="/skinstatus" class="nav-item" :class="{ active: currentRoute === '/skinstatus' }">
        <font-awesome-icon icon="camera" />
        <span>肌肤检测</span>
      </router-link>
      <router-link to="/profile" class="nav-item" :class="{ active: currentRoute === '/profile' }">
        <font-awesome-icon icon="user" />
        <span>我的</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BottomNavigation',
  computed: {
    currentRoute() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0.4rem 1rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav-links {
  display: flex;
  justify-content: space-around;
  max-width: 500px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8E8E93;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.3rem 0.8rem;
  position: relative;
}

.nav-item svg {
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
}

.nav-item span {
  font-size: 0.8rem;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.nav-item:hover {
  color: #34C759;
}

.nav-item.active {
  color: #34C759;
}



@media (max-height: 650px) {
  .bottom-navigation {
    padding: 0.4rem 1rem;
  }
  
  .nav-item svg {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }
  
  .nav-item span {
    font-size: 0.7rem;
  }
}
</style>