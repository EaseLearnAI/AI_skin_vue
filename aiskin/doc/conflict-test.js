const axios = require('axios');
const colors = require('colors');

// 配置
const API_URL = 'http://localhost:5000/api';
const USER_CREDENTIALS = {
  email: 'abc1567849@gmail.com',
  password: '12345678'
};

// 初始化
let token = null;
let userId = null;
let productIds = [];
let conflictId = null;

// 辅助函数
const printSeparator = () => console.log('\n' + '='.repeat(80).cyan + '\n');

const printJsonResponse = (title, data) => {
  console.log(`\n${title}:`.yellow);
  console.log(JSON.stringify(data, null, 2));
};

const logSuccess = (message) => console.log(`✓ ${message}`.green);
const logError = (message) => console.log(`✗ ${message}`.red);

// API 调用函数
async function login() {
  console.log('登录系统...'.cyan);
  try {
    const response = await axios.post(`${API_URL}/users/login`, USER_CREDENTIALS);
    
    if (response.data.success) {
      token = response.data.token;
      userId = response.data.data.user._id;
      
      logSuccess(`登录成功! 用户ID: ${userId}`);
      printJsonResponse('登录响应', response.data);
      return true;
    } else {
      logError('登录失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('登录请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getProducts() {
  console.log('\n获取用户所有产品...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/products/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const products = response.data.data.products;
      productIds = products.map(p => p.id).slice(0, 2); // 只取前两个产品用于测试冲突检测
      
      logSuccess(`获取到 ${response.data.count} 个产品!`);
      printJsonResponse('产品列表', response.data);
      
      if (productIds.length < 2) {
        logError('产品数量不足，需要至少2个产品进行冲突分析!');
        return false;
      }
      return true;
    } else {
      logError('获取产品失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取产品请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getProductsByLabel() {
  console.log('\n根据标签获取用户产品...'.cyan);
  const testLabel = '美白'; // 假设使用"美白"标签进行测试
  
  try {
    const response = await axios.get(`${API_URL}/products/user/${userId}/label/${testLabel}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess(`获取到 ${response.data.count} 个标签为"${testLabel}"的产品!`);
      printJsonResponse('产品列表', response.data);
      return true;
    } else {
      logError(`获取标签为"${testLabel}"的产品失败!`);
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('按标签获取产品请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function analyzeConflict() {
  console.log('\n分析产品冲突...'.cyan);
  try {
    const response = await axios.post(`${API_URL}/conflicts`, 
      { productIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      conflictId = response.data.data.conflictId;
      
      logSuccess('产品冲突分析成功!');
      printJsonResponse('分析结果', response.data);
      return true;
    } else {
      logError('产品冲突分析失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('冲突分析请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getConflictDetails() {
  if (!conflictId) {
    logError('没有可用的冲突分析ID!');
    return false;
  }
  
  console.log('\n获取冲突分析详情...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/conflicts/${conflictId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess('获取冲突分析详情成功!');
      printJsonResponse('冲突详情', response.data);
      return true;
    } else {
      logError('获取冲突分析详情失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取冲突详情请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getAllConflicts() {
  console.log('\n获取所有冲突分析记录...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/conflicts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess(`获取到 ${response.data.count} 条冲突分析记录!`);
      printJsonResponse('冲突记录列表', response.data);
      return true;
    } else {
      logError('获取冲突分析记录失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取冲突记录请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

// 运行测试
async function runTests() {
  printSeparator();
  console.log('开始测试 AI护肤系统冲突检测 API...'.bgCyan.white);
  printSeparator();
  
  // 1. 登录
  if (!await login()) {
    return;
  }
  
  // 2. 获取用户所有产品
  if (!await getProducts()) {
    return;
  }
  
  // 3. 根据标签获取用户产品
  await getProductsByLabel();
  
  // 4. 分析产品冲突
  if (!await analyzeConflict()) {
    return;
  }
  
  // 5. 获取冲突分析详情
  await getConflictDetails();
  
  // 6. 获取所有冲突分析记录
  await getAllConflicts();
  
  printSeparator();
  console.log('测试完成!'.bgGreen.white);
  printSeparator();
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中发生未处理异常:'.bgRed.white);
  console.error(error);
}); 