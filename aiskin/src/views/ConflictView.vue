<template>
  <div class="conflict-view">
    
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
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>分析产品冲突中...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <ConflictAnalysis 
        v-else
        :conflicts="conflicts"
        :safeCombo="safeCombo"
        :recommendations="recommendations" 
      />
    </main>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="back-button" @click="goToProducts">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
        返回猫窝
      </button>
    </div>

    <BottomNavigation />
  </div>
</template>

<script>
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import SelectedProducts from '@/components/conflict/SelectedProducts.vue'
import ConflictAnalysis from '@/components/conflict/ConflictAnalysis.vue'
import authService from '@/services/authService'
import productApi from '@/api/productApi'
import * as conflictApi from '@/api/conflictApi'

export default {
  name: 'ConflictView',
  components: {
    AppHeader,
    BottomNavigation,
    SelectedProducts,
    ConflictAnalysis
  },
  data() {
    return {
      selectedProducts: [],
      conflicts: [],
      safeCombo: [],
      recommendations: {},
      loading: false,
      error: null,
      conflictId: null,
      userId: null,
      productIds: []
    }
  },
  async created() {
    // 获取当前用户ID
    console.log('=== 冲突检测流程 === 步骤1: 组件初始化');
    
    const user = authService.getCurrentUser()
    if (user && user._id) {
      this.userId = user._id
      console.log(`=== 冲突检测流程 === 步骤1.1: 获取用户ID: ${this.userId}`);
    } else {
      console.log('=== 冲突检测流程 === 警告: 无法获取用户ID');
      this.error = '用户未登录或登录已过期，请重新登录';
      return;
    }

    // 从URL参数获取产品ID
    if (this.$route.query.products) {
      this.productIds = this.$route.query.products.split(',')
      console.log(`=== 冲突检测流程 === 步骤1.2: 从URL获取产品ID: ${this.productIds.join(', ')}`);
      
      if (this.productIds.length < 2) {
        this.error = '至少需要选择两个产品才能分析冲突'
        console.log('=== 冲突检测流程 === 错误: 产品数量不足，至少需要2个产品');
        return
      }
      
      try {
        // 获取产品信息
        await this.fetchSelectedProducts();
        
        // 如果产品信息获取成功，直接开始分析冲突
        if (this.selectedProducts.length >= 2) {
          console.log('=== 冲突检测流程 === 步骤2.4: 产品数量足够，开始分析冲突');
          await this.analyzeConflict();
        } else {
          console.log('=== 冲突检测流程 === 警告: 获取的有效产品不足2个，无法分析');
        }
      } catch (error) {
        console.error('=== 冲突检测流程 === 步骤错误:', error);
        this.error = '流程执行出错，请重试';
      }
    } else {
      this.error = '未选择产品，请返回产品页面选择至少两个产品进行冲突分析'
      console.log('=== 冲突检测流程 === 错误: URL中没有产品ID参数');
    }
  },
  mounted() {
    // 由于冲突分析已在created中完成，这里只做状态检查
    console.log(`=== 冲突检测流程 === 步骤4: 组件挂载完成，冲突分析${this.conflictId ? '已完成' : '未完成'}`);
    
    if (this.selectedProducts.length < 2) {
      console.log('=== 冲突检测流程 === 警告: 挂载时产品数量不足');
    }
  },
  methods: {
    async fetchSelectedProducts() {
      try {
        this.loading = true;
        this.error = null;
        
        console.log('=== 冲突检测流程 === 步骤2.1: 开始获取产品信息');
        
        // 获取每个选中产品的详细信息
        const productPromises = this.productIds.map(id => {
          console.log(`=== 冲突检测流程 === 获取产品信息: ${id}`);
          return productApi.getProduct(id);
        });
        
        const responses = await Promise.all(productPromises);
        console.log('=== 冲突检测流程 === 步骤2.2: 所有产品请求已完成');
        
        // 处理响应结果
        this.selectedProducts = responses
          .filter(response => response.success)
          .map(response => {
            const product = response.data.product;
            return {
              id: product._id,
              name: product.name,
              description: product.description,
              image: product.imageUrl
            };
          });
        
        console.log(`=== 冲突检测流程 === 步骤2.3: 成功获取${this.selectedProducts.length}个产品信息`);
        
        if (this.selectedProducts.length < 2) {
          this.error = '无法获取足够的产品信息，请重试';
          console.log('=== 冲突检测流程 === 错误: 产品数量不足，无法分析');
        }
      } catch (error) {
        this.error = '获取产品信息失败，请重试';
        console.error('=== 冲突检测流程 === 异常:', error);
      } finally {
        this.loading = false;
        console.log('=== 冲突检测流程 === 步骤2完成: 产品信息获取结束');
      }
    },
    
    async analyzeConflict() {
      if (this.selectedProducts.length < 2) {
        this.error = '至少需要选择两个产品才能分析冲突';
        console.log('=== 冲突检测流程 === 错误: 产品数量不足，至少需要2个产品');
        return;
      }
      
      try {
        this.loading = true;
        this.error = null;
        
        console.log('=== 冲突检测流程 === 步骤3: 开始分析产品冲突');
        console.log(`=== 冲突检测流程 === 调用API分析产品: ${this.productIds.join(', ')}`);
        
        // 调用API分析产品冲突
        const response = await conflictApi.analyzeConflict(this.productIds);
        
        console.log('=== 冲突检测流程 === API响应:', response);
        
        if (response.success) {
          // 更新UI数据
          this.conflictId = response.data.conflictId;
          this.conflicts = response.data.conflicts || [];
          this.safeCombo = response.data.safeCombo || [];
          this.recommendations = response.data.recommendations || {};
          
          console.log('=== 冲突检测流程 === 步骤4: 分析成功, conflictId:', this.conflictId);
          console.log('=== 冲突检测流程 === 冲突数量:', this.conflicts.length);
          console.log('=== 冲突检测流程 === 安全组合数量:', this.safeCombo.length);
        } else {
          this.error = '分析冲突失败: ' + (response.message || '未知错误');
          console.log('=== 冲突检测流程 === 错误: 分析失败', response.message);
        }
      } catch (error) {
        this.error = '分析产品冲突失败，请重试';
        console.error('=== 冲突检测流程 === 异常:', error);
      } finally {
        this.loading = false;
        console.log('=== 冲突检测流程 === 步骤完成: 加载状态关闭');
      }
    },
    
    removeProduct(index) {
      // 如果已经分析过，则不允许移除产品
      if (this.conflictId) {
        alert('已分析的产品不能移除，请重新选择产品进行分析');
        return;
      }
      
      this.selectedProducts.splice(index, 1);
      this.productIds.splice(index, 1);
      
      // 如果产品数量少于2个，显示错误信息
      if (this.selectedProducts.length < 2) {
        this.error = '至少需要选择两个产品才能分析冲突';
      }
    },
    
    saveResults() {
      // 分析结果已经自动保存到服务器，这里只需要提示用户
      alert('分析结果已成功保存！');
      
      // 保存后返回产品页面
      this.goToProducts();
    },
    
    goToProducts() {
      // 返回产品页面，并标记来自冲突分析页面
      this.$router.push({
        path: '/',
        query: { fromConflict: 'true' }
      });
    }
  }
}
</script>

<style scoped>
.conflict-view {
  min-height: 100vh;
  background-color: var(--system-background);
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--system-gray-1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--system-gray-5);
  border-top: 3px solid var(--system-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: rgba(255, 59, 48, 0.1);
  border-left: 4px solid var(--system-red);
  color: var(--system-red);
  padding: 1.25rem;
  border-radius: 0.75rem;
  margin: 1.25rem 0;
  box-shadow: 0 2px 10px rgba(255, 59, 48, 0.08);
  transition: all 0.3s ease;
}

.action-buttons {
  position: fixed;
  bottom: 3.5rem;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid var(--system-gray-5);
  padding: 1.25rem;
  display: flex;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.back-button {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  background-color: var(--system-gray-6);
  color: var(--system-gray-1);
  box-shadow: 0 2px 8px rgba(142, 142, 147, 0.2);
}

.back-button:hover {
  background-color: var(--system-gray-5);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(142, 142, 147, 0.25);
}

/* Product Cards */
:deep(.product-card) {
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 1.25rem;
}

:deep(.product-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.product-image) {
  height: 140px;
  overflow: hidden;
  position: relative;
}

:deep(.product-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.5s ease;
}

:deep(.product-card:hover .product-image img) {
  transform: scale(1.05);
}

:deep(.product-details) {
  padding: 1rem;
}

:deep(.product-name) {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

:deep(.product-label) {
  display: inline-block;
  background-color: #f0f4ff;
  color: #4a6cf7;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

:deep(.product-description) {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

/* Conflict Analysis */
:deep(.conflict-card), :deep(.safe-combo-card) {
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

:deep(.conflict-card) {
  background-color: rgba(255, 59, 48, 0.08);
  border-left: 4px solid var(--system-red);
}

:deep(.safe-combo-card) {
  background-color: rgba(76, 217, 100, 0.08);
  border-left: 4px solid var(--system-green);
}

:deep(.conflict-card:hover), :deep(.safe-combo-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.card-title) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

:deep(.conflict-card .card-title) {
  color: var(--system-red);
}

:deep(.safe-combo-card .card-title) {
  color: var(--system-green);
}

:deep(.card-title svg) {
  margin-right: 0.5rem;
}

:deep(.conflict-item), :deep(.safe-item) {
  margin-bottom: 1.25rem;
  padding: 1rem;
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;
}

:deep(.conflict-item:hover), :deep(.safe-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.conflict-item:last-child), :deep(.safe-item:last-child) {
  margin-bottom: 0;
}

:deep(.component-pair) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.conflict-card .component-pair) {
  color: var(--system-red-dark);
}

:deep(.safe-combo-card .component-pair) {
  color: var(--system-green-dark);
}

:deep(.severity-tag) {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

:deep(.severity-high) {
  background: linear-gradient(to right, #ff3b30, #ff9500);
  color: white;
}

:deep(.severity-medium) {
  background: linear-gradient(to right, #ff9500, #ffcc00);
  color: white;
}

:deep(.severity-low) {
  background: linear-gradient(to right, #ffcc00, #34c759);
  color: white;
}

:deep(.description) {
  font-size: 0.9375rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

:deep(.effects-list) {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

:deep(.effects-title) {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

:deep(.effects-list ul) {
  margin: 0;
  padding-left: 1.25rem;
}

:deep(.effects-list li) {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

/* Recommendations */
:deep(.recommendations-card) {
  border-radius: 16px;
  background-color: white;
  padding: 1.25rem;
  margin-top: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

:deep(.recommendations-title) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
}

:deep(.recommendations-title svg) {
  margin-right: 0.5rem;
  color: #9c27b0;
}

:deep(.recommendation-section) {
  margin-bottom: 1.25rem;
}

:deep(.recommendation-section:last-child) {
  margin-bottom: 0;
}

:deep(.section-title) {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #555;
}

:deep(.recommendation-list) {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 1rem;
}

:deep(.recommendation-item) {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.recommendation-item:last-child) {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

:deep(.recommendation-icon) {
  color: #9c27b0;
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

:deep(.recommendation-text) {
  font-size: 0.9375rem;
  color: #555;
  line-height: 1.5;
}

:deep(.pairing-list) {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

:deep(.pairing-item) {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

:deep(.pairing-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.pairing-products) {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

:deep(.pairing-reason) {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

:deep(.routine-section) {
  margin-bottom: 1rem;
}

:deep(.routine-section:last-child) {
  margin-bottom: 0;
}

:deep(.routine-title) {
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.75rem;
}

:deep(.morning-icon) {
  color: #ff9500;
  margin-right: 0.5rem;
}

:deep(.evening-icon) {
  color: #5856d6;
  margin-right: 0.5rem;
}

:deep(.routine-steps) {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 0.5rem;
}

:deep(.routine-step) {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background-color: white;
  font-size: 0.9375rem;
  color: #555;
  transition: all 0.3s ease;
}

:deep(.routine-step:last-child) {
  margin-bottom: 0;
}

:deep(.routine-step:hover) {
  background-color: #f5f5f5;
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .action-buttons {
    padding: 1rem;
  }
  
  .back-button {
    width: 100%;
  }
}
</style> 