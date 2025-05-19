const axios = require('axios');

// API base URL
const BASE_URL = 'http://localhost:5000/api';

// Test user credentials
const TEST_USER = {
  email: 'abc1567849@gmail.com',
  password: '12345678'
};

// Global variables
let token = '';
let userId = '';
let ideaId = '';

// Color-coded log function
const log = {
  success: (message) => console.log('\x1b[32m%s\x1b[0m', `✓ ${message}`),
  error: (message) => console.log('\x1b[31m%s\x1b[0m', `✗ ${message}`),
  info: (message) => console.log('\x1b[36m%s\x1b[0m', `ℹ ${message}`),
  json: (data) => console.log(JSON.stringify(data, null, 2))
};

// Set request headers with authorization token
const getHeaders = () => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

// 1. Login user
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

// 2. Get current user profile
async function getUserProfile() {
  try {
    log.info('👤 获取用户个人资料...');
    
    const response = await axios.get(
      `${BASE_URL}/users/me`,
      { headers: getHeaders() }
    );
    
    log.success('获取用户资料成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取用户资料失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 3. Update username
async function updateUsername() {
  try {
    log.info('✏️ 更新用户名...');
    
    const newName = `测试用户_${Date.now().toString().slice(-4)}`;
    
    const response = await axios.patch(
      `${BASE_URL}/users/update-username`,
      { name: newName },
      { headers: getHeaders() }
    );
    
    log.success('更新用户名成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('更新用户名失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 4. Get user statistics
async function getUserStats() {
  try {
    log.info('📊 获取用户统计数据...');
    
    const response = await axios.get(
      `${BASE_URL}/users/stats`,
      { headers: getHeaders() }
    );
    
    log.success('获取用户统计数据成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取用户统计数据失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 5. Create feedback
async function createIdea() {
  try {
    log.info('💡 创建用户反馈...');
    
    const idea = {
      title: '系统功能建议',
      content: '希望能增加更多的护肤品成分分析功能',
      category: '功能建议'
    };
    
    const response = await axios.post(
      `${BASE_URL}/ideas`,
      idea,
      { headers: getHeaders() }
    );
    
    log.success('创建反馈成功');
    log.json(response.data);
    
    ideaId = response.data.data.idea._id;
    log.info(`获取到反馈ID: ${ideaId}`);
    return true;
  } catch (error) {
    log.error('创建反馈失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 6. Get user feedback list
async function getUserIdeas() {
  try {
    log.info('📋 获取用户反馈列表...');
    
    const response = await axios.get(
      `${BASE_URL}/ideas`,
      { headers: getHeaders() }
    );
    
    log.success('获取用户反馈列表成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取用户反馈列表失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 7. Get specific feedback
async function getIdea() {
  try {
    log.info('🔍 获取指定反馈详情...');
    
    if (!ideaId) {
      log.error('没有可用的反馈ID，请先创建反馈');
      return false;
    }
    
    const response = await axios.get(
      `${BASE_URL}/ideas/${ideaId}`,
      { headers: getHeaders() }
    );
    
    log.success('获取反馈详情成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('获取反馈详情失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 8. Update feedback
async function updateIdea() {
  try {
    log.info('📝 更新反馈内容...');
    
    if (!ideaId) {
      log.error('没有可用的反馈ID，请先创建反馈');
      return false;
    }
    
    const updatedIdea = {
      title: '更新后的系统功能建议',
      content: '希望能增加更多的护肤品成分分析功能，并提供成分冲突分析',
      category: '产品需求'
    };
    
    const response = await axios.put(
      `${BASE_URL}/ideas/${ideaId}`,
      updatedIdea,
      { headers: getHeaders() }
    );
    
    log.success('更新反馈内容成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('更新反馈内容失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 9. Delete feedback
async function deleteIdea() {
  try {
    log.info('🗑️ 删除反馈...');
    
    if (!ideaId) {
      log.error('没有可用的反馈ID，请先创建反馈');
      return false;
    }
    
    const response = await axios.delete(
      `${BASE_URL}/ideas/${ideaId}`,
      { headers: getHeaders() }
    );
    
    log.success('删除反馈成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('删除反馈失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// 10. Logout user
async function logout() {
  try {
    log.info('🚪 用户登出...');
    
    const response = await axios.post(
      `${BASE_URL}/users/logout`,
      {},
      { headers: getHeaders() }
    );
    
    log.success('用户登出成功');
    log.json(response.data);
    return true;
  } catch (error) {
    log.error('用户登出失败');
    log.json(error.response?.data || error.message);
    return false;
  }
}

// Execute all tests
async function runTests() {
  log.info('🚀 开始执行API测试...');
  
  // User authentication and profile
  if (!await login()) return;
  await getUserProfile();
  
  // User features
  await updateUsername();
  await getUserStats();
  
  // Feedback features
  await createIdea();
  await getUserIdeas();
  await getIdea();
  await updateIdea();
  await deleteIdea();
  
  // Logout
  await logout();
  
  log.info('✅ API测试完成');
}

// Run all tests
runTests().catch(error => {
  log.error('测试过程中发生未处理的错误');
  console.error(error);
}); 