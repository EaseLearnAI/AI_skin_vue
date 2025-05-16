<template>
  <div class="home-view">
    <StatusBar />
    
    <AppHeader 
      title="喵喵护肤助手" 
      icon="paw" 
      right-icon="bell"
      bg-color="bg-sakura"
    >
      <SearchBar placeholder="搜索护肤品或成分喵~" />
    </AppHeader>

    <main class="main-content">
      <CoreFeatures />
      <DailyRoutine />
    </main>

    <BottomNavigation />
  </div>
</template>

<script>
import StatusBar from '@/components/common/StatusBar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import CoreFeatures from '@/components/home/CoreFeatures.vue'
import DailyRoutine from '@/components/home/DailyRoutine.vue'

export default {
  name: 'HomeView',
  components: {
    StatusBar,
    AppHeader,
    SearchBar,
    BottomNavigation,
    CoreFeatures,
    DailyRoutine
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}
</style> 