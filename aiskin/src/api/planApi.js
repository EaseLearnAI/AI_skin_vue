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
 * Create a new plan
 * @param {Object} planData - Plan data including userId, age, skinConcerns, customRequirements
 * @returns {Promise} - API response
 */
export const createPlan = async (planData) => {
  console.group('🎯 创建个性化护肤方案');
  console.log('📡 API请求: 创建方案');
  console.log('🔗 请求URL:', `${API_URL}/plans`);
  console.log('📊 请求数据:', planData);

  try {
    const response = await axios.post(
      `${API_URL}/plans`,
      planData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 方案创建成功');
    console.log('📋 方案详情:', {
      方案ID: response.data.data?.plan?._id,
      用户年龄: response.data.data?.plan?.userAge,
      护肤需求: response.data.data?.plan?.skinConcerns,
      早晨步骤: response.data.data?.plan?.morning?.length || 0,
      晚间步骤: response.data.data?.plan?.evening?.length || 0
    });
    console.log('📋 完整响应数据:', response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.error('❌ 创建方案失败');
    console.error('🚨 错误详情:', {
      状态码: error.response?.status,
      错误信息: error.response?.data?.message || error.message,
      请求数据: planData
    });
    console.groupEnd();
    throw error;
  }
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