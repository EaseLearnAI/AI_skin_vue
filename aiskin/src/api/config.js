/**
 * API配置文件
 * 根据环境变量自动切换API地址
 */

// 获取环境变量中的API URL，如果不存在则使用本地开发环境URL
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

export default {
  API_URL
}; 