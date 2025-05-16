<template>
  <div class="conflict-view">
    <StatusBar />
    
    <AppHeader 
      title="冲突检测" 
      icon="paw" 
      right-icon="share-alt"
      bg-color="bg-red"
      :show-back-button="true" 
    />

    <main class="main-content">
      <SelectedProducts 
        :products="selectedProducts" 
        @remove="removeProduct" 
      />
      
      <ConflictAnalysis 
        :conflicts="conflicts" 
      />
    </main>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="save-button">
        <i class="fas fa-save"></i>
        保存分析结果
      </button>
      <button class="back-button" @click="goHome">
        <i class="fas fa-arrow-left"></i>
        返回猫窝
      </button>
    </div>

    <BottomNavigation />
  </div>
</template>

<script>
import StatusBar from '@/components/common/StatusBar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import SelectedProducts from '@/components/conflict/SelectedProducts.vue'
import ConflictAnalysis from '@/components/conflict/ConflictAnalysis.vue'

export default {
  name: 'ConflictView',
  components: {
    StatusBar,
    AppHeader,
    BottomNavigation,
    SelectedProducts,
    ConflictAnalysis
  },
  data() {
    return {
      selectedProducts: [
        {
          id: 1,
          name: 'COSRX 低pH洁面啫喱',
          description: '温和无泡洁面乳',
          image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=100'
        },
        {
          id: 2,
          name: 'The Ordinary 维生素C精华',
          description: '高浓度抗氧化精华',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100'
        }
      ],
      conflicts: [
        {
          level: 'high',
          ingredients: ['维生素C', '烟酰胺'],
          description: '这两种成分混在一起会互相把对方吃掉喵～效果都没啦！',
          solution: [
            { time: 'morning', action: '使用烟酰胺产品' },
            { time: 'evening', action: '使用维生素C产品' }
          ]
        },
        {
          level: 'medium',
          ingredients: ['水杨酸', 'AHA'],
          description: '同时使用这两个成分会让皮肤变得敏感，容易泛红发痒喵！',
          solution: []
        },
        {
          level: 'safe',
          ingredients: ['神经酰胺', '玻尿酸'],
          description: '这两个成分是好朋友，一起使用能锁住更多水分，皮肤会很开心！',
          solution: []
        }
      ]
    }
  },
  methods: {
    removeProduct(index) {
      this.selectedProducts.splice(index, 1)
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.conflict-view {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}

.action-buttons {
  position: fixed;
  bottom: 3.5rem;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
}

.save-button, .back-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button {
  background-color: #F8BBD0;
  color: white;
}

.save-button:hover {
  background-color: #E1BEE7;
}

.back-button {
  background-color: #f5f5f5;
  color: #616161;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.save-button i, .back-button i {
  margin-right: 0.5rem;
}
</style> 