<template>
  <div class="skin-status-overview">
    <!-- 主报告卡片 -->
    <div class="main-report-card">
      <!-- 卡片标题 -->
      <div class="card-header">
        <h3 class="card-title">
          <div class="title-icon">📊</div>
          皮肤状态总览
        </h3>

      </div>
      
      <!-- 综合评估区域 -->
      <div class="overall-assessment">
        <div class="assessment-content">
          <div class="assessment-icon">✨</div>
          <div class="assessment-text">
            <span class="assessment-label">综合评估：</span>
            皮肤整体状态良好，有2个问题需要轻度关注。
          </div>
        </div>
      </div>
      
      <!-- 皮肤问题列表 -->
      <div class="issues-list">
        <!-- 黑头情况 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">⚫</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">黑头情况</h4>
              <p class="issue-description">{{ blackheads.distribution.join('、') }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(blackheads.severity)">
            <div class="status-dot"></div>
            <span class="status-text">{{ blackheads.severity }}</span>
          </div>
        </div>

        <!-- 痘痘情况 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">🔴</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">痘痘情况</h4>
              <p class="issue-description">{{ acne.distribution.join('、') }}{{ acne.types.join('') }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(acne.count)">
            <div class="status-dot"></div>
            <span class="status-text">{{ acne.count }}</span>
          </div>
        </div>

        <!-- 毛孔状态 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">⬜</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">毛孔状态</h4>
              <p class="issue-description">{{ pores.distribution.join('、') }}粗大</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(pores.severity)">
            <div class="status-dot"></div>
            <span class="status-text">{{ pores.severity }}</span>
          </div>
        </div>

        <!-- 肤色均匀度 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">🎨</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">肤色均匀度</h4>
              <p class="issue-description">{{ skinToneEvenness.description }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getSkinToneStatusClass()">
            <div class="status-dot"></div>
            <span class="status-text">{{ getSkinToneStatus() }}</span>
          </div>
        </div>

        <!-- 泛红情况 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">❤️</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">泛红情况</h4>
              <p class="issue-description">{{ redness.description }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(redness.severity)">
            <div class="status-dot"></div>
            <span class="status-text">{{ redness.severity }}</span>
          </div>
        </div>

        <!-- 色素沉着 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">🟤</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">色素沉着</h4>
              <p class="issue-description">{{ getHyperpigmentationDescription() }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(getHyperpigmentationStatus())">
            <div class="status-dot"></div>
            <span class="status-text">{{ getHyperpigmentationStatus() }}</span>
          </div>
        </div>
        
        <!-- 细纹状况 -->
        <div class="issue-item">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">〰️</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">细纹状况</h4>
              <p class="issue-description">{{ getFineLinesDescription() }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(getFineLinesStatus())">
            <div class="status-dot"></div>
            <span class="status-text">{{ getFineLinesStatus() }}</span>
          </div>
        </div>
        
        <!-- 敏感程度 -->
        <div class="issue-item last">
          <div class="issue-content">
            <div class="issue-icon-container">
              <div class="issue-icon">🛡️</div>
            </div>
            <div class="issue-info">
              <h4 class="issue-title">敏感程度</h4>
              <p class="issue-description">{{ getSensitivityDescription() }}</p>
            </div>
          </div>
          <div class="status-badge" :class="getStatusClass(getSensitivityStatus())">
            <div class="status-dot"></div>
            <span class="status-text">{{ getSensitivityStatus() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinStatusOverview',
  props: {
    blackheads: {
      type: Object,
      default: () => ({
        exists: true,
        severity: '少量',
        distribution: ['鼻翼', '下巴']
      })
    },
    acne: {
      type: Object,
      default: () => ({
        exists: true,
        count: '少量',
        types: ['粉刺'],
        distribution: ['额头', '下巴']
      })
    },
    pores: {
      type: Object,
      default: () => ({
        enlarged: true,
        severity: '中度',
        distribution: ['T区']
      })
    },
    skinToneEvenness: {
      type: Object,
      default: () => ({
        score: 7,
        description: '较为均匀'
      })
    },
    redness: {
      type: Object,
      default: () => ({
        exists: true,
        severity: '轻度',
        description: '轻微敏感性泛红',
        distribution: ['鼻翼', '脸颊']
      })
    },
    hyperpigmentation: {
      type: Object,
      default: () => ({
        exists: false,
        severity: '轻度',
        description: '少量晒斑痘印',
        types: ['晒斑', '痘印'],
        distribution: []
      })
    },
    fineLines: {
      type: Object,
      default: () => ({
        exists: false,
        severity: '无',
        description: '眼周轻微细纹',
        distribution: []
      })
    },
    sensitivity: {
      type: Object,
      default: () => ({
        exists: false,
        severity: '轻度',
        description: '轻度敏感肌',
        signs: []
      })
    }
  },
  methods: {
    getStatusClass(severity) {
      const classMap = {
        '无': 'status-good',
        '轻度': 'status-mild',
        '少量': 'status-mild',
        '正常': 'status-good',
        '中度': 'status-moderate',
        '良好': 'status-good',
        '大量': 'status-severe',
        '严重': 'status-severe'
      };
      return classMap[severity] || 'status-good';
    },
    getSkinToneStatus() {
      if (this.skinToneEvenness.score >= 8) return '优秀';
      if (this.skinToneEvenness.score >= 6) return '良好';
      if (this.skinToneEvenness.score >= 4) return '一般';
      return '需改善';
    },
    getSkinToneStatusClass() {
      const score = this.skinToneEvenness.score;
      if (score >= 6) return 'status-good';
      if (score >= 4) return 'status-mild';
      return 'status-moderate';
    },
    // 色素沉着状态
    getHyperpigmentationStatus() {
      if (!this.hyperpigmentation || !this.hyperpigmentation.exists) {
        return '无';
      }
      return this.hyperpigmentation.severity || '轻度';
    },
    // 色素沉着描述
    getHyperpigmentationDescription() {
      if (!this.hyperpigmentation || !this.hyperpigmentation.exists) {
        return '无明显色素沉着';
      }
      if (this.hyperpigmentation.description) {
        return this.hyperpigmentation.description;
      }
      // 根据types和distribution生成描述
      const types = this.hyperpigmentation.types || [];
      const distribution = this.hyperpigmentation.distribution || [];
      if (types.length > 0) {
        const typeText = types.join('、');
        const distText = distribution.length > 0 ? distribution.join('、') : '';
        return distText ? `${distText}${typeText}` : typeText;
      }
      return '轻微色素沉着';
    },
    // 细纹状况状态
    getFineLinesStatus() {
      if (!this.fineLines || !this.fineLines.exists) {
        return '无';
      }
      return this.fineLines.severity || '轻度';
    },
    // 细纹状况描述
    getFineLinesDescription() {
      if (!this.fineLines || !this.fineLines.exists) {
        return '无明显细纹';
      }
      if (this.fineLines.description) {
        return this.fineLines.description;
      }
      // 根据distribution生成描述
      const distribution = this.fineLines.distribution || [];
      if (distribution.length > 0) {
        return `${distribution.join('、')}轻微细纹`;
      }
      return '轻微细纹';
    },
    // 敏感程度状态
    getSensitivityStatus() {
      if (!this.sensitivity || !this.sensitivity.exists) {
        return '无';
      }
      return this.sensitivity.severity || '轻度';
    },
    // 敏感程度描述
    getSensitivityDescription() {
      if (!this.sensitivity || !this.sensitivity.exists) {
        return '肌肤不敏感';
      }
      if (this.sensitivity.description) {
        return this.sensitivity.description;
      }
      // 根据signs生成描述
      const signs = this.sensitivity.signs || [];
      if (signs.length > 0) {
        return `出现${signs.join('、')}等敏感症状`;
      }
      return '轻度敏感肌';
    }
  }
}
</script>

<style scoped>
.skin-status-overview {
  width: 100%;
  margin: 0 auto;
}

/* 主报告卡片 */
.main-report-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 300ms ease-out;
}

.main-report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08), 0 20px 25px rgba(0, 0, 0, 0.08);
}

/* 卡片标题 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  margin: 0;
}

.title-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.detection-count {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

/* 综合评估区域 */
.overall-assessment {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #f3f4f6;
}

.assessment-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.assessment-icon {
  font-size: 1.125rem;
  margin-top: 0.125rem;
}

.assessment-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
}

.assessment-label {
  font-weight: 600;
  color: #f8bbd0;
}

/* 皮肤问题列表 */
.issues-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.issue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  transition: all 300ms ease-out;
}

.issue-item:hover {
  background: #f9fafb;
  margin: 0 -1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border-bottom: 1px solid transparent;
}

.issue-item.last {
  border-bottom: none;
}

.issue-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.issue-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.issue-icon {
  font-size: 1rem;
}

.issue-info {
  display: flex;
  flex-direction: column;
}

.issue-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.issue-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* 宽屏布局优化 */
@media (min-width: 768px) {
  .issues-list {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .issue-item {
    margin: 0;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    border-radius: 0.75rem;
    background: #f9fafb;
  }
  
  .issue-item:hover {
    background: #f3f4f6;
    transform: none;
    margin: 0;
    padding: 1rem;
  }
  
  .issue-item.last {
    border-bottom: 1px solid #f3f4f6;
  }
}

/* 响应式设计 */
@media (max-width: 767px) {
  .issues-list {
    grid-template-columns: 1fr;
  }
  
  .issue-item:hover {
    background: #f9fafb;
    margin: 0 -1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border-bottom: 1px solid transparent;
  }
}

@media (max-width: 430px) {
  .main-report-card {
    margin: 0 0 1.5rem 0;
    padding: 1.5rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .issue-item:hover {
    margin: 0 -0.5rem;
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 320px) {
  .main-report-card {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
  
  .issue-icon-container {
    width: 2rem;
    height: 2rem;
  }
  
  .issue-icon {
    font-size: 0.875rem;
  }
}

/* 状态徽章 */
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

/* 状态颜色 */
.status-good {
  background: #ecfdf5;
  color: #065f46;
}

.status-good .status-dot {
  background: #10b981;
}

.status-mild {
  background: #fffbeb;
  color: #92400e;
}

.status-mild .status-dot {
  background: #f59e0b;
}

.status-moderate {
  background: #fef2f2;
  color: #991b1b;
}

.status-moderate .status-dot {
  background: #ef4444;
}

.status-severe {
  background: #fef2f2;
  color: #7f1d1d;
}

.status-severe .status-dot {
  background: #dc2626;
}
</style> 