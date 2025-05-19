const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

// 测试用户数据
const testUser = {
  name: 'Updated Product Test User',
  email: `updated_test_${Date.now()}@example.com`,
  password: 'password123'
};

// 测试产品数据
const testProduct = {
  name: '测试产品',
  description: '这是一个用于测试OCR和成分分析的产品'
};

// 测试图片路径
const testImagePath = path.join(__dirname, 'product.png');

let token;
let userId;
let productId;

// 注册用户
const testRegister = async () => {
  try {
    console.log('测试用户注册...');
    const response = await axios.post(`${API_URL}/users/register`, testUser);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ 用户注册成功');
      token = response.data.token;
      userId = response.data.data.user._id;
      return true;
    } else {
      console.log('❌ 用户注册失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 用户注册失败:', error.response?.data || error.message);
    return false;
  }
};

// 创建产品
const testCreateProduct = async () => {
  try {
    console.log('测试创建产品...');
    const response = await axios.post(
      `${API_URL}/products`,
      testProduct,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ 产品创建成功');
      productId = response.data.data.product._id;
      console.log('产品ID:', productId);
      return true;
    } else {
      console.log('❌ 产品创建失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 产品创建失败:', error.response?.data || error.message);
    return false;
  }
};

// 上传产品图片
const testUploadProductImage = async () => {
  try {
    console.log('测试上传产品图片...');
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('productImage', fs.createReadStream(testImagePath));
    
    const response = await axios.post(
      `${API_URL}/products/${productId}/upload-image`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 产品图片上传成功');
      console.log('图片URL:', response.data.data.imageUrl);
      return true;
    } else {
      console.log('❌ 产品图片上传失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 产品图片上传失败:', error.response?.data || error.message);
    return false;
  }
};

// 提取产品成分和名称
const testExtractProductInfo = async () => {
  try {
    console.log('测试提取产品成分和名称...');
    const response = await axios.post(
      `${API_URL}/products/${productId}/extract-ingredients`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 产品成分和名称提取成功');
      console.log('提取到的产品名称:', response.data.data.name);
      console.log('提取到的成分:', response.data.data.ingredients);
      return true;
    } else {
      console.log('❌ 产品成分提取失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 产品成分提取失败:', error.response?.data || error.message);
    return false;
  }
};

// 分析产品成分
const testAnalyzeIngredients = async () => {
  try {
    console.log('测试分析产品成分...');
    const response = await axios.post(
      `${API_URL}/products/${productId}/analyze-ingredients`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 产品成分分析成功');
      console.log('成分分析结果概览:');
      const analysis = response.data.data.ingredientAnalysis;
      console.log('- 安全性指数:', analysis.safetyIndex);
      console.log('- 功效评分:', analysis.efficacyScore);
      console.log('- 活性成分数量:', analysis.activeIngredients);
      console.log('- 致痘风险:', analysis.acneRisk.level, analysis.acneRisk.percentage + '%');
      console.log('- 总体评分:', analysis.overallRating);
      return true;
    } else {
      console.log('❌ 产品成分分析失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 产品成分分析失败:', error.response?.data || error.message);
    return false;
  }
};

// 获取成分分析结果
const testGetIngredientAnalysis = async () => {
  try {
    console.log('测试获取成分分析结果...');
    const response = await axios.get(
      `${API_URL}/products/${productId}/ingredient-analysis`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 获取成分分析结果成功');
      console.log('产品名称:', response.data.data.product.name);
      const analysis = response.data.data.ingredientAnalysis;
      console.log('功效分析:');
      analysis.efficacyAnalysis.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
      console.log('使用建议:');
      analysis.recommendations.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
      return true;
    } else {
      console.log('❌ 获取成分分析结果失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 获取成分分析结果失败:', error.response?.data || error.message);
    return false;
  }
};

// 获取产品详情
const testGetProduct = async () => {
  try {
    console.log('测试获取产品详情...');
    const response = await axios.get(
      `${API_URL}/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ 获取产品详情成功');
      const product = response.data.data.product;
      console.log('产品名称:', product.name);
      console.log('产品描述:', product.description);
      console.log('成分列表:', product.ingredients.length > 0 ? '已提取' : '未提取');
      console.log('成分分析:', product.ingredientAnalysis ? '已分析' : '未分析');
      return true;
    } else {
      console.log('❌ 获取产品详情失败');
      return false;
    }
  } catch (error) {
    console.error('❌ 获取产品详情失败:', error.response?.data || error.message);
    return false;
  }
};

// 主测试函数
const runTests = async () => {
  console.log('🚀 开始产品OCR和成分分析测试...');
  
  // 用户注册（获取token）
  const registerSuccess = await testRegister();
  if (!registerSuccess) {
    console.log('❌ 用户注册失败，无法继续测试');
    return;
  }
  
  // 创建产品
  const createProductSuccess = await testCreateProduct();
  if (!createProductSuccess) {
    console.log('❌ 创建产品失败，无法继续测试');
    return;
  }
  
  // 上传产品图片
  const uploadSuccess = await testUploadProductImage();
  if (!uploadSuccess) {
    console.log('❌ 上传产品图片失败，无法继续测试');
    return;
  }
  
  // 提取产品成分和名称
  const extractSuccess = await testExtractProductInfo();
  if (!extractSuccess) {
    console.log('❌ 提取产品成分和名称失败，无法继续测试');
    return;
  }
  
  // 获取产品详情以确认提取结果
  await testGetProduct();
  
  // 分析产品成分
  const analyzeSuccess = await testAnalyzeIngredients();
  if (!analyzeSuccess) {
    console.log('❌ 产品成分分析失败，无法继续测试');
    return;
  }
  
  // 获取成分分析结果
  const getAnalysisSuccess = await testGetIngredientAnalysis();
  
  // 再次获取产品详情以确认分析结果
  await testGetProduct();
  
  // 打印测试摘要
  console.log('\n📋 测试摘要:');
  console.log(`用户注册: ${registerSuccess ? '✅ 通过' : '❌ 失败'}`);
  console.log(`创建产品: ${createProductSuccess ? '✅ 通过' : '❌ 失败'}`);
  console.log(`上传产品图片: ${uploadSuccess ? '✅ 通过' : '❌ 失败'}`);
  console.log(`提取产品成分和名称: ${extractSuccess ? '✅ 通过' : '❌ 失败'}`);
  console.log(`分析产品成分: ${analyzeSuccess ? '✅ 通过' : '❌ 失败'}`);
  console.log(`获取成分分析结果: ${getAnalysisSuccess ? '✅ 通过' : '❌ 失败'}`);
  
  if (registerSuccess && createProductSuccess && uploadSuccess && 
      extractSuccess && analyzeSuccess && getAnalysisSuccess) {
    console.log('\n🎉 所有测试通过!');
  } else {
    console.log('\n❌ 部分测试失败.');
  }
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runTests().catch(error => {
    console.error('运行测试时出错:', error);
  });
}

module.exports = { runTests }; 