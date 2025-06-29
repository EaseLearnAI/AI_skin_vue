<template>
  <div class="skin-analysis-result">
    <!-- Header -->
    <header class="bg-gradient-to-r from-sakura-500 to-sakura-600 p-4">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-white">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-semibold text-white flex items-center">
          <i class="fas fa-camera mr-2"></i>
          肌肤检测
        </h1>
        <button class="text-white">
          <i class="fas fa-history"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 bg-gradient-to-br from-sakura-50 via-white to-mint-50 min-h-screen">
      <!-- Overall Health Score -->
      <div class="modern-card bg-gradient-to-br from-sakura-400 to-sakura-600 p-6 mb-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold flex items-center">
              <i class="fas fa-sparkles mr-2 icon-bounce"></i>
              AI肌肤健康评分
            </h2>
            <p class="text-sm opacity-90">基于深度学习智能分析</p>
          </div>
          <div class="relative w-24 h-24">
            <svg class="progress-ring transform -rotate-90" width="96" height="96">
              <circle stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="transparent" r="42" cx="48" cy="48"/>
              <circle stroke="#ffffff" stroke-width="4" fill="transparent" r="42" cx="48" cy="48"
                  stroke-dasharray="263.9" :stroke-dashoffset="scoreOffset" stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <span class="text-2xl font-bold">{{ healthScore }}</span>
                <div class="text-xs opacity-80">健康分</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white/20 backdrop-filter backdrop-blur-sm rounded-xl p-4">
          <div class="flex items-start">
            <i class="fas fa-info-circle mr-3 mt-1 opacity-80"></i>
            <p class="text-sm leading-relaxed">{{ overallSummary }}</p>
          </div>
        </div>
      </div>

      <!-- Skin Status Overview (整合的组件) -->
      <SkinStatusOverview 
        :blackheads="analysisData.blackheads"
        :acne="analysisData.acne"
        :pores="analysisData.pores"
        :skinToneEvenness="analysisData.skinToneEvenness"
        :redness="analysisData.redness"
        :hyperpigmentation="analysisData.hyperpigmentation"
        :fineLines="analysisData.fineLines"
        :sensitivity="analysisData.sensitivity"
      />

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <button class="modern-button bg-gradient-to-br from-blue-500 to-blue-700 text-white py-5 rounded-2xl font-semibold">
          <div class="flex items-center justify-center">
            <i class="fas fa-camera mr-3"></i>
            <span>重新检测</span>
          </div>
        </button>
        
        <button class="modern-button bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-5 rounded-2xl font-semibold">
          <div class="flex items-center justify-center">
            <i class="fas fa-share mr-3"></i>
            <span>分享报告</span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import SkinStatusOverview from '@/components/skin-analysis/SkinStatusOverview.vue'

export default {
  name: 'SkinAnalysisResult',
  components: {
    SkinStatusOverview
  },
  data() {
    return {
      healthScore: 75,
      overallSummary: '混合偏油性皮肤，T区油脂分泌旺盛伴随毛孔粗大，局部存在少量闭口型粉刺及黑头，肤色均匀度良好但需加强控油护理',
      analysisData: {
        blackheads: {
          exists: true,
          severity: '少量',
          distribution: ['鼻翼', '下巴']
        },
        acne: {
          exists: true,
          count: '少量',
          types: ['粉刺'],
          distribution: ['额头', '下巴']
        },
        pores: {
          enlarged: true,
          severity: '中度',
          distribution: ['T区']
        },
        skinToneEvenness: {
          score: 7,
          description: '较为均匀'
        },
        redness: {
          exists: true,
          severity: '轻度',
          description: '轻微敏感性泛红',
          distribution: ['鼻翼', '脸颊']
        },
        hyperpigmentation: {
          exists: true,
          severity: '轻度',
          description: '少量晒斑痘印',
          types: ['晒斑', '痘印'],
          distribution: []
        },
        fineLines: {
          exists: false,
          severity: '良好',
          description: '眼周轻微细纹',
          distribution: []
        },
        sensitivity: {
          exists: false,
          severity: '轻度',
          description: '轻度敏感肌',
          signs: []
        }
      }
    }
  },
  computed: {
    scoreOffset() {
      const radius = 42;
      const circumference = radius * 2 * Math.PI;
      return circumference - (this.healthScore / 100 * circumference);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.skin-analysis-result {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #FEF7F0 0%, #FFF9FB 100%);
  min-height: 100vh;
}

.modern-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modern-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modern-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.progress-ring {
  filter: drop-shadow(0 4px 8px rgba(248, 187, 208, 0.3));
}

.icon-bounce {
  animation: float 3s ease-in-out infinite;
}

/* Sakura色彩系统 */
.from-sakura-500 {
  --tw-gradient-from: #F8BBD0;
}

.to-sakura-600 {
  --tw-gradient-to: #E1BEE7;
}

.from-sakura-400 {
  --tw-gradient-from: #FFBBD0;
}

.to-sakura-600 {
  --tw-gradient-to: #E1BEE7;
}

.from-sakura-50 {
  --tw-gradient-from: #FEF7F0;
}

.to-mint-50 {
  --tw-gradient-to: #F0FDF4;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
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

/* 响应式设计 */
@media (max-width: 800px) {
  .skin-analysis-result {
    max-width: 100%;
  }
}
</style> 