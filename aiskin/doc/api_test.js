const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// API基础URL
const BASE_URL = 'http://localhost:5000/api';

// 测试文件路径（需要在项目中提供测试图片）
const TEST_IMAGE_PATH = path.join(__dirname, 'product.png');

// 测试数据
const TEST_USER = {
  email: 'abc1567849@gmail.com',
  password: '12345678'
};

// 全局变量
let token = '';
let userId = '';
let productId = '';
let productWithLabelId = '';

// 彩色日志函数
const log = {
  success: (message) => console.log('\x1b[32m%s\x1b[0m', `✓ ${message}`),
  error: (message) => console.log('\x1b[31m%s\x1b[0m', `✗ ${message}`),
  info: (message) => console.log('\x1b[36m%s\x1b[0m', `ℹ ${message}`),
  json: (data) => console.log(JSON.stringify(data, null, 2))
};

// 设置请求头
const getHeaders = () => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

// 1. 用户登录
async function login() {
  try {
    log.info('🔑 登录用户...');
    const response = await axios.post(`${BASE_URL}/users/login`, TEST_USER);
    log.success('用户登录成功');
    log.json(response.data);
    
    token = response.data.token;
    userId = response.data.data.user._id;
    log.info(`获取到用户ID: ${userId}`);
    log.info(`获取到令牌: ${token.substring(0, 15)}...`);
    return true;
  } catch (error) {
    log.error('用户登录失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 2. 创建产品（仅提供标签，无需名称）
async function createProduct() {
  try {
    log.info('📦 创建新产品...');
    const response = await axios.post(
      `${BASE_URL}/products`,
      {
        label: '保湿',
        openingDate: new Date().toISOString() // 添加开封日期
      },
      { headers: getHeaders() }
    );
    
    log.success('创建产品成功');
    log.json(response.data);
    
    productId = response.data.data.product._id;
    log.info(`获取到产品ID: ${productId}`);
    return true;
  } catch (error) {
    log.error('创建产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 3. 创建另一个带有不同标签的产品
async function createProductWithLabel() {
  try {
    log.info('📦 创建带标签的产品...');
    const response = await axios.post(
      `${BASE_URL}/products`,
      {
        label: '美白',
        openingDate: new Date().toISOString()
      },
      { headers: getHeaders() }
    );
    
    log.success('创建带标签产品成功');
    log.json(response.data);
    
    productWithLabelId = response.data.data.product._id;
    log.info(`获取到标签产品ID: ${productWithLabelId}`);
    return true;
  } catch (error) {
    log.error('创建带标签产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 4. 上传产品图片
async function uploadProductImage() {
  try {
    log.info('🖼️ 上传产品图片...');
    
    // 检查测试图片是否存在
    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      log.error(`测试图片不存在: ${TEST_IMAGE_PATH}`);
      return false;
    }
    
    const form = new FormData();
    form.append('productImage', fs.createReadStream(TEST_IMAGE_PATH));
    
    const response = await axios.post(
      `${BASE_URL}/products/${productId}/upload-image`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    log.success('上传产品图片成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('上传产品图片失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 5. 提取产品成分（OCR）
async function extractIngredients() {
  try {
    log.info('🔬 提取产品成分...');
    
    const response = await axios.post(
      `${BASE_URL}/products/${productId}/extract-ingredients`,
      {},
      { headers: getHeaders() }
    );
    
    log.success('提取产品成分成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('提取产品成分失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 6. 分析产品成分
async function analyzeIngredients() {
  try {
    log.info('🧪 分析产品成分...');
    
    const response = await axios.post(
      `${BASE_URL}/products/${productId}/analyze-ingredients`,
      {},
      { headers: getHeaders() }
    );
    
    log.success('分析产品成分成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('分析产品成分失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 7. 获取用户所有产品
async function getUserProducts() {
  try {
    log.info('📋 获取用户所有产品...');
    
    const response = await axios.get(
      `${BASE_URL}/products/user/${userId}`,
      { headers: getHeaders() }
    );
    
    log.success('获取用户所有产品成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取用户所有产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 8. 根据标签获取用户产品
async function getUserProductsByLabel() {
  try {
    log.info('🏷️ 按标签获取用户产品...');
    
    const response = await axios.get(
      `${BASE_URL}/products/user/${userId}/label/美白`,
      { headers: getHeaders() }
    );
    
    log.success('按标签获取用户产品成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('按标签获取用户产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 9. 获取单个产品详情
async function getProductDetails() {
  try {
    log.info('📝 获取产品详情...');
    
    const response = await axios.get(
      `${BASE_URL}/products/${productId}`,
      { headers: getHeaders() }
    );
    
    log.success('获取产品详情成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取产品详情失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 10. 获取产品成分分析
async function getIngredientAnalysis() {
  try {
    log.info('🔎 获取产品成分分析...');
    
    const response = await axios.get(
      `${BASE_URL}/products/${productId}/ingredient-analysis`,
      { headers: getHeaders() }
    );
    
    log.success('获取产品成分分析成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取产品成分分析失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 11. 更新产品（包括开封日期）
async function updateProduct() {
  try {
    log.info('✏️ 更新产品信息...');
    
    const response = await axios.put(
      `${BASE_URL}/products/${productId}`,
      {
        label: '保湿修护',
        openingDate: new Date('2025-06-01').toISOString()
      },
      { headers: getHeaders() }
    );
    
    log.success('更新产品成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('更新产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 12. 清理测试数据（删除创建的产品）
async function deleteProducts() {
  try {
    log.info('🗑️ 删除测试产品...');
    
    // 删除第一个产品
    if (productId) {
      const response1 = await axios.delete(
        `${BASE_URL}/products/${productId}`,
        { headers: getHeaders() }
      );
      log.success(`删除产品成功: ${productId}`);
      log.json(response1.data);
    }
    
    // 删除第二个产品
    if (productWithLabelId) {
      const response2 = await axios.delete(
        `${BASE_URL}/products/${productWithLabelId}`,
        { headers: getHeaders() }
      );
      log.success(`删除产品成功: ${productWithLabelId}`);
      log.json(response2.data);
    }
    
    return true;
  } catch (error) {
    log.error('删除产品失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 主函数，按顺序执行测试
async function runTests() {
  log.info('🚀 开始API测试...');
  
  try {
    // 登录并获取token
    if (!await login()) return;
    
    // 创建和测试产品
    if (!await createProduct()) return;
    if (!await createProductWithLabel()) return;
    
    // 上传图片和提取成分
    if (!await uploadProductImage()) return;
    if (!await extractIngredients()) return;
    
    // 分析成分
    if (!await analyzeIngredients()) return;
    
    // 获取产品列表
    if (!await getUserProducts()) return;
    if (!await getUserProductsByLabel()) return;
    
    // 获取详情
    if (!await getProductDetails()) return;
    if (!await getIngredientAnalysis()) return;
    
    // 更新产品
    if (!await updateProduct()) return;
    
    // 清理测试数据
    await deleteProducts();
    
    log.success('✨ 所有测试完成');
  } catch (error) {
    log.error('测试过程中发生未处理的错误');
    console.error(error);
  }
}

// 运行测试
runTests(); 