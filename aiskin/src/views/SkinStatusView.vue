<template>
  <div class="skin-status-container">
    <!-- Header -->
    <SkinAnalysisHeader @showHistory="openHistoryModal" />
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Welcome/Detection State - 默认显示 -->
      <SkinDetectionWelcome 
        @takePhoto="startPhotoCapture"
        @selectPhoto="selectPhoto"
      />
      
      <!-- Historical Results - 默认显示 (如果有历史数据) -->
      <div v-if="hasHistoryResults" class="history-section">
        <div class="history-header">
          <h3 class="history-title">
            <font-awesome-icon icon="history" class="history-icon" />
            上次检测结果
        </h3>
          <span class="history-date">{{ formatDate(lastAnalysisDate) }}</span>
        </div>
        
        <div class="history-summary">
          <!-- 简化的健康评分显示 -->
          <div class="mini-score-card" @click="showHistoryResults">
            <div class="mini-score">{{ lastAnalysisResult?.overallAssessment?.healthScore || 0 }}</div>
            <div class="mini-score-label">健康分</div>
            <div class="score-indicator" :class="getScoreClass(lastAnalysisResult?.overallAssessment?.healthScore || 0)"></div>
          </div>
          
          <div class="history-info">
            <p class="history-desc">{{ getHistorySummary() }}</p>
            <div class="history-actions">
              <button @click="showHistoryResults" class="view-history-btn">
                <font-awesome-icon icon="eye" />
                查看详情
          </button>
              <button @click="startNewAnalysis" class="new-analysis-btn">
                <font-awesome-icon icon="plus" />
                新检测
          </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Results State - 默认显示 (如果有结果) -->
      <div v-if="showResults && analysisResult" class="results-container">
        <!-- Health Score -->
        <HealthScoreCard :score="analysisResult.overallAssessment?.healthScore || 0" />
        
        <!-- Skin Type Analysis -->
        <SkinTypeAnalysis 
          :skinType="analysisResult.skinType"
          :oilLevel="analysisResult.oilLevel"
          :moistureLevel="analysisResult.moistureLevel"
          :poreLevel="analysisResult.poreLevel"
        />
        
        <!-- Skin Status Overview (整合的组件) -->
        <SkinStatusOverview 
          :blackheads="analysisResult.blackheads"
          :acne="analysisResult.acne"
          :pores="analysisResult.pores"
          :skinToneEvenness="analysisResult.otherIssues?.skinToneEvenness"
          :redness="analysisResult.otherIssues?.redness"
          :hyperpigmentation="analysisResult.otherIssues?.hyperpigmentation"
          :fineLines="analysisResult.otherIssues?.fineLines"
          :sensitivity="analysisResult.otherIssues?.sensitivity"
        />
        
        <!-- AI Recommendations -->
        <AIRecommendations :recommendations="analysisResult.overallAssessment?.recommendations || []" />

      </div>


    </div>
    
    <!-- Analyzing Modal - 悬浮于整个页面 -->
    <div v-if="isAnalyzing" class="analyzing-modal-overlay">
      <div class="analyzing-modal">
        <div class="analyzing-card">
          <div class="spinner-container">
            <div class="spinner"></div>
          </div>
          <h2 class="analyzing-title">AI正在分析中...</h2>
          <p class="analyzing-subtitle">{{ analysisStatus }}</p>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ Math.round(progress) }}%</span>
          </div>
          <p class="analyzing-tip">请稍候，通常需要10-30秒完成分析</p>
        </div>
      </div>
    </div>
    
    <!-- History Modal - 修复z-index问题 -->
    <div v-if="showHistoryModal" class="history-modal-overlay" @click="closeHistoryModal">
      <div class="history-modal" @click.stop>
        <div class="modal-header">
          <h3>检测历史</h3>
          <button @click="closeHistoryModal" class="close-btn">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-content">
          <div v-if="historyList.length === 0" class="no-history">
            <font-awesome-icon icon="search-plus" class="no-history-icon" />
            <p>暂无检测历史</p>
          </div>
          <div v-else class="history-list">
            <div 
              v-for="(history, index) in historyList" 
              :key="index"
              class="history-item"
              @click="loadHistoryResult(history)"
            >
              <div class="history-item-score">{{ history.overallAssessment?.healthScore || 0 }}</div>
              <div class="history-item-info">
                <div class="history-item-date">{{ formatDate(history.createdAt) }}</div>
                <div class="history-item-summary">{{ history.overallAssessment?.summary || '无摘要' }}</div>
              </div>
              <font-awesome-icon icon="chevron-right" class="history-item-arrow" />
            </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <BottomNavigation />

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-toast" @click="clearError">
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import SkinAnalysisHeader from '@/components/skin-analysis/SkinAnalysisHeader.vue'
import SkinDetectionWelcome from '@/components/skin-analysis/SkinDetectionWelcome.vue'
import HealthScoreCard from '@/components/skin-analysis/HealthScoreCard.vue'
import SkinTypeAnalysis from '@/components/skin-analysis/SkinTypeAnalysis.vue'
import SkinStatusOverview from '@/components/skin-analysis/SkinStatusOverview.vue'
import AIRecommendations from '@/components/skin-analysis/AIRecommendations.vue'

import BottomNavigation from '@/components/common/BottomNavigation.vue'
import skinAnalysisApi from '@/api/skinAnalysisApi'

export default {
  name: 'SkinStatusView',
  components: {
    SkinAnalysisHeader,
    SkinDetectionWelcome,
    HealthScoreCard,
    SkinTypeAnalysis,
    SkinStatusOverview,
    AIRecommendations,

    BottomNavigation
  },
  data() {
    return {
      isAnalyzing: false,
      showResults: false,
      showHistoryModal: false,
      progress: 0,
      selectedFile: null,
      hasHistoryResults: false,
      lastAnalysisDate: null,
      lastAnalysisResult: null,
      historyList: [],
      analysisResult: null,
      errorMessage: '',
      analysisStatus: '正在上传图片到云端...'
    }
  },
  async mounted() {
    console.log('🎯 SkinStatusView 组件加载完成');
    await this.loadHistoryData();
  },
  methods: {
    // 加载历史数据
    async loadHistoryData() {
      console.group('📚 加载历史数据');
      try {
        const response = await skinAnalysisApi.getAnalysisHistory(1, 10);
        
        if (response.success && response.data.analyses.length > 0) {
          this.historyList = response.data.analyses;
          // 获取最新的分析结果
          const latest = this.historyList[0];
          this.lastAnalysisResult = latest;
          this.lastAnalysisDate = latest.createdAt;
          this.hasHistoryResults = true;
          
          console.log('✅ 历史数据加载成功', {
            总记录数: response.data.pagination.total,
            最新记录: {
              ID: latest._id,
              健康评分: latest.overallAssessment?.healthScore,
              皮肤类型: latest.skinType?.type,
              创建时间: latest.createdAt
            }
          });
        } else {
          console.log('ℹ️ 暂无历史记录');
        }
      } catch (error) {
        console.error('❌ 加载历史数据失败:', error);
      }
      console.groupEnd();
    },
    
    // 显示历史结果
    showHistoryResults() {
      if (this.lastAnalysisResult) {
        console.log('📊 显示历史分析结果:', this.lastAnalysisResult._id);
        this.analysisResult = this.lastAnalysisResult;
        this.showResults = true;
      }
    },
    
    // 开始新分析
    startNewAnalysis() {
      console.log('🔄 开始新的皮肤分析');
      this.resetAnalysis();
    },
    
    // 加载特定历史结果
    loadHistoryResult(historyItem) {
      console.log('📋 加载历史分析结果:', historyItem._id);
      this.analysisResult = historyItem;
      this.showResults = true;
      this.closeHistoryModal();
    },
    
    // 显示历史弹窗
    openHistoryModal() {
      console.log('📂 打开历史记录弹窗');
      this.showHistoryModal = true;
    },
    
    // 关闭历史弹窗
    closeHistoryModal() {
      console.log('❌ 关闭历史记录弹窗');
      this.showHistoryModal = false;
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
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
    
    // 获取评分等级样式
    getScoreClass(score) {
      if (score >= 80) return 'excellent';
      if (score >= 60) return 'good';
      return 'needs-improvement';
    },
    
    // 获取历史摘要
    getHistorySummary() {
      if (!this.lastAnalysisResult) return '';
      return this.lastAnalysisResult.overallAssessment?.summary || 
             `${this.lastAnalysisResult.skinType?.type}，肌肤状态${this.lastAnalysisResult.overallAssessment?.skinCondition}`;
    },
    
    // 拍照
    async startPhotoCapture() {
      console.log('📸 启动拍照功能');
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // 后置摄像头
        
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            console.log('📷 拍照完成，文件大小:', (file.size / 1024).toFixed(2), 'KB');
            this.processImageFile(file);
          }
        };
        
        input.click();
      } catch (error) {
        console.error('❌ 拍照失败:', error);
        this.showError('拍照失败，请重试');
      }
    },
    
    // 选择照片
    async selectPhoto() {
      console.log('🖼️ 启动照片选择功能');
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            console.log('📁 照片选择完成，文件大小:', (file.size / 1024).toFixed(2), 'KB');
            this.processImageFile(file);
          }
        };
        
        input.click();
      } catch (error) {
        console.error('❌ 选择照片失败:', error);
        this.showError('选择照片失败，请重试');
      }
    },
    
    // 处理图片文件
    async processImageFile(file) {
      console.group('🔄 开始处理图片文件');
      
      // 验证文件
      if (!this.validateImageFile(file)) {
        console.groupEnd();
        return;
      }
      
      this.selectedFile = file;
      
      // 开始分析
      await this.startAnalysis();
      console.groupEnd();
    },
    
    // 验证图片文件
    validateImageFile(file) {
      console.log('🔍 验证图片文件');
      
      // 检查文件类型
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        console.error('❌ 文件类型不支持:', file.type);
        this.showError('请选择有效的图片格式（JPG、PNG、WebP）');
        return false;
      }
      
      // 检查文件大小（限制为10MB）
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('❌ 文件过大:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        this.showError('图片文件过大，请选择小于10MB的图片');
        return false;
      }
      
      console.log('✅ 文件验证通过');
      return true;
    },
    
    // 开始分析
    async startAnalysis() {
      console.group('🚀 开始皮肤分析流程');
      
      this.isAnalyzing = true;
      this.showResults = false;
      this.progress = 0;
      this.analysisStatus = '正在上传图片到云端...';
      
      // 模拟上传进度
      const uploadInterval = setInterval(() => {
        if (this.progress < 30) {
          this.progress += 2;
        }
      }, 100);
      
      try {
        // 调用皮肤分析API
        const response = await skinAnalysisApi.analyzeImage(this.selectedFile);
        
        clearInterval(uploadInterval);
        this.progress = 100;
        this.analysisStatus = '分析完成！';
        
        if (response.success) {
          console.log('🎉 皮肤分析成功完成');
          this.analysisResult = response.data;
          
          // 延迟显示结果
          setTimeout(() => {
            this.isAnalyzing = false;
            this.showResults = true;
            // 重新加载历史数据
            this.loadHistoryData();
          }, 1000);
        } else {
          throw new Error(response.message || '分析失败');
        }
        
      } catch (error) {
        clearInterval(uploadInterval);
        this.isAnalyzing = false;
        
        console.error('❌ 皮肤分析失败:', error);
        
        let errorMsg = '分析失败，请重试';
        if (error.response?.status === 401) {
          errorMsg = '登录已过期，请重新登录';
        } else if (error.response?.status === 400) {
          errorMsg = '图片格式不正确，请选择清晰的面部照片';
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        this.showError(errorMsg);
      }
      
      console.groupEnd();
    },
    
    // 重置分析
    resetAnalysis() {
      console.log('🔄 重置分析状态');
      this.isAnalyzing = false;
      this.showResults = false;
      this.progress = 0;
      this.selectedFile = null;
      this.analysisResult = null;
      this.clearError();
    },
    
    // 分享报告
    async shareReport() {
      console.log('📤 分享分析报告');
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'AI肌肤检测报告',
            text: `我的AI肌肤检测结果：健康评分${this.analysisResult?.overallAssessment?.healthScore}分！`,
            url: window.location.href
          });
          console.log('✅ 分享成功');
        } else {
          // 降级为复制链接到剪贴板
          await navigator.clipboard.writeText(window.location.href);
          console.log('📋 链接已复制到剪贴板');
          this.showError('链接已复制到剪贴板！');
        }
      } catch (error) {
        console.error('❌ 分享失败:', error);
        this.showError('分享功能暂时不可用，您可以手动复制页面链接分享给好友。');
      }
    },
    
    // 显示错误信息
    showError(message) {
      console.warn('⚠️ 显示错误信息:', message);
      this.errorMessage = message;
      setTimeout(() => {
        this.clearError();
      }, 5000);
    },
    
    // 清除错误信息
    clearError() {
      this.errorMessage = '';
    }
  }
}
</script>

<style scoped>
.skin-status-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #FDF2F8, #F0F9FF);
  padding-bottom: 80px; /* 为底部导航栏留出空间 */
  position: relative;
}

.main-content {
  padding: 1rem 0.5rem 1rem 0.5rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* 历史结果区域 */
.history-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.history-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  margin: 0;
}

.history-icon {
  color: #6366F1;
  margin-right: 0.5rem;
}

.history-date {
  font-size: 0.75rem;
  color: #6B7280;
  background: #F3F4F6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.history-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mini-score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  min-width: 80px;
}

.mini-score-card:hover {
  transform: scale(1.05);
}

.mini-score {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.mini-score-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.score-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.score-indicator.excellent {
  background-color: #10B981;
}

.score-indicator.good {
  background-color: #F59E0B;
}

.score-indicator.needs-improvement {
  background-color: #EF4444;
}

.history-info {
  flex: 1;
}

.history-desc {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.view-history-btn,
.new-analysis-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-history-btn {
  background: #F3F4F6;
  color: #374151;
}

.view-history-btn:hover {
  background: #E5E7EB;
}

.new-analysis-btn {
  background: #6366F1;
  color: white;
}

.new-analysis-btn:hover {
  background: #5B21B6;
}

/* 分析弹窗 - 悬浮于整个页面 */
.analyzing-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002; /* 高于历史弹窗 */
  backdrop-filter: blur(8px);
}

.analyzing-modal {
  width: 90%;
  max-width: 350px;
  z-index: 10003;
}

.analyzing-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 2.5rem 2rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

.spinner-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.spinner {
  width: 4rem;
  height: 4rem;
  border: 4px solid rgba(248, 187, 208, 0.2);
  border-left: 4px solid #F8BBD0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.analyzing-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.analyzing-subtitle {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 1.5rem 0;
}

.analyzing-tip {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin: 1rem 0 0 0;
  font-style: italic;
}

.progress-container {
  width: 100%;
}

.progress-bar {
  height: 0.5rem;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  background: linear-gradient(to right, #F8BBD0, #E1BEE7);
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

.progress-text {
  font-size: 0.75rem;
  color: #6B7280;
  font-weight: 500;
}

/* 修复历史弹窗的z-index问题 */
.history-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 提高z-index确保在最顶层 */
  backdrop-filter: blur(4px);
}

.history-modal {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000; /* 确保模态框内容在遮罩之上 */
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
}

.modal-content {
  max-height: 60vh;
  overflow-y: auto;
}

.no-history {
  padding: 2rem;
  text-align: center;
  color: #6B7280;
}

.no-history-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.history-list {
  padding: 0.5rem 0;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.history-item:hover {
  background: #F9FAFB;
}

.history-item-score {
  font-size: 1.25rem;
  font-weight: 700;
  color: #6366F1;
  margin-right: 1rem;
}

.history-item-info {
  flex: 1;
}

.history-item-date {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.history-item-summary {
  font-size: 0.75rem;
  color: #6B7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-item-arrow {
  color: #9CA3AF;
}

.results-container {
  animation: fadeInUp 0.6s ease-out;
}

/* 底部间距样式 */


/* 错误提示 */
.error-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #FEE2E2;
  color: #DC2626;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  max-width: 90%;
  cursor: pointer;
  animation: slideDown 0.3s ease-out;
}

/* 动画效果 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    max-width: 100%;
  }
}

@media (max-width: 430px) {
  .main-content {
    padding: 0.75rem;
  }
}
</style>