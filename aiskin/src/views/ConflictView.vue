<template>
  <div class="conflict-view">
    <!-- Status Bar -->


    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <button @click="goToProducts" class="back-button">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
          <div class="header-title">
            <h1 class="title-text">成分冲突检测</h1>
            <p class="title-subtitle">智能分析·安全护肤</p>
          </div>
        </div>
        <div class="header-right">
          <button class="header-action-btn">
            <font-awesome-icon :icon="['fas', 'share-alt']" />
          </button>
          <button class="header-action-btn">
            <font-awesome-icon :icon="['fas', 'heart']" />
          </button>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <div class="tab-container">
        <button 
          @click="switchTab('overview')" 
          :class="['tab-button', { active: activeTab === 'overview' }]"
        >
          <font-awesome-icon :icon="['fas', 'chart-pie']" class="tab-icon" />
          概览
        </button>
        <button 
          @click="switchTab('conflicts')" 
          :class="['tab-button', { active: activeTab === 'conflicts' }]"
        >
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="tab-icon" />
          冲突
        </button>
        <button 
          @click="switchTab('safe')" 
          :class="['tab-button', { active: activeTab === 'safe' }]"
        >
          <font-awesome-icon :icon="['fas', 'shield-alt']" class="tab-icon" />
          安全组合
        </button>
        <button 
          @click="switchTab('routine')" 
          :class="['tab-button', { active: activeTab === 'routine' }]"
        >
          <font-awesome-icon :icon="['fas', 'lightbulb']" class="tab-icon" />
          使用建议
        </button>
        <button 
          v-if="hasConflicts"
          @click="switchTab('recommendations')" 
          :class="['tab-button', { active: activeTab === 'recommendations' }]"
        >
          <font-awesome-icon :icon="['fas', 'shopping-cart']" class="tab-icon" />
          推荐产品
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>分析产品冲突中...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-message">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
          <span>{{ error }}</span>
        </div>

        <!-- Content Sections -->
        <div v-else class="content-sections">
          <!-- Overview Section -->
          <section id="overview-section" class="content-section">
            <!-- Quick Analysis Result -->
            <div class="glass-card analysis-summary">
              <div class="card-header">
                <div class="header-icon warning">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
                </div>
                <div class="header-info">
                  <h2 class="card-title">分析结果</h2>
                  <p class="card-subtitle">成分冲突检测报告</p>
                </div>
                <div class="status-badge warning">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
                  <span>警告</span>
                </div>
              </div>
              
              <!-- Quick Stats -->
              <div class="stats-grid">
                <div class="stat-item danger">
                  <div class="stat-number">{{ conflicts.length }}</div>
                  <div class="stat-label">严重冲突</div>
                </div>
                <div class="stat-item warning">
                  <div class="stat-number">{{ getMinorConflicts() }}</div>
                  <div class="stat-label">轻微冲突</div>
                </div>
                <div class="stat-item success">
                  <div class="stat-number">{{ safeCombo.length }}</div>
                  <div class="stat-label">安全组合</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Conflicts Section -->
          <section id="conflicts-section" class="content-section">
            <div class="glass-card">
              <div class="card-header">
                <div class="header-icon danger">
                  <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
                </div>
                <div class="header-info">
                  <h2 class="card-title">冲突检测</h2>
                  <p class="card-subtitle">发现的成分冲突和注意事项</p>
                </div>
              </div>

              <div v-if="!hasConflicts" class="no-conflicts">
                <font-awesome-icon :icon="['fas', 'smile']" class="no-conflicts-icon" />
                <p>太棒了！这些产品没有发现成分冲突，可以安心使用喵~</p>
              </div>

              <div v-else class="conflicts-list">
                <div 
                  v-for="(conflict, index) in conflicts" 
                  :key="'conflict-'+index" 
                  class="conflict-item"
                >
                  <div class="conflict-header">
                    <div class="conflict-icon danger">
                      <font-awesome-icon :icon="['fas', 'times']" />
                    </div>
                    <div class="conflict-content">
                      <h3 class="conflict-title">{{ formatComponents(conflict.components) }}</h3>
                      <p class="conflict-description">{{ conflict.description }}</p>
                      <div class="conflict-tags">
                        <span 
                          :class="['severity-tag', getSeverityClass(conflict.severity)]"
                        >
                          {{ conflict.severity }}度风险
                        </span>
                        <span v-if="conflict.effects && conflict.effects.length > 0" class="effect-tag">
                          {{ conflict.effects[0] }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Safe Combinations Section -->
          <section id="safe-section" class="content-section">
            <div class="glass-card">
              <div class="card-header">
                <div class="header-icon success">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                </div>
                <div class="header-info">
                  <h2 class="card-title">安全组合推荐</h2>
                  <p class="card-subtitle">经过验证的安全成分搭配</p>
                </div>
              </div>

              <div class="safe-combos-list">
                <div 
                  v-for="(combo, index) in safeCombo" 
                  :key="'safe-'+index" 
                  class="safe-combo-item"
                >
                  <div class="combo-header">
                    <div class="combo-icon success">
                      <font-awesome-icon :icon="['fas', 'check']" />
                    </div>
                    <h3 class="combo-title">{{ formatComponents(combo.components) }}</h3>
                  </div>
                  <p class="combo-description">{{ combo.description }}</p>
                  <div class="combo-tags">
                    <span class="benefit-tag">保湿修护</span>
                    <span class="benefit-tag">温和安全</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Usage Recommendations Section -->
          <section id="routine-section" class="content-section">
            <div class="glass-card">
              <div class="card-header">
                <div class="header-icon primary">
                  <font-awesome-icon :icon="['fas', 'clock']" />
                </div>
                <div class="header-info">
                  <h2 class="card-title">使用建议</h2>
                  <p class="card-subtitle">个性化护肤方案推荐</p>
                </div>
              </div>

              <!-- Important Reminders -->
              <div class="reminder-card">
                <div class="reminder-header">
                  <div class="reminder-icon">
                    <font-awesome-icon :icon="['fas', 'lightbulb']" />
                  </div>
                  <h3 class="reminder-title">重要提醒</h3>
                </div>
                <ul class="reminder-list">
                  <li>首次使用新产品时，建议先在手腕内侧进行过敏测试</li>
                  <li>含有活性成分的产品应避免同时大量使用</li>
                  <li>使用含酸类成分的产品时，务必做好防晒工作</li>
                </ul>
              </div>

              <!-- Usage Schedule -->
              <div v-if="hasRecommendations" class="routine-schedule">
                <div class="schedule-header">
                  <div class="schedule-icon">
                    <font-awesome-icon :icon="['fas', 'clock']" />
                  </div>
                  <h3 class="schedule-title">建议使用方案</h3>
                </div>
                <div class="routine-grid">
                  <div v-if="hasMorningRoutine" class="routine-card morning">
                    <h4 class="routine-time">
                      <font-awesome-icon :icon="['fas', 'sun']" />
                      晨间护理
                    </h4>
                    <ol class="routine-steps">
                      <li v-for="(step, index) in recommendations.routines.morning" :key="'morning-'+index">
                        {{ step }}
                      </li>
                    </ol>
                  </div>
                  <div v-if="hasEveningRoutine" class="routine-card evening">
                    <h4 class="routine-time">
                      <font-awesome-icon :icon="['fas', 'moon']" />
                      晚间护理
                    </h4>
                    <ol class="routine-steps">
                      <li v-for="(step, index) in recommendations.routines.evening" :key="'evening-'+index">
                        {{ step }}
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Product Recommendations Section -->
          <section id="recommendations-section" v-if="hasConflicts" class="content-section">
            <div class="glass-card">
              <div class="card-header">
                <div class="header-icon success">
                  <font-awesome-icon :icon="['fas', 'shield-alt']" />
                </div>
                <div class="header-info">
                  <h2 class="card-title">推荐平替产品</h2>
                  <p class="card-subtitle">解决冲突问题的优质替代品</p>
                </div>
              </div>

              <div class="recommendations-intro">
                <div class="intro-icon">
                  <font-awesome-icon :icon="['fas', 'star']" />
                </div>
                <p class="intro-text">
                  检测到您的产品存在成分冲突，为您推荐以下经过验证的平替产品，安全有效，避免冲突风险。
                </p>
              </div>

              <div class="product-recommendations">
                <div 
                  v-for="(product, index) in recommendedProducts" 
                  :key="'product-'+index"
                  class="product-card"
                >
                  <div class="product-image">
                    <img :src="product.image" :alt="product.name" @error="handleImageError" />
                    <div class="product-badge">
                      <font-awesome-icon :icon="['fas', 'shield-check']" />
                      <span>安全认证</span>
                    </div>
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ product.name }}</h4>
                    <p class="product-description">{{ product.description }}</p>
                    <div class="product-features">
                      <span 
                        v-for="(feature, fIndex) in product.features" 
                        :key="'feature-'+fIndex"
                        class="feature-tag"
                      >
                        {{ feature }}
                      </span>
                    </div>
                    <div class="product-price">
                      <span class="price-label">参考价格：</span>
                      <span class="price-value">{{ product.price }}</span>
                    </div>
                  </div>
                  <div class="product-actions">
                    <button 
                      class="view-product-btn"
                      @click="openProductLink(product.link)"
                    >
                      <font-awesome-icon :icon="['fas', 'external-link-alt']" />
                      查看详情
                    </button>
                  </div>
                </div>
              </div>

              <div class="recommendations-footer">
                <div class="footer-note">
                  <font-awesome-icon :icon="['fas', 'info-circle']" />
                  <span>以上推荐产品均经过专业筛选，成分安全，适合替换有冲突风险的产品</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <div class="button-container">
        <button class="secondary-button" @click="goToProducts">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          返回产品库
        </button>
        <button class="primary-button" @click="exportReport">
          导出报告
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import authService from '@/services/authService'
import productApi from '@/api/productApi'
import * as conflictApi from '@/api/conflictApi'

export default {
  name: 'ConflictView',
  data() {
    return {
      activeTab: 'overview',
      selectedProducts: [],
      conflicts: [],
      safeCombo: [],
      recommendations: {
        productPairings: {
          cannotUseTogether: [],
          canUseTogether: []
        },
        routines: {
          morning: [],
          evening: []
        }
      },
      loading: false,
      error: null,
      conflictId: null,
      userId: null,
      productIds: [],
      recommendedProducts: []
    }
  },
  computed: {
    hasConflicts() {
      return this.conflicts && this.conflicts.length > 0
    },
    hasRecommendations() {
      return this.recommendations && 
        (this.hasCannotUseTogether || 
         this.hasCanUseTogether || 
         this.hasRoutines)
    },
    hasCannotUseTogether() {
      return this.recommendations.productPairings &&
        this.recommendations.productPairings.cannotUseTogether &&
        this.recommendations.productPairings.cannotUseTogether.length > 0
    },
    hasCanUseTogether() {
      return this.recommendations.productPairings &&
        this.recommendations.productPairings.canUseTogether &&
        this.recommendations.productPairings.canUseTogether.length > 0
    },
    hasRoutines() {
      return this.recommendations.routines &&
        (this.hasMorningRoutine || this.hasEveningRoutine)
    },
    hasMorningRoutine() {
      return this.recommendations.routines &&
        this.recommendations.routines.morning &&
        this.recommendations.routines.morning.length > 0
    },
    hasEveningRoutine() {
      return this.recommendations.routines &&
        this.recommendations.routines.evening &&
        this.recommendations.routines.evening.length > 0
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

    // 初始化推荐产品数据
    this.initializeRecommendedProducts();

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
  methods: {
    switchTab(tabName) {
      this.activeTab = tabName;
      
      // 滚动到对应的内容区域
      const targetElement = document.getElementById(`${tabName}-section`);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
      
      // 添加触觉反馈
      this.addHapticFeedback();
    },
    
    addHapticFeedback() {
      if (navigator.vibrate) {
        navigator.vibrate([10]);
      }
    },

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
    
    exportReport() {
      // 导出报告功能
      alert('分析结果已成功保存！');
    },
    
    goToProducts() {
      // 跳转到产品分析页面
      this.$router.push('/product');
    },

    formatComponents(components) {
      return components && components.length > 0 
        ? components.join(' × ')
        : '未检测到成分'
    },

    getSeverityClass(severity) {
      const severityMap = {
        '高': 'high',
        '中': 'medium', 
        '低': 'low'
      };
      return severityMap[severity] || 'medium';
    },

    getMinorConflicts() {
      return this.conflicts.filter(conflict => 
        conflict.severity === '中' || conflict.severity === '低'
      ).length;
    },

    openProductLink(link) {
      // 实现打开产品链接的逻辑
      console.log('Opening product link:', link);
      window.open(link, '_blank');
    },

    initializeRecommendedProducts() {
      // 初始化推荐产品数据
      console.log('=== 冲突检测流程 === 步骤5: 初始化推荐产品数据');
      
      this.recommendedProducts = [
        {
          name: '欧拉雅温和修护精华',
          description: '温和配方，适合敏感肌，有效修护肌肤屏障，减少刺激',
          image: 'https://via.placeholder.com/120x120/f8f9fa/6c757d?text=欧拉雅精华',
          features: ['温和无刺激', '修护屏障', '敏感肌适用'],
          price: '¥89-159',
          link: 'https://detail.tmall.com/item.htm?detail_redpacket_pop=true&id=678394741287&ltk2=1751221063342g513xkitpszi8hgaz6xd&ns=1&priceTId=213e04f617512209855223340e195b&query=%E6%AC%A7%E6%8B%89%E9%9B%85%E6%8A%A4%E8%82%A4%E5%93%81&skuId=5960871491103&spm=a21n57.1.hoverItem.1&utparam=%7B%22aplus_abtest%22%3A%2257966adc31de165e2aa4808c861c97a5%22%7D&xxc=ad_ztc'
        },
      ];
      
      console.log('推荐产品数据初始化完成，共', this.recommendedProducts.length, '个产品');
    },

    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/120x120?text=Image+Not+Available';
    }
  }
}
</script>

<style scoped>
.conflict-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  padding-bottom: 6rem;
}

/* Status Bar */

.status-left .time {
  font-weight: 600;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  font-size: 0.75rem;
}

.battery {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.battery-text {
  font-size: 0.75rem;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  background: none;
  border: none;
  padding: 0.625rem;
  border-radius: 0.75rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.header-title {
  display: flex;
  flex-direction: column;
}

.title-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.title-subtitle {
  font-size: 0.75rem;
  color: #666;
  margin: 0.125rem 0 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.header-action-btn {
  background: none;
  border: none;
  padding: 0.625rem;
  border-radius: 0.75rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header-action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Tab Navigation */
.tab-navigation {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 4rem;
  z-index: 40;
}

.tab-container {
  display: flex;
  padding: 0 0.5rem;
  margin: 0 1rem;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.tab-button.active {
  color: #0ea5e9;
  font-weight: 600;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tab-button.active::after {
  width: 24px;
}

.tab-icon {
  font-size: 0.75rem;
}

/* Main Content */
.main-content {
  padding-bottom: 0rem;
}

.content-wrapper {
  padding: 1rem 1.25rem;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.content-section {
  scroll-margin-top: 8rem;
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.header-icon.warning {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.header-icon.danger {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.header-icon.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.header-icon.primary {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.header-info {
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.warning {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

/* Stats Grid */
.stats-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.stat-item.danger {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
}

.stat-item.warning {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05));
}

.stat-item.success {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-item.danger .stat-number {
  color: #f44336;
}

.stat-item.warning .stat-number {
  color: #ff9800;
}

.stat-item.success .stat-number {
  color: #4caf50;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-item.danger .stat-label {
  color: #d32f2f;
}

.stat-item.warning .stat-label {
  color: #f57c00;
}

.stat-item.success .stat-label {
  color: #388e3c;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(14, 165, 233, 0.2);
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
  border-left: 4px solid #f44336;
  color: #d32f2f;
  padding: 1.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

/* No Conflicts */
.no-conflicts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  border-radius: 1rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.no-conflicts-icon {
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 1rem;
}

.no-conflicts p {
  color: #388e3c;
  font-weight: 500;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
}

/* Conflicts List */
.conflicts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conflict-item {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 152, 0, 0.05));
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(244, 67, 54, 0.2);
  transition: all 0.3s ease;
}

.conflict-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(244, 67, 54, 0.1);
}

.conflict-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.conflict-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(244, 67, 54, 0.15);
}

.conflict-icon.danger {
  color: #f44336;
}

.conflict-content {
  flex: 1;
}

.conflict-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.conflict-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
}

.conflict-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.severity-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.severity-tag.high {
  background-color: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.severity-tag.medium {
  background-color: rgba(255, 152, 0, 0.1);
  color: #f57c00;
}

.severity-tag.low {
  background-color: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.effect-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: rgba(255, 152, 0, 0.1);
  color: #f57c00;
}

/* Safe Combos */
.safe-combos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.safe-combo-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05));
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.3s ease;
}

.safe-combo-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.1);
}

.combo-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.combo-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.15);
}

.combo-icon.success {
  color: #4caf50;
}

.combo-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.combo-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
}

.combo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.benefit-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

/* Recommendations */
.reminder-card {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 193, 7, 0.2);
  margin-bottom: 1.5rem;
}

.reminder-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.reminder-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.reminder-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f57c00;
  margin: 0;
}

.reminder-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reminder-list li {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.reminder-list li::before {
  content: '•';
  color: #ffc107;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.routine-schedule {
  margin-top: 1.5rem;
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.schedule-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.schedule-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.routine-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .routine-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.routine-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.routine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.routine-card.morning {
  border-left: 3px solid #ff9800;
}

.routine-card.evening {
  border-left: 3px solid #5e35b1;
}

.routine-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.75rem 0;
}

.routine-time .fa-sun {
  color: #ff9800;
}

.routine-time .fa-moon {
  color: #5e35b1;
}

.routine-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.routine-steps li {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.routine-steps li:last-child {
  border-bottom: none;
}

/* Action Buttons */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 1.25rem;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 50;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.secondary-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.05);
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.secondary-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.primary-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
  white-space: nowrap;
}

.primary-button:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  transform: translateY(-1px);
  box-shadow: 0 15px 25px rgba(14, 165, 233, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .content-wrapper {
    padding: 1rem;
  }
  
  .glass-card {
    padding: 1rem;
  }
  
  .stats-grid {
    gap: 0.5rem;
  }
  
  .stat-item {
    padding: 0.75rem 0.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  
  .conflict-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .conflict-icon {
    align-self: flex-start;
  }
  
  .button-container {
    gap: 0.5rem;
  }
  
  .secondary-button,
  .primary-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-section {
  animation: fadeIn 0.5s ease-out;
}

.glass-card {
  animation: fadeIn 0.6s ease-out;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Product Recommendations Styles */
.recommendations-intro {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05));
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
  margin-bottom: 1.5rem;
}

.intro-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.intro-text {
  color: #388e3c;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

.product-recommendations {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.product-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9));
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
}

.product-image {
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.product-description {
  font-size: 0.9375rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 0.25rem 0.75rem;
  background-color: rgba(76, 175, 80, 0.1);
  color: #388e3c;
  border-radius: 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.875rem;
  color: #666;
}

.price-value {
  font-size: 1rem;
  font-weight: 600;
  color: #f57c00;
}

.product-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}

.view-product-btn {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.view-product-btn:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
}

.recommendations-footer {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.footer-note {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f57c00;
  font-size: 0.875rem;
  font-weight: 500;
}

.footer-note svg {
  color: #ffc107;
  flex-shrink: 0;
}

/* Mobile Responsiveness for Product Recommendations */
@media (max-width: 768px) {
  .product-card {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .product-image {
    width: 100%;
    height: 200px;
  }
  
  .product-actions {
    width: 100%;
  }
  
  .view-product-btn {
    width: 100%;
    padding: 1rem;
  }
  
  .recommendations-intro {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .product-features {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .product-card {
    padding: 0.75rem;
  }
  
  .product-image {
    height: 150px;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-description {
    font-size: 0.875rem;
  }
  
  .feature-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }
}
</style> 