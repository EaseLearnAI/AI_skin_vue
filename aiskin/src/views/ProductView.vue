<template>
  <div class="product-view">
    <StatusBar />
    
    <AppHeader 
      title="猫窝产品库" 
      icon="paw" 
      right-icon="ellipsis-v"
      bg-color="bg-sakura"
      :show-back-button="true" 
    >
      <SearchBar placeholder="在猫窝搜索已添加的产品喵～" />
    </AppHeader>

    <main class="main-content">
      <AddProduct 
        @capture-product="onCaptureProduct"
        @select-from-gallery="onSelectFromGallery"
      />
      
      <div class="conflict-mode-toggle">
        <button 
          class="toggle-button"
          :class="{ active: conflictMode }"
          @click="toggleConflictMode"
        >
          <i class="fas fa-flask-vial"></i>
          <span>{{ conflictMode ? '关闭成分冲突检测' : '开启成分冲突检测' }}</span>
          <div class="toggle-switch">
            <div class="toggle-dot" :class="{ active: conflictMode }"></div>
          </div>
        </button>
      </div>
      
      <ProductList 
        :products="products"
        :selection-mode="conflictMode"
        :selected-product-ids="selectedProductIds"
        @select-product="viewProductDetails"
        @toggle-selection="toggleProductSelection"
      />
    </main>

    <!-- Conflict Check Button -->
    <div v-if="conflictMode && selectedProductIds.length > 1" class="conflict-check">
      <div class="selection-count">{{ selectedProductIds.length }}</div>
      <button class="check-button" @click="checkConflicts">
        <i class="fas fa-exclamation-triangle"></i>
      </button>
    </div>

    <BottomNavigation />
  </div>
</template>

<script>
import StatusBar from '@/components/common/StatusBar.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import AddProduct from '@/components/product/AddProduct.vue'
import ProductList from '@/components/product/ProductList.vue'

export default {
  name: 'ProductView',
  components: {
    StatusBar,
    AppHeader,
    SearchBar,
    BottomNavigation,
    AddProduct,
    ProductList
  },
  data() {
    return {
      conflictMode: false,
      selectedProductIds: [],
      products: [
        {
          id: 1,
          name: 'COSRX 低pH洁面啫喱',
          description: '温和无泡洁面乳，氨基酸系',
          image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=100',
          category: 'cleanser',
          safetyScore: 95,
          openDate: '06-01',
          tags: [
            { name: '洁面', type: 'category' },
            { name: '氨基酸', type: 'ingredient' }
          ]
        },
        {
          id: 2,
          name: 'The Ordinary 维生素C精华',
          description: '高浓度抗氧化精华，美白提亮',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100',
          category: 'essence',
          safetyScore: 80,
          openDate: '05-15',
          tags: [
            { name: '精华', type: 'category' },
            { name: '维C', type: 'ingredient' }
          ]
        },
        {
          id: 3,
          name: '理肤泉特安舒缓保湿霜',
          description: '舒缓敏感肌肤，深度保湿',
          image: 'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=100',
          category: 'moisturizer',
          safetyScore: 98,
          openDate: '06-10',
          tags: [
            { name: '面霜', type: 'category' },
            { name: '保湿', type: 'feature' }
          ]
        }
      ]
    }
  },
  methods: {
    toggleConflictMode() {
      this.conflictMode = !this.conflictMode
      if (!this.conflictMode) {
        this.selectedProductIds = []
      }
    },
    toggleProductSelection(productId) {
      const index = this.selectedProductIds.indexOf(productId)
      if (index === -1) {
        this.selectedProductIds.push(productId)
      } else {
        this.selectedProductIds.splice(index, 1)
      }
    },
    viewProductDetails(product) {
      console.log('View product details', product)
      // Navigate to product details page
      this.$router.push(`/ingredient/${product.id}`)
    },
    onCaptureProduct() {
      console.log('Capture product')
      // Implement product capture functionality
    },
    onSelectFromGallery() {
      console.log('Select from gallery')
      // Implement gallery selection
    },
    checkConflicts() {
      console.log('Check conflicts', this.selectedProductIds)
      // Navigate to conflict check page
      this.$router.push({
        path: '/conflict',
        query: { products: this.selectedProductIds.join(',') }
      })
    }
  }
}
</script>

<style scoped>
.product-view {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}

.conflict-mode-toggle {
  margin-bottom: 1rem;
}

.toggle-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: linear-gradient(to right, #F8BBD0, #E1BEE7);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.toggle-button i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.toggle-switch {
  width: 3rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  position: relative;
  margin-left: 0.5rem;
}

.toggle-dot {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-dot.active {
  transform: translateX(1.5rem);
}

.conflict-check {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  z-index: 10;
}

.check-button {
  width: 3.5rem;
  height: 3.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.check-button:hover {
  transform: scale(1.05);
  background-color: #d32f2f;
}

.check-button i {
  font-size: 1.5rem;
}

.selection-count {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ffeb3b;
  color: #212121;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 1;
}
</style> 