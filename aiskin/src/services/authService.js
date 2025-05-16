import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// 请求拦截器，添加 token 到所有请求
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器，处理 token 过期等情况
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token过期或无效，清除用户信息并重定向到登录页
      authService.logout()
      window.location.href = '/login?redirect=' + window.location.pathname
    }
    return Promise.reject(error)
  }
)

const authService = {
  // 用户注册
  register(userData) {
    return axios.post(`${API_URL}/users/register`, userData)
      .then(response => {
        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.data.user))
        }
        return response.data
      })
  },

  // 用户登录
  login(credentials) {
    return axios.post(`${API_URL}/users/login`, credentials)
      .then(response => {
        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          if (credentials.remember) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user))
          } else {
            sessionStorage.setItem('user', JSON.stringify(response.data.data.user))
          }
        }
        return response.data
      })
  },

  // 获取当前登录用户信息
  getCurrentUser() {
    return axios.get(`${API_URL}/users/me`)
      .then(response => response.data)
  },

  // 用户登出
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  },

  // 检查是否已登录
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // 获取已存储的用户信息
  getUser() {
    const localUser = localStorage.getItem('user')
    const sessionUser = sessionStorage.getItem('user')
    const userStr = localUser || sessionUser
    
    return userStr ? JSON.parse(userStr) : null
  }
}

export default authService 