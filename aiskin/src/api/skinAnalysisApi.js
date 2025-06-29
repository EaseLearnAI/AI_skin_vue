import axios from 'axios';
import apiConfig from './config';

// API URLs
const API_URL = apiConfig.API_URL;

/**
 * Skin Analysis API Service
 * Handles all skin analysis related API requests with detailed logging
 */
const skinAnalysisApi = {
  /**
   * Upload image and analyze skin condition
   * @param {File} imageFile - Skin image file
   * @returns {Promise} - API response with analysis results
   */
  async analyzeImage(imageFile) {
    console.group('🎯 皮肤分析API调用开始');
    console.log('📷 上传文件信息:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
      type: imageFile.type,
      lastModified: new Date(imageFile.lastModified).toLocaleString()
    });

    // 创建FormData
    const formData = new FormData();
    formData.append('faceImage', imageFile);

    console.log('📡 API请求: 皮肤分析');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis/analyze`);
    console.log('📦 请求方法: POST (multipart/form-data)');
    console.time('⏱️ 分析耗时');

    try {
      const response = await axios.post(
        `${API_URL}/skin-analysis/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 120000, // 2分钟超时
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📤 上传进度: ${percentCompleted}%`);
          }
        }
      );

      console.timeEnd('⏱️ 分析耗时');
      console.log('✅ API响应成功');
      console.log('📊 分析结果:', {
        成功状态: response.data.success,
        分析ID: response.data.data?.analysisId,
        图片URL: response.data.data?.imageUrl,
        模型: response.data.data?.analysisConfig?.model,
        处理时间: `${response.data.data?.analysisConfig?.processingTime}ms`,
        健康评分: response.data.data?.overallAssessment?.healthScore,
        皮肤状况: response.data.data?.overallAssessment?.skinCondition,
        皮肤类型: response.data.data?.skinType?.type
      });
      console.log('📋 完整响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.timeEnd('⏱️ 分析耗时');
      console.error('❌ API请求失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message,
        完整错误: error.response?.data
      });
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Get user's skin analysis history
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Promise} - API response with analysis history
   */
  async getAnalysisHistory(page = 1, limit = 10) {
    console.group('📚 获取分析历史');
    console.log('📡 API请求: 获取分析历史');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis?page=${page}&limit=${limit}`);
    console.log('📦 请求参数:', { page, limit });

    try {
      const response = await axios.get(
        `${API_URL}/skin-analysis?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ 历史记录获取成功');
      console.log('📊 历史数据:', {
        总记录数: response.data.data?.pagination?.total,
        当前页: response.data.data?.pagination?.page,
        总页数: response.data.data?.pagination?.pages,
        本页记录数: response.data.data?.analyses?.length
      });
      console.log('📋 完整响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('❌ 获取历史记录失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message
      });
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Get specific skin analysis details
   * @param {String} analysisId - Analysis ID
   * @returns {Promise} - API response with analysis details
   */
  async getAnalysisDetail(analysisId) {
    console.group('🔍 获取分析详情');
    console.log('📡 API请求: 获取分析详情');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis/${analysisId}`);
    console.log('🆔 分析ID:', analysisId);

    try {
      const response = await axios.get(
        `${API_URL}/skin-analysis/${analysisId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ 分析详情获取成功');
      console.log('📊 详情数据:', {
        分析ID: response.data.data?.analysis?._id,
        创建时间: response.data.data?.analysis?.createdAt,
        健康评分: response.data.data?.analysis?.overallAssessment?.healthScore,
        皮肤类型: response.data.data?.analysis?.skinType?.type
      });
      console.log('📋 完整响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('❌ 获取分析详情失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message
      });
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Get user's skin analysis statistics
   * @returns {Promise} - API response with statistics
   */
  async getAnalysisStats() {
    console.group('📈 获取分析统计');
    console.log('📡 API请求: 获取分析统计');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis/stats`);

    try {
      const response = await axios.get(
        `${API_URL}/skin-analysis/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ 统计数据获取成功');
      console.log('📊 统计信息:', {
        总分析次数: response.data.data?.stats?.totalAnalyses,
        平均健康评分: response.data.data?.stats?.averageHealthScore,
        最新皮肤状况: response.data.data?.stats?.latestSkinCondition,
        最新分析时间: response.data.data?.stats?.latestAnalysisDate
      });
      console.log('📋 完整响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('❌ 获取统计数据失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message
      });
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Get user's latest skin analysis
   * @returns {Promise} - API response with latest analysis
   */
  async getLatestAnalysis() {
    console.group('🔍 获取最新分析');
    console.log('📡 API请求: 获取最新分析');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis/latest`);

    try {
      const response = await axios.get(
        `${API_URL}/skin-analysis/latest`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ 最新分析获取成功');
      console.log('📊 最新分析数据:', {
        分析ID: response.data.data?.analysis?._id,
        创建时间: response.data.data?.analysis?.createdAt,
        健康评分: response.data.data?.analysis?.overallAssessment?.healthScore,
        皮肤类型: response.data.data?.analysis?.skinType?.type,
        皮肤状况: response.data.data?.analysis?.overallAssessment?.skinCondition
      });
      console.log('📋 完整响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('❌ 获取最新分析失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message
      });
      console.groupEnd();
      throw error;
    }
  },

  /**
   * Delete skin analysis record
   * @param {String} analysisId - Analysis ID
   * @returns {Promise} - API response
   */
  async deleteAnalysis(analysisId) {
    console.group('🗑️ 删除分析记录');
    console.log('📡 API请求: 删除分析记录');
    console.log('🔗 请求URL:', `${API_URL}/skin-analysis/${analysisId}`);
    console.log('🆔 分析ID:', analysisId);

    try {
      const response = await axios.delete(
        `${API_URL}/skin-analysis/${analysisId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('✅ 分析记录删除成功');
      console.log('📋 响应数据:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error) {
      console.error('❌ 删除分析记录失败');
      console.error('🚨 错误详情:', {
        状态码: error.response?.status,
        错误信息: error.response?.data?.message || error.message
      });
      console.groupEnd();
      throw error;
    }
  }
};

export default skinAnalysisApi; 