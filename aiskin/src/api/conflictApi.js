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
 * 分析产品冲突
 * @param {Array} productIds - 要检测冲突的产品ID数组
 * @returns {Promise} - API 响应
 */
export const analyzeConflict = (productIds) => {
  console.log('🔍 冲突检测请求: 分析产品冲突', { productIds })
  return axios.post(`${API_URL}/conflicts`, { productIds }, getAuthHeader())
    .then(response => {
      console.log('✅ 冲突检测响应: 分析成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 冲突检测错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 获取冲突分析详情
 * @param {String} conflictId - 冲突分析记录ID
 * @returns {Promise} - API 响应
 */
export const getConflictDetails = (conflictId) => {
  console.log('🔍 冲突检测请求: 获取详情', { conflictId })
  return axios.get(`${API_URL}/conflicts/${conflictId}`, getAuthHeader())
    .then(response => {
      console.log('✅ 冲突检测响应: 获取详情成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 冲突检测错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 获取所有冲突分析记录
 * @returns {Promise} - API 响应
 */
export const getAllConflicts = () => {
  console.log('🔍 冲突检测请求: 获取所有记录')
  return axios.get(`${API_URL}/conflicts`, getAuthHeader())
    .then(response => {
      console.log('✅ 冲突检测响应: 获取所有记录成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 冲突检测错误:', error.response ? error.response.data : error.message)
      throw error
    })
}

/**
 * 删除冲突分析记录
 * @param {String} conflictId - 要删除的冲突分析记录ID
 * @returns {Promise} - API 响应
 */
export const deleteConflict = (conflictId) => {
  console.log('🔍 冲突检测请求: 删除记录', { conflictId })
  return axios.delete(`${API_URL}/conflicts/${conflictId}`, getAuthHeader())
    .then(response => {
      console.log('✅ 冲突检测响应: 删除成功', response.data)
      return response.data
    })
    .catch(error => {
      console.error('❌ 冲突检测错误:', error.response ? error.response.data : error.message)
      throw error
    })
} 