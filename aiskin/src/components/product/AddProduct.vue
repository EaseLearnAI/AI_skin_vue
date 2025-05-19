<template>
  <div class="bg-white rounded-[16px] shadow-lg cat-card p-4 mb-5">
    <h3 class="text-base font-medium mb-3 flex items-center">
      <font-awesome-icon :icon="['fas', 'plus-circle']" class="mr-2 text-sakura-500" />
      添加新产品到猫窝
    </h3>
    <div class="grid grid-cols-2 gap-3">
      <button class="flex flex-col items-center justify-center p-4 bg-sakura-100 rounded-xl hover:bg-sakura-200 transition-colors shadow-md ripple-button" @click="openUploadModal">
        <div class="w-12 h-12 bg-gradient-to-br from-sakura-400 to-sakura-600 rounded-full flex items-center justify-center mb-2">
          <font-awesome-icon :icon="['fas', 'camera']" class="text-white text-xl" />
        </div>
        <span class="text-sm font-medium">添加产品</span>
        <p class="text-xs text-gray-500 mt-1">猫眼扫描成分</p>
      </button>
      <button class="flex flex-col items-center justify-center p-4 bg-sakura-100 rounded-xl hover:bg-sakura-200 transition-colors shadow-md ripple-button" @click="enableParentConflictMode">
        <div class="w-12 h-12 bg-gradient-to-br from-sakura-400 to-sakura-600 rounded-full flex items-center justify-center mb-2">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="text-white text-xl" />
        </div>
        <span class="text-sm font-medium">产品冲突成分检测</span>
        <p class="text-xs text-gray-500 mt-1">检测产品成分间潜在冲突</p>
      </button>
    </div>
    
    <!-- Product Form Modal -->
    <div v-if="showUploadModal" class="product-modal-backdrop" @click.self="showUploadModal = false">
      <div class="product-modal">
        <div class="modal-header">
          <div class="header-image">
            <div class="image-overlay">
              <font-awesome-icon :icon="['fas', 'paw']" class="paw-icon" />
              <font-awesome-icon :icon="['fas', 'plus-circle']" class="plus-icon" />
            </div>
          </div>
          <button class="close-button" @click="showUploadModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
          <h3 class="modal-title">添加护肤产品</h3>
          <p class="modal-subtitle">上传产品图片，AI将自动识别产品成分并进行分析</p>
        </div>
        
        <div class="modal-content">
          <div v-if="error" class="error-message">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
            <p>{{ errorMessage }}</p>
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
  </div>
</template>

<script>
import ImageUploader from './ImageUploader.vue'
import productApi from '@/api/productApi'
import fileService from '@/services/fileService'
import authService from '@/services/authService'

export default {
  name: 'AddProduct',
  components: {
    ImageUploader
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // Modal display control
      showUploadModal: false,
      
      // Form data and state
      formData: {
        name: '未命名产品',
        description: '这是一个用于成分分析的产品',
        label: '',
        openingDate: new Date().toISOString()
      },
      selectedImage: null,
      productId: null,
      imageUrl: '',
      
      // Status flags
      isLoading: false,
      isExtracting: false,
      isAnalyzing: false,
      error: false,
      errorMessage: '',
      
      // Progress tracking
      showProgressSteps: false,
      currentStep: 0,
      stepStatus: {
        create: '等待创建',
        upload: '等待上传',
        extract: '等待提取',
        analyze: '等待分析'
      }
    }
  },
  computed: {
    canSubmit() {
      return this.selectedImage
    },
    submitButtonText() {
      if (this.isExtracting) return '正在提取成分...'
      if (this.isAnalyzing) return '正在分析成分...'
      return '上传图片并分析'
    },
    currentUserId() {
      // Get from props first, or use auth service
      if (this.userId) return this.userId
      
      const user = authService.getCurrentUser()
      return user && user._id ? user._id : ''
    }
  },
  methods: {
    openUploadModal() {
      this.resetForm()
      this.showUploadModal = true
    },
    enableParentConflictMode() {
      // Access parent ProductView component to enable conflict mode
      // This uses the parent's enableConflictMode method
      const parent = this.$parent;
      if (parent && typeof parent.enableConflictMode === 'function') {
        parent.enableConflictMode();
      }
    },
    onImageSelected(image) {
      console.log('🖼️ Image selected', image)
      this.selectedImage = image
      this.error = false
    },
    onImageRemoved() {
      console.log('🖼️ Image removed')
      this.selectedImage = null
    },
    onUploadStart() {
      console.log('🖼️ Upload started')
    },
    onUploadComplete() {
      console.log('🖼️ Upload completed')
    },
    async submitProduct() {
      if (!this.canSubmit) return
      
      this.isLoading = true
      this.error = false
      this.showProgressSteps = true
      this.currentStep = 1
      
      try {
        // Step 1: Create product - using default values now, no tag selection
        this.stepStatus.create = '创建中...'
        const createResponse = await productApi.createProduct({
          name: this.formData.name,
          description: this.formData.description,
          label: this.formData.label,
          openingDate: this.formData.openingDate
        })
        
        if (!createResponse.success) {
          throw new Error(createResponse.message || '创建产品失败')
        }
        
        this.productId = createResponse.data.product._id
        this.stepStatus.create = '创建成功'
        this.currentStep = 2
        
        // Step 2: Upload product image
        this.stepStatus.upload = '上传中...'
        
        const formData = fileService.createFormData(this.selectedImage.file)
        const uploadResponse = await productApi.uploadProductImage(this.productId, formData)
        
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || '上传图片失败')
        }
        
        this.imageUrl = uploadResponse.data.imageUrl
        this.stepStatus.upload = '上传成功'
        this.currentStep = 3
        
        // Step 3: Extract product info
        this.isExtracting = true
        this.stepStatus.extract = '提取中...'
        
        const extractResponse = await productApi.extractProductInfo(this.productId)
        
        if (!extractResponse.success) {
          throw new Error(extractResponse.message || '提取成分失败')
        }
        
        // Update product name if it was extracted
        if (extractResponse.data.name) {
          this.formData.name = extractResponse.data.name
        }
        
        this.stepStatus.extract = `提取成功，识别到${extractResponse.data.ingredients.length}种成分`
        this.currentStep = 4
        this.isExtracting = false
        
        // Step 4: Analyze ingredients
        this.isAnalyzing = true
        this.stepStatus.analyze = '分析中...'
        
        const analyzeResponse = await productApi.analyzeIngredients(this.productId)
        
        if (!analyzeResponse.success) {
          throw new Error(analyzeResponse.message || '分析成分失败')
        }
        
        this.stepStatus.analyze = '分析成功'
        this.currentStep = 5
        this.isAnalyzing = false
        
        // Complete and directly navigate to the ingredient analysis page
        console.log('✅ Product process completed', {
          productId: this.productId,
          imageUrl: this.imageUrl
        })
        
        // Emit success event
        this.$emit('product-success', {
          productId: this.productId,
          name: this.formData.name,
          imageUrl: this.imageUrl
        })
        
        // Close upload modal and navigate to ingredient view
        this.showUploadModal = false
        
        // Navigate to ingredient analysis page
        this.$router.push(`/ingredient/${this.productId}`)
        
      } catch (error) {
        console.error('❌ Error in product submission', error)
        this.error = true
        this.errorMessage = error.message || '处理失败，请重试'
        
        // Update step status based on error
        if (this.currentStep === 1) {
          this.stepStatus.create = '创建失败'
        } else if (this.currentStep === 2) {
          this.stepStatus.upload = '上传失败'
        } else if (this.currentStep === 3) {
          this.stepStatus.extract = '提取失败'
          this.isExtracting = false
        } else if (this.currentStep === 4) {
          this.stepStatus.analyze = '分析失败'
          this.isAnalyzing = false
        }
      } finally {
        this.isLoading = false
      }
    },
    resetForm() {
      this.formData = {
        name: '未命名产品',
        description: '这是一个用于成分分析的产品',
        label: '',
        openingDate: new Date().toISOString()
      }
      this.selectedImage = null
      this.productId = null
      this.imageUrl = ''
      this.isLoading = false
      this.isExtracting = false
      this.isAnalyzing = false
      this.error = false
      this.errorMessage = ''
      this.showProgressSteps = false
      this.currentStep = 0
      this.stepStatus = {
        create: '等待创建',
        upload: '等待上传',
        extract: '等待提取',
        analyze: '等待分析'
      }
      
      // Reset image uploader
      if (this.$refs.imageUploader) {
        this.$refs.imageUploader.removeImage()
      }
    }
  }
}
</script>

<style scoped>
/* Cat Card Animation */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
.float-animation {
  animation: float 3s ease-in-out infinite;
}
.cat-card {
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  transition: all 0.3s ease;
}
.cat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 182, 193, 0.25);
}

/* Button Effects */
.ripple-button {
  position: relative;
  overflow: hidden;
  border: none;
}
.ripple-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 0.8s;
}
.ripple-button:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

/* New Modal Styles */
/* 弹窗遮罩：全屏固定＋居中 */
.product-modal-backdrop {
  position: fixed;      /* 相对于视口 */
  inset: 0;             /* top:0; right:0; bottom:0; left:0 */
  display: flex;
  align-items: center;  /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  backdrop-filter: blur(16px);
}

/* 弹窗容器 */
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


@keyframes modalFadeIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
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

.step-content {
  flex-grow: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: #424242;
}

.step-description {
  font-size: 12px;
  color: #757575;
  margin: 0;
}

/* Tailwind-like utility classes */
.bg-white { background-color: white; }
.bg-sakura-100 { background-color: #FFF9FB; }
.bg-sakura-200 { background-color: #FFECF2; }
.bg-gradient-to-br { background: linear-gradient(to bottom right, #FFBBD0, #E1BEE7); }
.from-sakura-400 { color: #FFBBD0; } /* Not used directly - for reference */
.to-sakura-600 { color: #E1BEE7; } /* Not used directly - for reference */
.rounded-\[16px\] { border-radius: 16px; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.p-4 { padding: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mr-2 { margin-right: 0.5rem; }
.mt-1 { margin-top: 0.25rem; }
.text-base { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-xl { font-size: 1.25rem; }
.font-medium { font-weight: 500; }
.text-sakura-500 { color: #F8BBD0; }
.text-white { color: white; }
.text-gray-500 { color: #6b7280; }
.flex { display: flex; }
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-3 { gap: 0.75rem; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.flex-col { flex-direction: column; }
.transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.hover\:bg-sakura-200:hover { background-color: #FFECF2; }
.w-12 { width: 3rem; }
.h-12 { height: 3rem; }
</style> 