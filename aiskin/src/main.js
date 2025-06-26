import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import authService from './services/authService'
import axios from 'axios'
import config from './api/config'

// 引入全局样式
import './assets/styles/skin-analysis.css'

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faHome, faPaw, faFlask, faCamera, faUser, 
  faArrowLeft, faBell, faSearch, faWifi, faSignal, 
  faBatteryFull, faBolt, faExclamationTriangle, 
  faShareAlt, faSave, faShoppingBasket, faTimes, 
  faSearchPlus, faClock, faExclamation, faCheck, 
  faSun, faMoon, faEllipsisV, faPlusCircle, faImage,
  faShieldAlt, faChevronRight, faTint, faOilCan, 
  faExclamationCircle, faHistory,
  faQuestionCircle, faCog, faEnvelope, faLock,
  faEye, faEyeSlash, faSpinner, faRobot, faMagic,
  faLightbulb, faStar, faInfoCircle, faCheckCircle,
  faUpload, faSyncAlt, faTrashAlt, faPlus, 
  faQrcode, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons'

// Import regular icons
import {
  faCircle as farCircle
} from '@fortawesome/free-regular-svg-icons'

// Add icons to the library
library.add(
  faHome, faPaw, faFlask, faCamera, faUser, 
  faArrowLeft, faBell, faSearch, faWifi, faSignal, 
  faBatteryFull, faBolt, faExclamationTriangle, 
  faShareAlt, faSave, faShoppingBasket, faTimes, 
  faSearchPlus, faClock, faExclamation, faCheck, 
  faSun, faMoon, faEllipsisV, faPlusCircle, faImage,
  faShieldAlt, faChevronRight, faTint, faOilCan, 
  faExclamationCircle, faHistory,
  faQuestionCircle, faCog, faEnvelope, faLock,
  faEye, faEyeSlash, faSpinner, faRobot, faMagic,
  faLightbulb, faStar, faInfoCircle, faCheckCircle,
  faUpload, faSyncAlt, faTrashAlt, faPlus,
  faQrcode, faCalendarCheck,
  farCircle
)

// Import Views
import HomeView from './views/HomeView.vue'
import ProductView from './views/ProductView.vue'
import ConflictView from './views/ConflictView.vue'
import SkinStatusView from './views/SkinStatusView.vue'
import ProfileView from './views/ProfileView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import IngredientView from './views/IngredientView.vue'

// Create router
const routes = [
  { 
    path: '/', 
    component: HomeView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/product', 
    component: ProductView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/conflict', 
    component: ConflictView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/skinstatus', 
    component: SkinStatusView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/ingredient/:id', 
    component: IngredientView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    component: LoginView 
  },
  { 
    path: '/register', 
    component: RegisterView 
  },
  // Redirect to home for undefined routes
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由导航守卫，检查认证状态
router.beforeEach((to, from, next) => {
  // 如果需要认证但没有登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 全局axios配置 - 使用配置文件中的URL
axios.defaults.baseURL = config.API_URL.replace('/api', '')

// Create and mount the app
const app = createApp(App)

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Use router
app.use(router)

app.mount('#app')
