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
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  z-index: 40;
}

.nav-links {
  display: flex;
  justify-content: space-around;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #9e9e9e;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-item i {
  font-size: 1.25rem;
}

.nav-item span {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.nav-item:hover {
  color: #F8BBD0;
}

.nav-item.active {
  color: #F8BBD0;
}
</style> 