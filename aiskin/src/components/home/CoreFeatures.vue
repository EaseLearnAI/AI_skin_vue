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

      <!-- Smart Scan -->
      <router-link to="/skinstatus" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <font-awesome-icon :icon="['fas', 'camera']" />
          </div>
          <h3 class="feature-title">肌肤检测</h3>
          <p class="feature-description">AI智能皮肤分析</p>
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
            请告诉我您的护肤需求，AI将结合您的最新肌肤检测结果为您定制个性化护肤方案。
          </p>
          
          <!-- 显示最新皮肤状态 -->
          <div v-if="latestSkinAnalysis" class="skin-status-section">
            <label class="input-label">最新肌肤状态</label>
            <div class="skin-status-card">
              <div class="skin-status-header">
                <div class="health-score">
                  <span class="score-number">{{ latestSkinAnalysis.healthScore }}</span>
                  <span class="score-label">健康分</span>
                </div>
                <div class="skin-type">
                  <span class="type-text">{{ latestSkinAnalysis.skinType }}</span>
                  <span class="condition-text">{{ latestSkinAnalysis.skinCondition }}</span>
                </div>
              </div>
              <div class="skin-status-details">
                <div class="status-item">
                  <span class="status-label">检测时间：</span>
                  <span class="status-value">{{ formatAnalysisDate(latestSkinAnalysis.analysisDate) }}</span>
                </div>
                <div class="status-item">
                  <span class="status-label">主要特征：</span>
                  <span class="status-value">{{ getSkinFeatures() }}</span>
                </div>
              </div>
              <div class="refresh-analysis">
                <button class="refresh-btn" @click="refreshSkinAnalysis">
                  <font-awesome-icon :icon="['fas', 'sync-alt']" class="mr-1" />
                  重新检测
                </button>
              </div>
            </div>
          </div>
          
          <!-- 无皮肤分析数据时的提示 -->
          <div v-else class="no-analysis-section">
            <label class="input-label">肌肤状态</label>
            <div class="no-analysis-card">
              <div class="no-analysis-icon">
                <font-awesome-icon :icon="['fas', 'search-plus']" />
              </div>
              <p class="no-analysis-text">您还没有进行肌肤检测</p>
              <p class="no-analysis-desc">建议先进行AI肌肤检测，以获得更精准的护肤方案</p>
              <button class="go-analysis-btn" @click="goToSkinAnalysis">
                <font-awesome-icon :icon="['fas', 'camera']" class="mr-2" />
                立即检测
              </button>
            </div>
          </div>
          
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
            :disabled="selectedConcerns.length === 0"
          >
            <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="mr-2" />
            {{ latestSkinAnalysis ? '生成个性化方案' : '基于需求生成方案' }}
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
import skinAnalysisApi from '@/api/skinAnalysisApi'

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
      customRequirements: '',
      latestSkinAnalysis: null,
      loadingSkinAnalysis: false,
      
      // Predefined options
      skinConcerns: [
        { label: '补水', value: 'hydration', icon: ['fas', 'tint'] },
        { label: '美白', value: 'brightening', icon: ['fas', 'sun'] },
        { label: '抗老', value: 'anti-aging', icon: ['fas', 'clock'] },
        { label: '控油', value: 'oil-control', icon: ['fas', 'oil-can'] },
        { label: '修护', value: 'repair', icon: ['fas', 'band-aid'] },
        { label: '祛痘', value: 'acne', icon: ['fas', 'virus'] }
      ]
    }
  },
  async mounted() {
    // 组件挂载时获取最新皮肤分析数据
    await this.loadLatestSkinAnalysis();
  },
  methods: {
    async openPersonalizedRoutineModal() {
      this.showPersonalizedRoutineModal = true;
      // 每次打开弹窗时刷新皮肤分析数据
      await this.loadLatestSkinAnalysis();
    },
    
    async loadLatestSkinAnalysis() {
      console.group('📊 加载最新皮肤分析数据');
      this.loadingSkinAnalysis = true;
      
      try {
        const response = await skinAnalysisApi.getAnalysisHistory(1, 1);
        
        if (response.success && response.data.analyses.length > 0) {
          const analysis = response.data.analyses[0];
          this.latestSkinAnalysis = {
            analysisId: analysis._id,
            healthScore: analysis.overallAssessment?.healthScore || 0,
            skinType: analysis.skinType?.type || '未知',
            skinCondition: analysis.overallAssessment?.skinCondition || '未知',
            analysisDate: analysis.createdAt,
            summary: analysis.overallAssessment?.summary || '',
            // 其他详细信息用于显示特征
            blackheads: analysis.blackheads,
            acne: analysis.acne,
            pores: analysis.pores,
            otherIssues: analysis.otherIssues
          };
          
          console.log('✅ 皮肤分析数据加载成功:', {
            ID: this.latestSkinAnalysis.analysisId,
            健康评分: this.latestSkinAnalysis.healthScore,
            皮肤类型: this.latestSkinAnalysis.skinType,
            皮肤状况: this.latestSkinAnalysis.skinCondition
          });
        } else {
          console.log('ℹ️ 未找到皮肤分析数据');
          this.latestSkinAnalysis = null;
        }
      } catch (error) {
        console.error('❌ 加载皮肤分析数据失败:', error);
        this.latestSkinAnalysis = null;
      } finally {
        this.loadingSkinAnalysis = false;
      }
      
      console.groupEnd();
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
      if (this.selectedConcerns.length === 0) {
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
        
        // Prepare request data with new structure
        const planData = {
          skinConcerns: this.selectedConcerns,
          customRequirements: this.customRequirements
        }
        
        // Call API
        console.log('🔍 发送个性化护肤方案请求:', planData)
        const response = await planApi.createPlan(planData)
        
        if (response.success) {
          console.log('✅ 获取个性化护肤方案成功:', response)
          this.generatedPlan = response.data.plan
          
          // 显示皮肤分析集成信息
          if (response.data.skinAnalysisData?.hasAnalysis) {
            console.log('📊 已集成皮肤分析数据:', response.data.skinAnalysisData)
          } else {
            console.log('⚠️ 未找到皮肤分析数据，使用通用建议')
          }
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
    
    formatAnalysisDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return '今天';
      } else if (diffDays === 2) {
        return '昨天';
      } else if (diffDays <= 7) {
        return `${diffDays - 1}天前`;
      } else {
        return date.toLocaleDateString('zh-CN');
      }
    },
    
    getSkinFeatures() {
      if (!this.latestSkinAnalysis) return '';
      
      const features = [];
      const analysis = this.latestSkinAnalysis;
      
      if (analysis.blackheads?.exists) {
        features.push(`黑头${analysis.blackheads.severity}`);
      }
      if (analysis.acne?.exists) {
        features.push(`痘痘${analysis.acne.count}`);
      }
      if (analysis.pores?.enlarged) {
        features.push(`毛孔${analysis.pores.severity}`);
      }
      if (analysis.otherIssues?.redness?.exists) {
        features.push('有泛红');
      }
      if (analysis.otherIssues?.sensitivity?.exists) {
        features.push('较敏感');
      }
      
      return features.length > 0 ? features.join('、') : '状态良好';
    },
    
    refreshSkinAnalysis() {
      // 跳转到皮肤检测页面
      this.$router.push('/skinstatus');
      this.showPersonalizedRoutineModal = false;
    },
    
    goToSkinAnalysis() {
      // 跳转到皮肤检测页面
      this.$router.push('/skinstatus');
      this.showPersonalizedRoutineModal = false;
    },
    
    resetPlan() {
      this.generatedPlan = null
      this.selectedConcerns = []
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

/* 皮肤状态显示区域 */
.skin-status-section {
  margin-bottom: 1.5rem;
}

.skin-status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.25rem;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.skin-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.health-score {
  text-align: center;
}

.score-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.skin-type {
  text-align: right;
}

.type-text {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.condition-text {
  display: block;
  font-size: 0.875rem;
  opacity: 0.9;
}

.skin-status-details {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.875rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  opacity: 0.8;
}

.status-value {
  font-weight: 500;
}

.refresh-analysis {
  text-align: center;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 无皮肤分析数据状态 */
.no-analysis-section {
  margin-bottom: 1.5rem;
}

.no-analysis-card {
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.no-analysis-icon {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.no-analysis-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 0.5rem 0;
}

.no-analysis-desc {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.go-analysis-btn {
  background: linear-gradient(135deg, #ab47bc, #7b1fa2);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.go-analysis-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(123, 31, 162, 0.3);
}

.mr-1 {
  margin-right: 0.25rem;
}
</style> 