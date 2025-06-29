import { createRouter, createWebHistory } from 'vue-router'
import SkinAnalysisResult from '@/views/SkinAnalysisResult.vue'
import SkinAnalysisComplete from '@/views/SkinAnalysisComplete.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/skin-analysis-complete'
  },
  {
    path: '/skin-analysis-result',
    name: 'SkinAnalysisResult',
    component: SkinAnalysisResult,
    meta: {
      title: '肌肤检测结果'
    }
  },
  {
    path: '/skin-analysis-complete',
    name: 'SkinAnalysisComplete',
    component: SkinAnalysisComplete,
    meta: {
      title: '完整肌肤分析'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router 