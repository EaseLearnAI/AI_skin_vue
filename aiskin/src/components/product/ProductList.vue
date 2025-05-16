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

    <div class="products-container">
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
        <img :src="product.image" :alt="product.name" class="product-image">
        <div class="product-info">
          <div class="product-header">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-tools">
              <div class="safety-score" :class="getSafetyClass(product.safetyScore)">
                <span>{{ product.safetyScore }}</span>
                <span class="score-label">{{ getSafetyLabel(product.safetyScore) }}</span>
              </div>
              <button class="options-button">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-meta">
            <div class="product-tags">
              <span 
                v-for="(tag, tagIndex) in product.tags" 
                :key="tagIndex"
                class="product-tag"
                :style="getTagStyle(tag.type)"
              >
                {{ tag.name }}
              </span>
            </div>
            <span class="expiry-date">{{ product.openDate }}开封</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      default: () => [
        { id: 'all', name: '全部产品' },
        { id: 'cleanser', name: '洁面', color: '#2196f3' },
        { id: 'toner', name: '化妆水', color: '#4caf50' },
        { id: 'essence', name: '精华', color: '#ff9800' },
        { id: 'mask', name: '面膜', color: '#9c27b0' },
        { id: 'sunscreen', name: '防晒', color: '#f44336' }
      ]
    },
    selectionMode: {
      type: Boolean,
      default: false
    },
    selectedProductIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedCategory: 'all'
    }
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory === 'all') {
        return this.products
      }
      return this.products.filter(product => 
        product.category === this.selectedCategory
      )
    }
  },
  methods: {
    setCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    selectProduct(product) {
      if (!this.selectionMode) {
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
      }
      return styles[type] || styles.category
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
  font-weight: 500;
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
</style> 