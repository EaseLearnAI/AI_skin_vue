<template>
  <div class="core-features">
    <div class="section-header">
      <div class="icon-container">
        <font-awesome-icon :icon="['fas', 'bolt']" />
      </div>
      <h2 class="title">核心功能</h2>
    </div>
    
    <div class="features-grid">
      <!-- Product Analysis -->
      <router-link to="/product" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'flask']" />
          </div>
          <h3 class="feature-title">产品分析</h3>
          <p class="feature-description">AI智能解析成分</p>
        </div>
      </router-link>

      <!-- Conflict Detection -->
      <router-link to="/product?conflictMode=true" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
          </div>
          <h3 class="feature-title">冲突检测</h3>
          <p class="feature-description">避免产品成分冲突</p>
        </div>
      </router-link>

      <!-- Personalized Routine -->
      <div class="feature-card" @click="openPersonalizedRoutineModal">
        <div class="feature-content">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'magic']" />
          </div>
          <h3 class="feature-title">个性化方案</h3>
          <p class="feature-description">AI定制护肤方案</p>
        </div>
      </div>

      <!-- Smart Scan -->
      <router-link to="/product?scanMode=true" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'qrcode']" />
          </div>
          <h3 class="feature-title">肌肤检测</h3>
          <p class="feature-description">AI智能皮肤分析</p>
        </div>
      </router-link>
    </div>
    
    <!-- Personalized Routine Modal -->
    <AppModal :show="showPersonalizedRoutineModal" @close="showPersonalizedRoutineModal = false">
      <div class="routine-modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">
            <font-awesome-icon :icon="['fas', 'magic']" class="mr-2" />
            个性化护肤方案
          </h3>
          <button class="close-button" @click="showPersonalizedRoutineModal = false">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="loadingPlan" class="loading-container">
          <div class="loading-spinner"></div>
          <p>AI正在为您定制专属护肤方案...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="planError" class="error-message">
          {{ planError }}
        </div>
        
        <!-- Input State (Initial or Reset) -->
        <div v-else-if="!generatedPlan" class="routine-input">
          <p class="input-description">
            请告诉我您的护肤需求和肌肤状况，AI将为您定制个性化护肤方案。
          </p>
          
          <!-- Skin Concerns -->
          <div class="input-group">
            <label class="input-label">护肤需求</label>
            <div class="skin-concerns">
              <button 
                v-for="concern in skinConcerns" 
                :key="concern.value"
                class="concern-button"
                :class="{ active: selectedConcerns.includes(concern.value) }"
                @click="toggleConcern(concern.value)"
              >
                <font-awesome-icon :icon="concern.icon" class="mr-2" />
                {{ concern.label }}
              </button>
            </div>
          </div>
          
          <!-- Skin Type -->
          <div class="input-group">
            <label class="input-label">肌肤类型</label>
            <div class="skin-types">
              <button 
                v-for="type in skinTypes" 
                :key="type.value"
                class="type-button"
                :class="{ active: selectedSkinType === type.value }"
                @click="selectedSkinType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          
          <!-- Custom Requirements -->
          <div class="input-group">
            <label class="input-label">其他需求</label>
            <textarea 
              v-model="customRequirements" 
              class="custom-requirements" 
              placeholder="描述您的其他特殊需求，如敏感肌、痘痘肌等..."
              rows="3"
            ></textarea>
          </div>
          
          <!-- Submit Button -->
          <button 
            class="generate-button" 
            @click="generatePersonalizedPlan"
            :disabled="selectedConcerns.length === 0 || !selectedSkinType"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="mr-2" />
            开始生成
          </button>
        </div>
        
        <!-- Result State -->
        <div v-else class="routine-result">
          <PersonalizedRoutinePreview 
            :plan="generatedPlan" 
            @save-routine="savePlanToRoutine" 
            @customize-routine="resetPlan"
          />
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script>
import AppModal from '@/components/common/AppModal.vue'
import PersonalizedRoutinePreview from '@/components/home/PersonalizedRoutinePreview.vue'
import * as planApi from '@/api/planApi'
import authService from '@/services/authService'

export default {
  name: 'CoreFeatures',
  components: {
    AppModal,
    PersonalizedRoutinePreview
  },
  data() {
    return {
      showPersonalizedRoutineModal: false,
      loadingPlan: false,
      planError: null,
      generatedPlan: null,
      selectedConcerns: [],
      selectedSkinType: '',
      customRequirements: '',
      
      // Predefined options
      skinConcerns: [
        { label: '补水', value: 'hydration', icon: ['fas', 'tint'] },
        { label: '美白', value: 'brightening', icon: ['fas', 'sun'] },
        { label: '抗老', value: 'anti-aging', icon: ['fas', 'clock'] },
        { label: '控油', value: 'oil-control', icon: ['fas', 'oil-can'] },
        { label: '修护', value: 'repair', icon: ['fas', 'band-aid'] },
        { label: '祛痘', value: 'acne', icon: ['fas', 'virus'] }
      ],
      skinTypes: [
        { label: '干性肌肤', value: 'dry' },
        { label: '油性肌肤', value: 'oily' },
        { label: '混合性肌肤', value: 'combination' },
        { label: '中性肌肤', value: 'normal' },
        { label: '敏感肌肤', value: 'sensitive' }
      ]
    }
  },
  methods: {
    openPersonalizedRoutineModal() {
      this.showPersonalizedRoutineModal = true
    },
    toggleConcern(concern) {
      const index = this.selectedConcerns.indexOf(concern)
      if (index === -1) {
        // Add if not already selected (max 3)
        if (this.selectedConcerns.length < 3) {
          this.selectedConcerns.push(concern)
        }
      } else {
        // Remove if already selected
        this.selectedConcerns.splice(index, 1)
      }
    },
    async generatePersonalizedPlan() {
      if (this.selectedConcerns.length === 0 || !this.selectedSkinType) {
        return
      }
      
      this.loadingPlan = true
      this.planError = null
      
      try {
        // Get user ID
        const user = authService.getCurrentUser()
        if (!user || !user._id) {
          this.planError = '用户未登录，请先登录'
          this.loadingPlan = false
          return
        }
        
        // Prepare request data
        const planData = {
          userId: user._id,
          skinType: this.selectedSkinType,
          skinConcerns: this.selectedConcerns,
          customRequirements: this.customRequirements
        }
        
        // Call API
        console.log('🔍 发送个性化护肤方案请求:', planData)
        const response = await planApi.createPlan(planData)
        
        if (response.success) {
          console.log('✅ 获取个性化护肤方案成功:', response)
          this.generatedPlan = response.data.plan
        } else {
          this.planError = response.message || '获取个性化护肤方案失败'
          console.error('❌ 获取个性化护肤方案失败:', response)
        }
      } catch (error) {
        this.planError = '获取个性化护肤方案时出错，请重试'
        console.error('❌ 获取个性化护肤方案错误:', error)
      } finally {
        this.loadingPlan = false
      }
    },
    getSkinTypeLabel(value) {
      const type = this.skinTypes.find(t => t.value === value)
      return type ? type.label : ''
    },
    getConcernLabel(value) {
      const concern = this.skinConcerns.find(c => c.value === value)
      return concern ? concern.label : ''
    },
    resetPlan() {
      this.generatedPlan = null
      this.selectedConcerns = []
      this.selectedSkinType = ''
      this.customRequirements = ''
    },
    savePlanToRoutine() {
      // Convert plan data to the format expected by DailyRoutine
      if (this.generatedPlan) {
        // Create a correctly formatted plan object
        const formattedPlan = {
          routines: {
            morning: [],
            evening: []
          },
          recommendations: this.generatedPlan.recommendations || []
        };
        
        // Format morning routine
        if (this.generatedPlan.morning && this.generatedPlan.morning.length > 0) {
          formattedPlan.routines.morning = this.generatedPlan.morning.map(item => item.product);
        }
        
        // Format evening routine
        if (this.generatedPlan.evening && this.generatedPlan.evening.length > 0) {
          formattedPlan.routines.evening = this.generatedPlan.evening.map(item => item.product);
        }
        
        // Save to DailyRoutine.vue
        this.$emit('save-routine', formattedPlan);
        console.log('护肤方案已格式化并发送给父组件:', formattedPlan);
      } else {
        console.error('没有可用的护肤方案数据');
      }
      
      this.showPersonalizedRoutineModal = false;
      
      // Navigate to home page to see the updated daily routine
      this.$router.push({ path: '/' });
      
      // Use a non-modal notification instead of alert
      this.$emit('show-notification', '护肤方案已保存到您的日常护理中');
    }
  }
}
</script>

<style scoped>
.core-features {
  padding: 1rem 0.5rem;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15);
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-container {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #CE93D8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Fixed 4-grid layout */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  max-width: 100%;
}

/* Ensure grid maintains 2x2 layout on all screen sizes */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

.feature-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  aspect-ratio: 1 / 1;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #F3E5F5;
  color: #AB47BC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.feature-description {
  font-size: 0.875rem;
  color: #757575;
  margin: 0;
}

/* Personalized Routine Modal Styles */
.routine-modal {
  background-color: white;
  border-radius: 20px;
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
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.close-button {
  width: 36px;
  height: 36px;
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
  padding: 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9c27b0;
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
  border-radius: 12px;
  margin: 1rem 0;
  text-align: center;
}

/* Input State Styles */
.routine-input {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-description {
  font-size: 0.9375rem;
  color: #666;
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.skin-concerns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.concern-button {
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  background-color: #f5f5f5;
  border: 1px solid transparent;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.concern-button:hover {
  background-color: #e0e0e0;
}

.concern-button.active {
  background-color: #f3e5f5;
  border-color: #ce93d8;
  color: #9c27b0;
}

.skin-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.type-button {
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  background-color: #f5f5f5;
  border: 1px solid transparent;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-button:hover {
  background-color: #e0e0e0;
}

.type-button.active {
  background-color: #f3e5f5;
  border-color: #ce93d8;
  color: #9c27b0;
}

.custom-requirements {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  font-size: 0.9375rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.custom-requirements:focus {
  outline: none;
  border-color: #ce93d8;
  box-shadow: 0 0 0 2px rgba(206, 147, 216, 0.2);
}

.generate-button {
  padding: 0.875rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #ab47bc, #7b1fa2);
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.generate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(123, 31, 162, 0.3);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Result State Styles */
.routine-result {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-header {
  margin-bottom: 0.5rem;
}

.result-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.75rem;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skin-type-tag, .concern-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skin-type-tag {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.concern-tag {
  background-color: #e3f2fd;
  color: #1976d2;
}

.section-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
}

/* Recommended Products */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-item {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 0.875rem;
  border-left: 3px solid #9c27b0;
  transition: all 0.2s ease;
}

.product-item:hover {
  background-color: #f5f5f5;
  transform: translateX(3px);
}

.product-category {
  font-size: 0.75rem;
  color: #9c27b0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.375rem;
}

.product-reason {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

/* Routine Sections */
.routine-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.routine-step {
  display: flex;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 0.875rem;
  transition: all 0.25s ease;
  align-items: center;
}

.routine-step:hover {
  background-color: #f5f5f5;
  transform: translateX(3px);
}

.step-number {
  width: 24px;
  height: 24px;
  background-color: #9c27b0;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.step-content {
  font-size: 0.9375rem;
  color: #333;
  line-height: 1.5;
}

/* Tips Section */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.9375rem;
  color: #555;
  line-height: 1.5;
}

.tip-icon {
  color: #9c27b0;
  margin-right: 0.625rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-button, .reset-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.save-button {
  background: linear-gradient(135deg, #ab47bc, #7b1fa2);
  color: white;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(123, 31, 162, 0.25);
}

.reset-button {
  background-color: #f5f5f5;
  color: #666;
}

.reset-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.mr-2 {
  margin-right: 0.5rem;
}
</style> 