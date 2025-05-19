<template>
  <div class="product-view">
    
    <header class="product-header">
      <div class="header-container">
        <a href="#" class="back-button" @click.prevent="goBack">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </a>
        <h1 class="header-title">
          <font-awesome-icon :icon="['fas', 'paw']" class="header-icon" />
          猫窝产品库
        </h1>
        <button class="menu-button">
          <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
        </button>
      </div>
    </header>
    
    <main class="main-content">
      <!-- Product Form Modal -->
      <div v-if="showUploadModal" class="product-modal-backdrop" @click.self="closeUploadModal">
        <div class="product-modal">
          <div class="modal-header">
            <div class="header-image">
              <div class="image-overlay">
                <font-awesome-icon :icon="['fas', 'paw']" class="paw-icon" />
                <font-awesome-icon :icon="['fas', 'plus-circle']" class="plus-icon" />
              </div>
            </div>
            <button class="close-button" @click="closeUploadModal">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
            <h3 class="modal-title">添加护肤产品</h3>
            <p class="modal-subtitle">上传产品图片，AI将自动识别产品成分并进行分析</p>
          </div>
          
          <div class="modal-content">
            <div v-if="modalError" class="error-message">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
              <p>{{ modalErrorMessage }}</p>
            </div>
            
            <ImageUploader 
              ref="imageUploader"
              placeholder="点击选择产品图片"
              @image-selected="onImageSelected"
              @image-removed="onImageRemoved"
              @upload-start="onUploadStart"
              @upload-complete="onUploadComplete"
            />
            
            <div v-if="showProgressSteps" class="progress-steps">
              <div 
                class="progress-step" 
                :class="{ 'active': currentStep >= 1, 'complete': currentStep > 1 }"
              >
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4 class="step-title">创建产品</h4>
                  <p class="step-description">{{ stepStatus.create }}</p>
                </div>
              </div>
              
              <div 
                class="progress-step" 
                :class="{ 'active': currentStep >= 2, 'complete': currentStep > 2 }"
              >
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4 class="step-title">上传图片</h4>
                  <p class="step-description">{{ stepStatus.upload }}</p>
                </div>
              </div>
              
              <div 
                class="progress-step" 
                :class="{ 'active': currentStep >= 3, 'complete': currentStep > 3 }"
              >
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4 class="step-title">提取成分</h4>
                  <p class="step-description">{{ stepStatus.extract }}</p>
                </div>
              </div>
              
              <div 
                class="progress-step" 
                :class="{ 'active': currentStep >= 4, 'complete': currentStep > 4 }"
              >
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4 class="step-title">分析成分</h4>
                  <p class="step-description">{{ stepStatus.analyze }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              class="submit-button"
              :disabled="!canSubmit || isLoading || isExtracting || isAnalyzing"
              @click="submitProduct"
            >
              <font-awesome-icon v-if="isLoading" :icon="['fas', 'spinner']" spin />
              <span v-else>{{ submitButtonText }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Product Component -->
      <div class="add-product-container">
        <div class="add-product-card">
          <h3 class="add-product-title">
            <font-awesome-icon :icon="['fas', 'plus-circle']" class="title-icon" />
            添加新产品到猫窝
          </h3>
          <div class="add-product-options">
            <button class="option-button" @click="showUploadModal = true">
              <div class="option-icon-container">
                <font-awesome-icon :icon="['fas', 'camera']" class="option-icon" />
              </div>
              <div class="option-content">
                <span class="option-title">添加产品</span>
                <span class="option-description">猫眼扫描成分</span>
              </div>
            </button>
            <button class="option-button" @click="enableConflictMode">
              <div class="option-icon-container">
                <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="option-icon" />
              </div>
              <div class="option-content">
                <span class="option-title">产品冲突成分检测</span>
                <span class="option-description">检测产品成分间潜在冲突</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Product List -->
      <div v-if="conflictMode" class="conflict-mode-container">
        <div class="conflict-mode-header">
          <h3 class="conflict-mode-title">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-2 text-yellow-500" />
            选择需要检测冲突的产品
          </h3>
          <div class="conflict-mode-actions">
            <button 
              class="conflict-analyze-btn" 
              :disabled="selectedProductIds.length < 2"
              @click="analyzeConflict"
            >
              分析冲突
            </button>
            <button class="conflict-cancel-btn" @click="cancelConflictMode">
              取消
            </button>
          </div>
        </div>
        <div class="selected-count">
          已选择 {{ selectedProductIds.length }} 个产品 (至少需要2个)
        </div>
      </div>
      
      <ProductList 
        :userId="currentUserId"
        :selectionMode="conflictMode"
        :selectedProductIds="selectedProductIds"
        @select-product="onSelectProduct"
        @toggle-selection="toggleProductSelection"
        @delete-product="handleDeleteProduct"
      />
      
      <!-- Action Button for Conflict Analysis -->
      <div v-if="conflictMode" class="floating-action-container">
        <button 
          class="floating-analyze-btn" 
          :class="{ 'disabled': selectedProductIds.length < 2 }"
          :disabled="selectedProductIds.length < 2"
          @click="analyzeConflict"
        >
          <font-awesome-icon :icon="['fas', 'search']" class="mr-2" />
          分析 {{ selectedProductIds.length }} 个产品的冲突
        </button>
      </div>
      
      <!-- Conflict History Button -->
      <div class="conflict-history-button" @click="toggleConflictHistory">
        <font-awesome-icon :icon="['fas', 'history']" />
      </div>
      
      <!-- Conflict History Modal -->
      <AppModal :show="showConflictHistory" @close="showConflictHistory = false">
        <div class="conflict-history-modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <font-awesome-icon :icon="['fas', 'history']" class="mr-2" />
              冲突检测历史
            </h3>
            <button class="close-button" @click="showConflictHistory = false">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
          
          <div v-if="loadingHistory" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载冲突历史记录中...</p>
          </div>
          
          <div v-else-if="historyError" class="error-message">
            {{ historyError }}
          </div>
          
          <div v-else-if="conflictHistory.length === 0" class="empty-history">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
            暂无冲突检测历史记录
          </div>
          
          <div v-else class="conflict-history-list">
            <div 
              v-for="conflict in conflictHistory" 
              :key="conflict.id" 
              class="conflict-history-item"
              @click="viewConflictDetail(conflict.id)"
            >
              <div class="conflict-info">
                <div class="conflict-date">{{ formatDate(conflict.createdAt) }}</div>
                <div class="conflict-products">
                  <span v-for="(product, index) in conflict.products" :key="index">
                    {{ product }}{{ index < conflict.products.length - 1 ? ' + ' : '' }}
                  </span>
                </div>
              </div>
              <div class="view-detail">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </div>
            </div>
          </div>
        </div>
      </AppModal>
      
      <!-- Conflict Detail Modal -->
      <AppModal :show="showConflictDetail" @close="showConflictDetail = false">
        <div class="conflict-detail-modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-2" />
              冲突检测详情
            </h3>
            <button class="close-button" @click="showConflictDetail = false">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
          
          <div v-if="loadingDetail" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载冲突详情中...</p>
          </div>
          
          <div v-else-if="detailError" class="error-message">
            {{ detailError }}
          </div>
          
          <div v-else-if="conflictDetail" class="conflict-detail-content">
            <!-- Products -->
            <div class="conflict-products-container">
              <h4 class="section-title">检测产品</h4>
              <div class="product-cards">
                <div 
                  v-for="product in conflictDetail.products" 
                  :key="product._id" 
                  class="conflict-product-card"
                >
                  <img :src="product.imageUrl" alt="产品图片" class="product-image" />
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-description">{{ truncateText(product.description, 100) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Conflicts -->
            <div v-if="conflictDetail.conflicts && conflictDetail.conflicts.length > 0" class="conflicts-container">
              <h4 class="section-title">检测到的冲突</h4>
              <div class="conflicts-list">
                <div 
                  v-for="(conflict, index) in conflictDetail.conflicts" 
                  :key="index" 
                  class="conflict-item"
                >
                  <div class="conflict-components">
                    <span v-for="(component, compIndex) in conflict.components" :key="compIndex">
                      {{ component }}{{ compIndex < conflict.components.length - 1 ? ' + ' : '' }}
                    </span>
                  </div>
                  <div class="conflict-severity" :class="'severity-' + conflict.severity.toLowerCase()">
                    {{ conflict.severity }}风险
                  </div>
                  <div class="conflict-description">
                    {{ conflict.description }}
                  </div>
                  <div v-if="conflict.effects && conflict.effects.length > 0" class="conflict-effects">
                    <div class="effects-title">可能产生的影响：</div>
                    <ul>
                      <li v-for="(effect, effectIndex) in conflict.effects" :key="effectIndex">
                        {{ effect }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Safe Combinations -->
            <div v-if="conflictDetail.safeCombo && conflictDetail.safeCombo.length > 0" class="safe-combo-container">
              <h4 class="section-title">安全组合</h4>
              <div class="safe-combo-list">
                <div 
                  v-for="(combo, index) in conflictDetail.safeCombo" 
                  :key="index" 
                  class="safe-combo-item"
                >
                  <div class="combo-components">
                    <span v-for="(component, compIndex) in combo.components" :key="compIndex">
                      {{ component }}{{ compIndex < combo.components.length - 1 ? ' + ' : '' }}
                    </span>
                  </div>
                  <div class="combo-description">
                    {{ combo.description }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recommendations -->
            <div v-if="conflictDetail.recommendations" class="recommendations-container">
              <h4 class="section-title">使用建议</h4>
              
              <!-- Product Pairings -->
              <div v-if="conflictDetail.recommendations.productPairings" class="pairings-container">
                <!-- Cannot Use Together -->
                <div v-if="conflictDetail.recommendations.productPairings.cannotUseTogether && conflictDetail.recommendations.productPairings.cannotUseTogether.length > 0" class="cannot-use-together">
                  <h5 class="subsection-title">不建议一起使用</h5>
                  <div class="pairings-list">
                    <div 
                      v-for="(pairing, index) in conflictDetail.recommendations.productPairings.cannotUseTogether" 
                      :key="index" 
                      class="pairing-item cannot-use"
                    >
                      <div class="pairing-products">
                        <span v-for="(product, prodIndex) in pairing.products" :key="prodIndex">
                          {{ product }}{{ prodIndex < pairing.products.length - 1 ? ' + ' : '' }}
                        </span>
                      </div>
                      <div class="pairing-reason">
                        原因：{{ pairing.reason }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Can Use Together -->
                <div v-if="conflictDetail.recommendations.productPairings.canUseTogether && conflictDetail.recommendations.productPairings.canUseTogether.length > 0" class="can-use-together">
                  <h5 class="subsection-title">可以一起使用</h5>
                  <div class="pairings-list">
                    <div 
                      v-for="(pairing, index) in conflictDetail.recommendations.productPairings.canUseTogether" 
                      :key="index" 
                      class="pairing-item can-use"
                    >
                      <div class="pairing-products">
                        <span v-for="(product, prodIndex) in pairing.products" :key="prodIndex">
                          {{ product }}{{ prodIndex < pairing.products.length - 1 ? ' + ' : '' }}
                        </span>
                      </div>
                      <div class="pairing-reason">
                        原因：{{ pairing.reason }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Routines -->
              <div v-if="conflictDetail.recommendations.routines" class="routines-container">
                <h5 class="subsection-title">建议使用顺序</h5>
                
                <!-- Morning Routine -->
                <div v-if="conflictDetail.recommendations.routines.morning && conflictDetail.recommendations.routines.morning.length > 0" class="routine-section">
                  <div class="routine-header">
                    <font-awesome-icon :icon="['fas', 'sun']" class="mr-2" />
                    <span>早间护理</span>
                  </div>
                  <div class="routine-steps">
                    <div 
                      v-for="(step, index) in conflictDetail.recommendations.routines.morning" 
                      :key="index" 
                      class="routine-step"
                    >
                      {{ step }}
                    </div>
                  </div>
                </div>
                
                <!-- Evening Routine -->
                <div v-if="conflictDetail.recommendations.routines.evening && conflictDetail.recommendations.routines.evening.length > 0" class="routine-section">
                  <div class="routine-header">
                    <font-awesome-icon :icon="['fas', 'moon']" class="mr-2" />
                    <span>晚间护理</span>
                  </div>
                  <div class="routine-steps">
                    <div 
                      v-for="(step, index) in conflictDetail.recommendations.routines.evening" 
                      :key="index" 
                      class="routine-step"
                    >
                      {{ step }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppModal>
    </main>
    
    <BottomNavigation />
  </div>
</template>

<script>
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import ProductList from '@/components/product/ProductList.vue'
import ImageUploader from '@/components/product/ImageUploader.vue'
import authService from '@/services/authService'
import AppModal from '@/components/common/AppModal.vue'
import productApi from '@/api/productApi'
import fileService from '@/services/fileService'

export default {
  name: 'ProductView',
  components: {
    BottomNavigation,
    ProductList,
    AppModal,
    ImageUploader
  },
  data() {
    return {
      selectedProductIds: [],
      currentUserId: '',
      conflictMode: false,
      loading: false,
      error: null,
      showConflictHistory: false,
      loadingHistory: false,
      historyError: null,
      conflictHistory: [],
      showConflictDetail: false,
      loadingDetail: false,
      detailError: null,
      conflictDetail: null,
      showUploadModal: false,
      selectedImage: null,
      modalError: false,
      modalErrorMessage: '',
      showProgressSteps: false,
      stepStatus: {
        create: '等待创建',
        upload: '等待上传',
        extract: '等待提取',
        analyze: '等待分析'
      },
      currentStep: 0,
      isLoading: false,
      isExtracting: false,
      isAnalyzing: false,
      productId: null,
      imageUrl: ''
    }
  },
  computed: {
    canSubmit() {
      return this.selectedImage != null;
    },
    submitButtonText() {
      if (this.isExtracting) return '正在提取成分...';
      if (this.isAnalyzing) return '正在分析成分...';
      return '上传图片并分析';
    }
  },
  async mounted() {
    // Get current user ID from auth service
    const user = authService.getCurrentUser();
    if (user && user._id) {
      this.currentUserId = user._id;
    }
    
    // Check if coming back from conflict analysis
    if (this.$route.query.fromConflict === 'true') {
      // Clear the query parameter
      this.$router.replace({ query: {} });
    }
    
    // Check if conflict mode is enabled via URL
    if (this.$route.query.conflictMode === 'true') {
      this.enableConflictMode();
    }
  },
  methods: {
    onProductAdded(productData) {
      console.log('New product added:', productData);
      // Refresh product list if needed
    },
    onSelectProduct(product) {
      console.log('Selected product:', product);
      // Navigation handled by ProductList component
    },
    toggleProductSelection(productId) {
      const index = this.selectedProductIds.indexOf(productId);
      if (index === -1) {
        this.selectedProductIds.push(productId);
      } else {
        this.selectedProductIds.splice(index, 1);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // Enable conflict mode to select products
    enableConflictMode() {
      this.conflictMode = true;
      this.selectedProductIds = [];
    },
    // Cancel conflict mode
    cancelConflictMode() {
      this.conflictMode = false;
      this.selectedProductIds = [];
    },
    // Analyze conflicts between selected products
    analyzeConflict() {
      if (this.selectedProductIds.length < 2) {
        return;
      }
      
      // Navigate to conflict analysis page with selected product IDs
      this.$router.push({
        path: '/conflict',
        query: { products: this.selectedProductIds.join(',') }
      });
      
      // Reset conflict mode
      this.conflictMode = false;
    },
    toggleConflictHistory() {
      this.showConflictHistory = !this.showConflictHistory;
      
      // If showing the history, fetch the data
      if (this.showConflictHistory) {
        this.fetchConflictHistory();
      }
    },
    async fetchConflictHistory() {
      if (!this.currentUserId) return;
      
      this.loadingHistory = true;
      this.historyError = null;
      this.conflictHistory = [];
      
      try {
        // Fetch conflict history for the current user
        const response = await fetch(`http://localhost:5000/api/conflicts/user/${this.currentUserId}`, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ 获取冲突检测历史成功:', data);
          this.conflictHistory = data.data.conflicts;
        } else {
          this.historyError = data.message || '获取冲突检测历史失败';
          console.error('❌ 获取冲突检测历史失败:', data);
        }
      } catch (error) {
        this.historyError = '获取冲突检测历史时出错，请重试';
        console.error('❌ 获取冲突检测历史错误:', error);
      } finally {
        this.loadingHistory = false;
      }
    },
    async viewConflictDetail(conflictId) {
      this.showConflictDetail = true;
      this.loadingDetail = true;
      this.detailError = null;
      this.conflictDetail = null;
      
      try {
        // Fetch conflict detail based on the conflict ID
        const response = await fetch(`http://localhost:5000/api/conflicts/detail/${conflictId}`, {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ 获取冲突检测详情成功:', data);
          this.conflictDetail = data.data.conflict;
        } else {
          this.detailError = data.message || '获取冲突检测详情失败';
          console.error('❌ 获取冲突检测详情失败:', data);
        }
      } catch (error) {
        this.detailError = '获取冲突检测详情时出错，请重试';
        console.error('❌ 获取冲突检测详情错误:', error);
      } finally {
        this.loadingDetail = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },
    async handleDeleteProduct(productId) {
      try {
        // Make API call to delete product
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ 产品删除成功:', data);
          // Show success message (you could implement a toast/notification system here)
          // No need to refresh explicitly since the ProductList component has already removed the item
        } else {
          console.error('❌ 产品删除失败:', data);
          alert(data.message || '删除产品失败，请重试');
        }
      } catch (error) {
        console.error('❌ 产品删除错误:', error);
        alert('删除产品时出错，请重试');
      }
    },
    onImageSelected(image) {
      console.log('🖼️ Image selected', image);
      this.selectedImage = image;
      this.modalError = false;
    },
    onImageRemoved() {
      console.log('🖼️ Image removed');
      this.selectedImage = null;
    },
    onUploadStart() {
      console.log('🖼️ Upload started');
    },
    onUploadComplete() {
      console.log('🖼️ Upload completed');
    },
    closeUploadModal() {
      this.showUploadModal = false;
      this.selectedImage = null;
      this.resetModalState();
    },
    resetModalState() {
      this.modalError = false;
      this.modalErrorMessage = '';
      this.showProgressSteps = false;
      this.currentStep = 0;
      this.isLoading = false;
      this.isExtracting = false;
      this.isAnalyzing = false;
      this.productId = null;
      this.imageUrl = '';
      this.stepStatus = {
        create: '等待创建',
        upload: '等待上传',
        extract: '等待提取',
        analyze: '等待分析'
      };
    },
    async submitProduct() {
      if (!this.canSubmit) return;
      
      this.isLoading = true;
      this.modalError = false;
      this.showProgressSteps = true;
      this.currentStep = 1;
      
      try {
        // Step 1: Create product
        this.stepStatus.create = '创建中...';
        const createResponse = await productApi.createProduct({
          name: '未命名产品',
          description: '这是一个用于成分分析的产品',
          label: '',
          openingDate: new Date().toISOString()
        });
        
        if (!createResponse.success) {
          throw new Error(createResponse.message || '创建产品失败');
        }
        
        this.productId = createResponse.data.product._id;
        this.stepStatus.create = '创建成功';
        this.currentStep = 2;
        
        // Step 2: Upload product image
        this.stepStatus.upload = '上传中...';
        
        const formData = fileService.createFormData(this.selectedImage.file);
        const uploadResponse = await productApi.uploadProductImage(this.productId, formData);
        
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || '上传图片失败');
        }
        
        this.imageUrl = uploadResponse.data.imageUrl;
        this.stepStatus.upload = '上传成功';
        this.currentStep = 3;
        
        // Step 3: Extract product info
        this.isExtracting = true;
        this.stepStatus.extract = '提取中...';
        
        const extractResponse = await productApi.extractProductInfo(this.productId);
        
        if (!extractResponse.success) {
          throw new Error(extractResponse.message || '提取成分失败');
        }
        
        this.stepStatus.extract = `提取成功，识别到${extractResponse.data.ingredients.length}种成分`;
        this.currentStep = 4;
        this.isExtracting = false;
        
        // Step 4: Analyze ingredients
        this.isAnalyzing = true;
        this.stepStatus.analyze = '分析中...';
        
        const analyzeResponse = await productApi.analyzeIngredients(this.productId);
        
        if (!analyzeResponse.success) {
          throw new Error(analyzeResponse.message || '分析成分失败');
        }
        
        this.stepStatus.analyze = '分析成功';
        this.currentStep = 5;
        this.isAnalyzing = false;
        
        // Complete and navigate to the ingredient analysis page
        console.log('✅ Product process completed', {
          productId: this.productId,
          imageUrl: this.imageUrl
        });
        
        // Close upload modal and navigate to ingredient view
        this.showUploadModal = false;
        
        // Navigate to ingredient analysis page
        this.$router.push(`/ingredient/${this.productId}`);
        
      } catch (error) {
        console.error('❌ Error in product submission', error);
        this.modalError = true;
        this.modalErrorMessage = error.message || '处理失败，请重试';
        
        // Update step status based on error
        if (this.currentStep === 1) {
          this.stepStatus.create = '创建失败';
        } else if (this.currentStep === 2) {
          this.stepStatus.upload = '上传失败';
        } else if (this.currentStep === 3) {
          this.stepStatus.extract = '提取失败';
          this.isExtracting = false;
        } else if (this.currentStep === 4) {
          this.stepStatus.analyze = '分析失败';
          this.isAnalyzing = false;
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.product-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 4rem;
}

.product-header {
  background: linear-gradient(135deg, #f8bbd0, #e1bee7);
  padding: 1.25rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 10;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
}

.header-icon {
  margin-right: 0.5rem;
  font-size: 1.125rem;
}

.menu-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.main-content {
  padding: 1.25rem;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

/* Conflict mode styles */
.conflict-mode-container {
  background-color: white;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.conflict-mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.conflict-mode-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
}

.conflict-mode-actions {
  display: flex;
  gap: 0.5rem;
}

.conflict-analyze-btn, .conflict-cancel-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
}

.conflict-analyze-btn {
  background-color: #CE93D8;
  color: white;
}

.conflict-analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.conflict-cancel-btn {
  background-color: #f5f5f5;
  color: #757575;
}

.selected-count {
  font-size: 0.875rem;
  color: #757575;
  padding: 0.25rem 0;
}

.floating-action-container {
  position: fixed;
  bottom: 4.5rem;
  left: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.floating-analyze-btn {
  background-color: #CE93D8;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(206, 147, 216, 0.5);
  border: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.floating-analyze-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(206, 147, 216, 0.6);
}

.floating-analyze-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Conflict History Button */
.conflict-history-button {
  position: fixed;
  bottom: 5.5rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(to right bottom, #ab47bc, #7b1fa2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(171, 71, 188, 0.4);
  z-index: 20;
  transition: all 0.3s ease;
  font-size: 1.25rem;
}

.conflict-history-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 14px rgba(171, 71, 188, 0.5);
}

.conflict-history-button:active {
  transform: translateY(-1px);
}

/* Conflict History Modal */
.conflict-history-modal {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111;
  margin: 0;
  display: flex;
  align-items: center;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #e0e0e0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #CE93D8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #757575;
  text-align: center;
}

.conflict-history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conflict-history-item {
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #9c27b0;
}

.conflict-history-item:hover {
  background-color: #f5f5f5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.conflict-info {
  flex: 1;
}

.conflict-date {
  font-size: 0.75rem;
  color: #757575;
  margin-bottom: 0.5rem;
}

.conflict-products {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
}

.view-detail {
  color: #9c27b0;
  font-size: 0.875rem;
}

/* Conflict Detail Modal */
.conflict-detail-modal {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.conflict-detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 500;
  color: #424242;
  margin: 0 0 0.75rem;
}

/* Products */
.product-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conflict-product-card {
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 64px;
  height: 64px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 1rem;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.product-description {
  font-size: 0.875rem;
  color: #666;
}

/* Conflicts */
.conflicts-list, .safe-combo-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conflict-item {
  background-color: #fff2f4;
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #f44336;
}

.conflict-components {
  font-size: 1rem;
  font-weight: 600;
  color: #d32f2f;
  margin-bottom: 0.5rem;
}

.conflict-severity {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.severity-高 {
  background-color: #ffebee;
  color: #d32f2f;
}

.severity-中 {
  background-color: #fff8e1;
  color: #ff8f00;
}

.severity-低 {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.conflict-description {
  font-size: 0.9375rem;
  color: #616161;
  margin-bottom: 0.75rem;
}

.conflict-effects {
  background-color: #fff;
  border-radius: 6px;
  padding: 0.75rem;
}

.effects-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #616161;
  margin-bottom: 0.5rem;
}

.conflict-effects ul {
  margin: 0;
  padding-left: 1.5rem;
}

.conflict-effects li {
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 0.25rem;
}

/* Safe Combinations */
.safe-combo-item {
  background-color: #f1f8e9;
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid #8bc34a;
}

.combo-components {
  font-size: 1rem;
  font-weight: 600;
  color: #558b2f;
  margin-bottom: 0.5rem;
}

.combo-description {
  font-size: 0.9375rem;
  color: #616161;
}

/* Recommendations */
.pairings-container, .routines-container {
  margin-top: 1rem;
}

.pairings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pairing-item {
  border-radius: 8px;
  padding: 0.75rem;
}

.pairing-item.cannot-use {
  background-color: #ffebee;
  border-left: 3px solid #f44336;
}

.pairing-item.can-use {
  background-color: #e8f5e9;
  border-left: 3px solid #4caf50;
}

.pairing-products {
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.pairing-reason {
  font-size: 0.875rem;
  color: #616161;
}

.routine-section {
  margin-bottom: 1rem;
}

.routine-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #616161;
  font-size: 0.9375rem;
  font-weight: 500;
}

.routine-steps {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0.75rem;
}

.routine-step {
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.875rem;
  color: #424242;
}

.routine-step:last-child {
  border-bottom: none;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Product Form Modal */
.product-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.product-modal {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.header-image {
  position: relative;
  height: 120px;
  background-image: url('https://images.unsplash.com/photo-1556228578-769fc5bd7976?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right bottom, rgba(255, 182, 193, 0.7), rgba(216, 180, 254, 0.7));
  display: flex;
  justify-content: center;
  align-items: center;
}

.paw-icon {
  font-size: 2.5rem;
  color: white;
  margin-right: -10px;
  transform: rotate(-15deg);
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

.plus-icon {
  font-size: 1.75rem;
  color: white;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

.modal-header {
  position: relative;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 16px;
  z-index: 2;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 1rem 1.5rem 0.25rem;
  text-align: center;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem;
  text-align: center;
  padding: 0 1.5rem;
}

.modal-content {
  padding: 0.5rem 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
}

.error-message {
  background-color: #FFEBEE;
  color: #D32F2F;
  padding: 0.75rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.error-message svg {
  margin-right: 0.5rem;
  font-size: 16px;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #FF9A9E, #FECFEF);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 154, 158, 0.5);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Progress step styles */
.progress-steps {
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
}

.progress-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.progress-step:last-child {
  margin-bottom: 0;
}

.progress-step.active {
  opacity: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  background-color: #E0E0E0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  color: #757575;
  flex-shrink: 0;
}

.progress-step.active .step-number {
  background: linear-gradient(135deg, #FF9A9E, #FECFEF);
  color: white;
}

.progress-step.complete .step-number {
  background: linear-gradient(135deg, #A8EDEA, #FED6E3);
  color: white;
}

/* Add Product Component */
.add-product-container {
  margin-bottom: 1.5rem;
}

.add-product-card {
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.add-product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.add-product-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
}

.title-icon {
  color: #FF9A9E;
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.add-product-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.option-button {
  background-color: #f9f9f9;
  border: none;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.option-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.option-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9A9E, #FECFEF);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(255, 154, 158, 0.3);
}

.option-icon {
  font-size: 1.5rem;
  color: white;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.option-description {
  font-size: 0.75rem;
  color: #757575;
}
</style> 