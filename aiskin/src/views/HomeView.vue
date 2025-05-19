<template>
  <div class="home-view">

    
    <AppHeader 
      title="喵喵护肤助手" 
      icon="paw" 
      right-icon="bell"
      bg-color="bg-sakura"
    >
      <SearchBar placeholder="搜索护肤品或成分喵~" />
    </AppHeader>

    <main class="main-content">
      <CoreFeatures @save-routine="handleSaveRoutine" />
      <DailyRoutine 
        ref="dailyRoutine"
        :morning-routine="morningRoutine" 
        :evening-routine="eveningRoutine"
        :recommendations="recommendations"
        @update:morningRoutine="morningRoutine = $event"
        @update:eveningRoutine="eveningRoutine = $event"
        @update:recommendations="recommendations = $event"
        @save-routine="saveRoutineToStorage" 
      />
    </main>

    <BottomNavigation />
  </div>
</template>

<script>

import AppHeader from '@/components/common/AppHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import CoreFeatures from '@/components/home/CoreFeatures.vue'
import DailyRoutine from '@/components/home/DailyRoutine.vue'

export default {
  name: 'HomeView',
  components: {

    AppHeader,
    SearchBar,
    BottomNavigation,
    CoreFeatures,
    DailyRoutine
  },
  data() {
    return {
      morningRoutine: [
        { done: false, product: '洁面乳' },
        { done: false, product: '爽肤水' },
        { done: false, product: '精华液' },
        { done: false, product: '面霜' },
        { done: false, product: '防晒霜' }
      ],
      eveningRoutine: [
        { done: false, product: '卸妆油' },
        { done: false, product: '洁面乳' },
        { done: false, product: '爽肤水' },
        { done: false, product: '精华液' },
        { done: false, product: '面霜' },
        { done: false, product: '面膜' }
      ],
      recommendations: []
    }
  },
  mounted() {
    // Load routines from local storage if available
    this.loadRoutineFromStorage();
  },
  methods: {
    handleSaveRoutine(routineData) {
      const dailyRoutineRef = this.$refs.dailyRoutine;
      if (dailyRoutineRef) {
        dailyRoutineRef.updateRoutine(routineData);
      } else {
        // If ref isn't available, update directly
        if (routineData.routines && routineData.routines.morning) {
          this.morningRoutine = routineData.routines.morning.map(step => ({
            done: false,
            product: step
          }));
        }
        
        if (routineData.routines && routineData.routines.evening) {
          this.eveningRoutine = routineData.routines.evening.map(step => ({
            done: false,
            product: step
          }));
        }
        
        // Update recommendations if available
        if (routineData.recommendations) {
          this.recommendations = routineData.recommendations;
        }
        
        // Save to local storage
        this.saveRoutineToStorage();
      }
    },
    saveRoutineToStorage() {
      try {
        localStorage.setItem('morningRoutine', JSON.stringify(this.morningRoutine));
        localStorage.setItem('eveningRoutine', JSON.stringify(this.eveningRoutine));
        localStorage.setItem('recommendations', JSON.stringify(this.recommendations));
        console.log('✅ 护肤方案已保存到本地存储');
      } catch (error) {
        console.error('❌ 保存护肤方案失败:', error);
      }
    },
    loadRoutineFromStorage() {
      try {
        const morningRoutineStr = localStorage.getItem('morningRoutine');
        const eveningRoutineStr = localStorage.getItem('eveningRoutine');
        const recommendationsStr = localStorage.getItem('recommendations');
        
        if (morningRoutineStr) {
          this.morningRoutine = JSON.parse(morningRoutineStr);
        }
        
        if (eveningRoutineStr) {
          this.eveningRoutine = JSON.parse(eveningRoutineStr);
        }
        
        if (recommendationsStr) {
          this.recommendations = JSON.parse(recommendationsStr);
        }
        
        console.log('✅ 从本地存储加载护肤方案成功');
      } catch (error) {
        console.error('❌ 加载护肤方案失败:', error);
      }
    }
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