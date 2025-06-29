<template>
  <div class="ingredient-view">

    
    <header class="ingredient-header">
      <div class="header-actions">
        <button class="back-button" @click="goBack">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
        <h1 class="header-title">成分分析</h1>
        <button class="share-button">
          <font-awesome-icon :icon="['fas', 'share-alt']" />
        </button>
      </div>
    </header>
    
    <main class="main-content">
      <div v-if="loading" class="loading-container">
        <AppleLoader />
        <p class="loading-text">{{ loadingText }}</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        </div>
        <p class="error-text">{{ errorMessage }}</p>
        <button class="retry-button" @click="loadData">重试</button>
      </div>
      
      <template v-else>
        <ProductInfo 
          :product="product" 
          @toggle-favorite="onToggleFavorite"
        />
        
        <AnalysisOverview 
          :analysis="analysis" 
        />
        
        <AnalysisSummary 
          :analysis="analysis" 
        />
      </template>
    </main>
    
    <div class="action-buttons">
      <div class="action-group">
        <button class="action-button primary" @click="openTagSelector">
          <font-awesome-icon :icon="['fas', 'save']" />
          保存分析结果
        </button>
        <button class="action-button danger" @click="confirmDelete">
          <font-awesome-icon :icon="['fas', 'trash-alt']" />
          删除分析结果
        </button>
      </div>
    </div>
    
    <AppModal :show="showTagModal" @close="cancelTagSelection">
      <TagSelector 
        title="保存分析结果" 
        :initialTag="product.label"
        :initialDate="product.openingDate ? new Date(product.openingDate).toISOString().split('T')[0] : ''"
        @cancel="cancelTagSelection"
        @confirm="saveProductInfo"
      />
    </AppModal>
    
    <AppModal :show="showDeleteModal" @close="showDeleteModal = false">
      <div class="confirmation-dialog">
        <div class="dialog-header">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="warning-icon" />
          <h3 class="dialog-title">确认删除</h3>
        </div>
        <p class="dialog-message">确定要删除这个分析结果吗？此操作无法撤销。</p>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">取消</button>
          <button class="confirm-btn" @click="deleteProduct">确认删除</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script>

import ProductInfo from '@/components/ingredient/ProductInfo.vue'
import AnalysisOverview from '@/components/ingredient/AnalysisOverview.vue'
import AnalysisSummary from '@/components/ingredient/AnalysisSummary.vue'
import AppModal from '@/components/common/Modal.vue'
import TagSelector from '@/components/common/TagSelector.vue'
import AppleLoader from '@/components/common/AppleLoader.vue'
import productApi from '@/api/productApi'

export default {
  name: 'IngredientView',
  components: {
    ProductInfo,
    AnalysisOverview,
    AnalysisSummary,
    AppModal,
    TagSelector,
    AppleLoader
  },
  data() {
    return {
      loading: true,
      loadingText: '加载中...',
      error: false,
      errorMessage: '',
      productId: null,
      product: {
        name: '',
        description: '',
        imageUrl: '',
        ingredients: [],
        label: '',
        openingDate: null
      },
      analysis: {
        safetyIndex: 0,
        efficacyScore: 0,
        activeIngredients: 0,
        acneRisk: { level: '低', percentage: 0 },
        irritationRisk: { level: '低', percentage: 0 },
        allergyRisk: { level: '低', percentage: 0 },
        efficacyAnalysis: [],
        potentialRisks: [],
        recommendations: [],
        overallRating: 0,
        summary: ''
      },
      showTagModal: false,
      showDeleteModal: false
    }
  },
  created() {
    // Get product ID from route parameters
    this.productId = this.$route.params.id
    if (this.productId) {
      this.loadData()
    } else {
      this.error = true
      this.errorMessage = '产品ID不存在'
      this.loading = false
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      this.loadingText = '加载产品信息...'
      this.error = false
      
      try {
        // Get product details
        const productResponse = await productApi.getProduct(this.productId)
        
        if (!productResponse.success) {
          throw new Error(productResponse.message || '获取产品信息失败')
        }
        
        this.product = {
          name: productResponse.data.product.name,
          description: productResponse.data.product.description,
          imageUrl: productResponse.data.product.imageUrl,
          ingredients: productResponse.data.product.ingredients || [],
          label: productResponse.data.product.label || '',
          openingDate: productResponse.data.product.openingDate
        }
        
        this.loadingText = '加载成分分析...'
        
        // Get ingredient analysis
        const analysisResponse = await productApi.getIngredientAnalysis(this.productId)
        
        if (!analysisResponse.success) {
          throw new Error(analysisResponse.message || '获取成分分析失败')
        }
        
        this.analysis = analysisResponse.data.ingredientAnalysis
        
        this.loading = false
      } catch (error) {
        console.error('❌ Error loading data:', error)
        this.error = true
        this.errorMessage = error.message || '加载数据失败，请重试'
        this.loading = false
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    onToggleFavorite(isFavorite) {
      console.log('Toggle favorite:', isFavorite)
      // Implement favorite toggle functionality
    },
    openTagSelector() {
      this.showTagModal = true
    },
    cancelTagSelection() {
      this.showTagModal = false
    },
    confirmDelete() {
      this.showDeleteModal = true
    },
    async saveProductInfo(data) {
      this.loading = true
      this.loadingText = '保存产品信息中...'
      
      try {
        // Update product with label and opening date
        const updateData = {
          label: data.tag || '',
          openingDate: data.openingDate
        }
        
        const updateResponse = await productApi.updateProductTags(this.productId, updateData)
        
        if (!updateResponse.success) {
          throw new Error(updateResponse.message || '保存产品信息失败')
        }
        
        // Update local data
        this.product.label = data.tag || ''
        this.product.openingDate = data.openingDate
        
        this.showTagModal = false
        this.loading = false
        
        // Navigate to product analysis page
        this.$router.push('/product')
        
        // Show success message (implement toast or notification if needed)
        console.log('✅ 产品信息保存成功')
      } catch (error) {
        console.error('❌ Error saving product info:', error)
        this.error = true
        this.errorMessage = error.message || '保存产品信息失败，请重试'
        this.loading = false
      }
    },
    async deleteProduct() {
      this.loading = true
      this.loadingText = '删除中...'
      this.showDeleteModal = false
      
      try {
        // Delete product
        const deleteResponse = await productApi.deleteProduct(this.productId)
        
        if (!deleteResponse.success) {
          throw new Error(deleteResponse.message || '删除产品失败')
        }
        
        // Navigate back to products page
        this.$router.replace('/product')
      } catch (error) {
        console.error('❌ Error deleting product:', error)
        this.error = true
        this.errorMessage = error.message || '删除产品失败，请重试'
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.ingredient-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 5rem;
}

.ingredient-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(to right, #4CAF50, #2196F3);
  padding: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button, .share-button {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.main-content {
  padding: 1rem;
  margin-top: 4rem;
  padding-bottom: 0rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
}

.loading-text {
  font-size: 1rem;
  color: #757575;
  margin-top: 1.5rem;
}

.error-icon {
  font-size: 3rem;
  color: #f44336;
  margin-bottom: 1.5rem;
}

.error-text {
  font-size: 1rem;
  color: #757575;
  text-align: center;
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.5rem 1.5rem;
  background-color: #f48fb1;
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #eeeeee;
  z-index: 999;
}

.action-group {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.action-button.primary {
  background-color: #4CAF50;
  color: white;
}

.action-button.danger {
  background-color: #FFE0E0;
  color: #F44336;
}

.action-button svg {
  margin-right: 0.5rem;
}

/* Confirmation Dialog */
.confirmation-dialog {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.warning-icon {
  font-size: 3rem;
  color: #ff9800;
  margin-bottom: 1rem;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dialog-message {
  font-size: 1rem;
  color: #757575;
  margin-bottom: 1.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cancel-btn, .confirm-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #424242;
  border: none;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  border: none;
}
</style>