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
let planId = null;
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

async function generatePlan() {
  console.log('\n生成护肤方案...'.cyan);
  try {
    const response = await axios.post(`${API_URL}/plans`, 
      { requirement: '美白淡斑，皮肤容易干燥' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      planId = response.data.data.plan._id;
      
      logSuccess('护肤方案生成成功!');
      printJsonResponse('方案内容', response.data);
      return true;
    } else {
      logError('护肤方案生成失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('护肤方案生成请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getUserPlans() {
  console.log('\n获取用户所有护肤方案...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/plans`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess(`获取到 ${response.data.count} 个护肤方案!`);
      printJsonResponse('方案列表', response.data);
      return true;
    } else {
      logError('获取护肤方案失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取护肤方案请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getPlan() {
  if (!planId) {
    logError('没有可用的护肤方案ID!');
    return false;
  }
  
  console.log('\n获取单个护肤方案...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess('获取护肤方案成功!');
      printJsonResponse('方案详情', response.data);
      return true;
    } else {
      logError('获取护肤方案失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取护肤方案请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getUserConflictsSummary() {
  console.log('\n获取用户冲突检测摘要...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/conflicts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess(`获取到 ${response.data.count} 条冲突检测摘要!`);
      printJsonResponse('冲突检测摘要', response.data);
      
      // 保存第一个冲突检测ID用于下一步
      if (response.data.count > 0) {
        conflictId = response.data.data.conflicts[0].id;
      }
      
      return true;
    } else {
      logError('获取冲突检测摘要失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取冲突检测摘要请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

async function getConflictById() {
  if (!conflictId) {
    logError('没有可用的冲突检测ID!');
    return false;
  }
  
  console.log('\n获取冲突检测详情...'.cyan);
  try {
    const response = await axios.get(`${API_URL}/conflicts/detail/${conflictId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logSuccess('获取冲突检测详情成功!');
      printJsonResponse('冲突检测详情', response.data);
      return true;
    } else {
      logError('获取冲突检测详情失败!');
      printJsonResponse('错误响应', response.data);
      return false;
    }
  } catch (error) {
    logError('获取冲突检测详情请求异常!');
    console.error(error.response ? error.response.data : error.message);
    return false;
  }
}

// 运行测试
async function runTests() {
  printSeparator();
  console.log('开始测试 AI护肤系统个性化方案和冲突摘要 API...'.bgCyan.white);
  printSeparator();
  
  // 1. 登录
  if (!await login()) {
    return;
  }
  
  // 2. 生成护肤方案
  if (!await generatePlan()) {
    return;
  }
  
  // 3. 获取用户所有护肤方案
  await getUserPlans();
  
  // 4. 获取单个护肤方案
  await getPlan();
  
  // 5. 获取用户冲突检测摘要
  await getUserConflictsSummary();
  
  // 6. 获取冲突检测详情
  if (conflictId) {
    await getConflictById();
  }
  
  printSeparator();
  console.log('测试完成!'.bgGreen.white);
  printSeparator();
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中发生未处理异常:'.bgRed.white);
  console.error(error);
}); 