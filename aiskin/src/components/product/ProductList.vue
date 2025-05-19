<template>
  <div class="product-list">
    <div class="category-filters">
      <button 
        v-for="(category, index) in categories" 
        :key="index"
        class="category-button"
        :class="{ active: selectedCategory === category.id }"
        @click="setCategory(category.id)"
      >
        <span v-if="category.color" class="category-dot" :style="{ backgroundColor: category.color }"></span>
        {{ category.name }}
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <AppleLoader />
      <p class="loading-text">加载产品数据中...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="error-icon" />
      <p class="error-message">{{ errorMessage }}</p>
      <button class="retry-button" @click="fetchProducts">重试</button>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="empty-container">
      <font-awesome-icon :icon="['fas', 'box-open']" class="empty-icon" />
      <p class="empty-message">暂无产品</p>
    </div>

    <div v-else class="products-container">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="selectProduct(product)"
      >
        <div v-if="selectionMode" class="checkbox-container">
          <input 
            type="checkbox" 
            :checked="isSelected(product.id)"
            @click.stop="toggleSelection(product.id)"
          >
        </div>
        <img 
          :src="product.imageUrl || 'https://place-hold.it/100x100?text=No+Image'" 
          :alt="product.name" 
          class="product-image"
          @error="handleImageError"
        >
        <div class="product-info">
          <div class="product-header">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-tools">
              <div 
                v-if="product.safetyScore" 
                class="safety-score" 
                :class="getSafetyClass(product.safetyScore)"
              >
                <span>{{ product.safetyScore }}</span>
                <span class="score-label">{{ getSafetyLabel(product.safetyScore) }}</span>
              </div>
              <div class="options-menu">
                <button class="options-button" @click.stop="toggleOptionsMenu(product.id)">
                  <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
                </button>
                <div v-if="activeOptionsMenu === product.id" class="options-dropdown">
                  <button class="dropdown-item" @click.stop="deleteProduct(product.id)">
                    <font-awesome-icon :icon="['fas', 'trash-alt']" class="dropdown-icon" />
                    删除产品
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p class="product-description">{{ product.description || '暂无描述' }}</p>
          <div class="product-meta">
            <div class="product-tags">
              <span 
                v-if="product.label" 
                class="product-tag"
                :style="getTagStyle('category')"
              >
                {{ product.label }}
              </span>
              <span 
                v-if="product.efficacyScore" 
                class="product-tag"
                :style="getTagStyle('feature')"
              >
                功效 {{ product.efficacyScore }}
              </span>
              <span 
                v-if="product.overallRating" 
                class="product-tag"
                :style="getTagStyle('rating')"
              >
                评分 {{ product.overallRating }}
              </span>
            </div>
            <span v-if="product.openingDate" class="expiry-date">
              {{ formatDate(product.openingDate) }}开封
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productApi from '@/api/productApi'
import AppleLoader from '@/components/common/AppleLoader.vue'

export default {
  name: 'ProductList',
  components: {
    AppleLoader
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => [
        { id: 'all', name: '全部产品' },
        { id: '洁面', name: '洁面', color: '#2196f3' },
        { id: '精华', name: '精华', color: '#ff9800' },
        { id: '面膜', name: '面膜', color: '#9c27b0' },
        { id: '防晒', name: '防晒', color: '#f44336' },
        { id: '面霜', name: '面霜', color: '#4caf50' },
        { id: '爽肤水', name: '爽肤水', color: '#03a9f4' },
        { id: '乳液', name: '乳液', color: '#8bc34a' },
        { id: '眼霜', name: '眼霜', color: '#673ab7' }
      ]
    },
    selectionMode: {
      type: Boolean,
      default: false
    },
    selectedProductIds: {
      type: Array,
      default: () => []
    },
    products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedCategory: 'all',
      localProducts: [],
      loading: false,
      error: false,
      errorMessage: '',
      activeOptionsMenu: null
    }
  },
  computed: {
    filteredProducts() {
      // Use prop products if provided, otherwise use localProducts
      const productList = this.products.length > 0 ? this.products : this.localProducts
      
      if (this.selectedCategory === 'all') {
        return productList
      }
      return productList.filter(product => 
        product.label === this.selectedCategory
      )
    }
  },
  mounted() {
    // Only fetch products if userId is provided and no products are passed as props
    if (this.userId && this.products.length === 0) {
      this.fetchProducts()
    }
  },
  watch: {
    userId(newVal) {
      if (newVal && this.products.length === 0) {
        this.fetchProducts()
      }
    },
    selectedCategory(newVal) {
      // If a specific category is selected (not 'all') and it's not 'all' and we have a userId
      if (newVal !== 'all' && this.userId) {
        this.fetchProductsByLabel(newVal)
      } else if (newVal === 'all' && this.userId) {
        this.fetchProducts()
      }
    }
  },
  methods: {
    setCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    selectProduct(product) {
      if (!this.selectionMode) {
        this.$router.push(`/ingredient/${product.id}`)
        this.$emit('select-product', product)
      }
    },
    isSelected(productId) {
      return this.selectedProductIds.includes(productId)
    },
    toggleSelection(productId) {
      this.$emit('toggle-selection', productId)
    },
    getSafetyClass(score) {
      if (score >= 90) return 'safe'
      if (score >= 70) return 'medium'
      return 'unsafe'
    },
    getSafetyLabel(score) {
      if (score >= 90) return '安全'
      if (score >= 70) return '中等'
      return '注意'
    },
    getTagStyle(type) {
      const styles = {
        category: { backgroundColor: '#e3f2fd', color: '#1976d2' },
        ingredient: { backgroundColor: '#e8f5e9', color: '#388e3c' },
        feature: { backgroundColor: '#fff3e0', color: '#e65100' },
        rating: { backgroundColor: '#f3e5f5', color: '#9c27b0' }
      }
      return styles[type] || styles.category
    },
    formatDate(dateString) {
      try {
        const date = new Date(dateString)
        return `${date.getMonth() + 1}-${date.getDate()}`
      } catch (e) {
        return dateString
      }
    },
    handleImageError(e) {
      e.target.src = 'https://place-hold.it/100x100?text=No+Image'
    },
    async fetchProducts() {
      if (!this.userId) return
      
      this.loading = true
      this.error = false
      
      try {
        const response = await productApi.getUserProducts(this.userId)
        
        if (response.success) {
          this.localProducts = response.data.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            label: product.label,
            safetyScore: product.safetyScore,
            efficacyScore: product.efficacyScore,
            overallRating: product.overallRating,
            imageUrl: product.imageUrl || ''
          }))
        } else {
          throw new Error(response.message || '获取产品列表失败')
        }
      } catch (error) {
        console.error('获取产品列表失败', error)
        this.error = true
        this.errorMessage = error.message || '获取产品列表失败，请重试'
      } finally {
        this.loading = false
      }
    },
    async fetchProductsByLabel(label) {
      if (!this.userId || !label) return
      
      this.loading = true
      this.error = false
      
      try {
        const response = await productApi.getUserProductsByLabel(this.userId, label)
        
        if (response.success) {
          this.localProducts = response.data.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            label: product.label,
            safetyScore: product.safetyScore,
            efficacyScore: product.efficacyScore,
            overallRating: product.overallRating,
            imageUrl: product.imageUrl || ''
          }))
        } else {
          throw new Error(response.message || `获取${label}类产品失败`)
        }
      } catch (error) {
        console.error(`获取${label}类产品失败`, error)
        this.error = true
        this.errorMessage = error.message || `获取${label}类产品失败，请重试`
      } finally {
        this.loading = false
      }
    },
    toggleOptionsMenu(productId) {
      if (this.activeOptionsMenu === productId) {
        this.activeOptionsMenu = null;
      } else {
        this.activeOptionsMenu = productId;
      }
    },
    deleteProduct(productId) {
      if (confirm('确定要删除这个产品吗？')) {
        this.$emit('delete-product', productId);
        this.activeOptionsMenu = null;
        
        // If using local products, remove from array
        if (this.localProducts.length > 0) {
          this.localProducts = this.localProducts.filter(p => p.id !== productId);
        }
      }
    }
  }
}
</script>

<style scoped>
.product-list {
  margin-bottom: 1rem;
}

.category-filters {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.category-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: white;
  color: #616161;
}

.category-button.active {
  background-color: #F8BBD0;
  color: white;
}

.category-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #fafafa;
  border-radius: 12px;
  margin-top: 1rem;
}

.loading-text, .error-message, .empty-message {
  margin-top: 1rem;
  color: #757575;
  text-align: center;
}

.error-icon, .empty-icon {
  font-size: 2rem;
  color: #f44336;
}

.empty-icon {
  color: #bdbdbd;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f48fb1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.products-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.product-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkbox-container {
  margin-right: 0.75rem;
  margin-top: 0.25rem;
}

.product-image {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  object-fit: cover;
  margin-right: 0.75rem;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
}

.product-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 700;
}

.product-tools {
  display: flex;
  align-items: center;
}

.safety-score {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
  margin-right: 0.25rem;
  display: flex;
  align-items: center;
}

.safety-score.safe {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.safety-score.medium {
  background-color: #fff9c4;
  color: #ff8f00;
}

.safety-score.unsafe {
  background-color: #ffcdd2;
  color: #c62828;
}

.score-label {
  margin-left: 0.125rem;
}

.options-button {
  background: none;
  border: none;
  color: #bdbdbd;
  cursor: pointer;
  padding: 0.25rem;
}

.options-button:hover {
  color: #F8BBD0;
}

.product-description {
  font-size: 0.75rem;
  color: #757575;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.product-tag {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.expiry-date {
  font-size: 0.75rem;
  color: #9e9e9e;
}

.options-menu {
  position: relative;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 120px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.875rem;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-icon {
  margin-right: 0.5rem;
  color: #e53935;
}
</style> 