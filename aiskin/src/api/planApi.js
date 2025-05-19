import axios from 'axios'
import authService from '@/services/authService'
import apiConfig from './config'

const API_URL = apiConfig.API_URL

// 获取授权头
const getAuthHeader = () => {
  const token = authService.getToken()
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}

/**
 * 创建个性化护肤方案
 * @param {Object} data - 包含护肤需求
 * @returns {Promise} - API 响应
 */
export const createPlan = (data) => {
  console.log('🔍 护肤方案请求: 创建方案', data)
  return axios.post(`${API_URL}/plans`, data, getAuthHeader())
    .then(response => {
      console.log('✅ 护肤方案响应: 创建成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 护肤方案错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 获取所有护肤方案
 * @returns {Promise} - API 响应
 */
export const getAllPlans = () => {
  console.log('🔍 护肤方案请求: 获取所有方案')
  return axios.get(`${API_URL}/plans`, getAuthHeader())
    .then(response => {
      console.log('✅ 护肤方案响应: 获取成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 护肤方案错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 获取单个护肤方案详情
 * @param {String} planId - 护肤方案ID
 * @returns {Promise} - API 响应
 */
export const getPlan = (planId) => {
  console.log('🔍 护肤方案请求: 获取方案详情', { planId })
  return axios.get(`${API_URL}/plans/${planId}`, getAuthHeader())
    .then(response => {
      console.log('✅ 护肤方案响应: 获取成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 护肤方案错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 删除护肤方案
 * @param {String} planId - 护肤方案ID
 * @returns {Promise} - API 响应
 */
export const deletePlan = (planId) => {
  console.log('🔍 护肤方案请求: 删除方案', { planId })
  return axios.delete(`${API_URL}/plans/${planId}`, getAuthHeader())
    .then(response => {
      console.log('✅ 护肤方案响应: 删除成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 护肤方案错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

export default {
  createPlan,
  getAllPlans,
  getPlan,
  deletePlan
} 