<template>
  <div class="welcome-card">
    <!-- Background decoration -->
    <div class="decoration-1"></div>
    <div class="decoration-2"></div>
    
    <!-- Welcome message -->
    <div class="welcome-message">
      <p class="welcome-text">让我来看看你的肌肤状态喵～</p>
      <p class="welcome-subtitle">AI智能分析，专业护肤建议</p>
    </div>
    
    <!-- Detection options -->
    <div class="detection-options">
      <button @click="$emit('takePhoto')" class="detection-btn camera-btn">
        <div class="btn-icon">
          <font-awesome-icon icon="camera" />
        </div>
        <span class="btn-title">拍照检测</span>
        <span class="btn-subtitle">实时拍摄分析</span>
      </button>
      
      <button @click="$emit('selectPhoto')" class="detection-btn gallery-btn">
        <div class="btn-icon">
          <font-awesome-icon icon="image" />
        </div>
        <span class="btn-title">从相册选择</span>
        <span class="btn-subtitle">选择已有照片</span>
      </button>
    </div>
    
    <!-- Feature highlights -->
    <div class="feature-highlights">
      <div class="feature-item">
        <div class="feature-dot ai-dot"></div>
        <span class="feature-text">AI智能识别</span>
      </div>
      <div class="feature-item">
        <div class="feature-dot analysis-dot"></div>
        <span class="feature-text">专业分析</span>
      </div>
      <div class="feature-item">
        <div class="feature-dot suggestion-dot"></div>
        <span class="feature-text">个性建议</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinDetectionWelcome',
  emits: ['takePhoto', 'selectPhoto']
}
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, #FEF7F0 50%, #F0FDF4 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

.welcome-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(248, 187, 208, 0.3);
}

.decoration-1 {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background: linear-gradient(to bottom left, rgba(255, 236, 242, 0.3), transparent);
  border-radius: 50%;
  transform: translate(4rem, -4rem);
}

.decoration-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 6rem;
  height: 6rem;
  background: linear-gradient(to top right, rgba(209, 250, 229, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-3rem, 3rem);
}

.welcome-message {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 10;
}

.welcome-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #E1BEE7;
  margin: 0 0 0.25rem 0;
}

.welcome-subtitle {
  font-size: 0.75rem;
  color: #6B7280;
  margin: 0;
}

.detection-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  position: relative;
  z-index: 10;
}

.detection-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.camera-btn {
  background: linear-gradient(135deg, #FFF9FB, #FFECF2);
  border: 1px solid rgba(255, 236, 242, 0.5);
}

.camera-btn:hover {
  background: linear-gradient(135deg, #FFECF2, #FFD6E5);
}

.gallery-btn {
  background: linear-gradient(135deg, #E8F5E9, #D1FAE5);
  border: 1px solid rgba(209, 250, 229, 0.5);
}

.gallery-btn:hover {
  background: linear-gradient(135deg, #D1FAE5, #C8E6C9);
}

.detection-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.detection-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 3rem;
  height: 3rem;
  background: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.camera-btn .btn-icon {
  color: #F8BBD0;
}

.gallery-btn .btn-icon {
  color: #4ADE80;
}

.detection-btn:hover .btn-icon {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: scale(1.1);
}

.btn-icon svg {
  font-size: 1.25rem;
}

.btn-title {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.btn-subtitle {
  font-size: 0.75rem;
  color: #6B7280;
}

.feature-highlights {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #F3F4F6;
  position: relative;
  z-index: 10;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.ai-dot {
  background-color: #4ADE80;
}

.analysis-dot {
  background-color: #38BDF8;
}

.suggestion-dot {
  background-color: #A855F7;
}

.feature-text {
  font-size: 0.75rem;
  color: #6B7280;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 宽屏布局优化 */
@media (min-width: 768px) {
  .detection-options {
    gap: 1.5rem;
  }
  
  .detection-btn {
    padding: 2rem 1.5rem;
  }
  
  .feature-highlights {
    gap: 2rem;
    margin-top: 2rem;
  }
}

/* 响应式设计优化 */
@media (max-width: 767px) {
  .welcome-card {
    margin-bottom: 1rem;
  }
  
  .detection-options {
    gap: 1rem;
  }
}
</style> 