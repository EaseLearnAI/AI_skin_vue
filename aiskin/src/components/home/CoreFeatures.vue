<template>
  <div class="core-features">
    <div class="section-header">
      <div class="icon-container">
        <i class="fas fa-bolt"></i>
      </div>
      <h2 class="title">核心功能</h2>
    </div>
    
    <div class="features-grid">
      <!-- Product Analysis -->
      <router-link to="/product" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <i class="fas fa-flask"></i>
          </div>
          <h3 class="feature-title">产品分析</h3>
          <p class="feature-description">AI智能解析成分</p>
        </div>
      </router-link>

      <!-- Conflict Detection -->
      <router-link to="/conflict" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="feature-title">冲突检测</h3>
          <p class="feature-description">避免成分相互作用</p>
        </div>
      </router-link>

      <!-- Skin Analysis -->
      <router-link to="/skinstatus" class="feature-card">
        <div class="feature-content">
          <div class="feature-icon">
            <i class="fas fa-camera"></i>
          </div>
          <h3 class="feature-title">肌肤检测</h3>
          <p class="feature-description">AI智能肤质分析</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoreFeatures'
}
</script>

<style scoped>
.core-features {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #7e57c2, #5e35b1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.icon-container i {
  color: white;
  font-size: 1.25rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.feature-card {
  display: block;
  height: 180px;
  text-decoration: none;
  color: inherit;
}

.feature-content {
  background: linear-gradient(to bottom right, var(--bg-from, #fce4ec), var(--bg-to, #f8bbd0));
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

.feature-card:nth-child(1) .feature-content {
  --bg-from: #fce4ec;
  --bg-to: #f8bbd0;
}

.feature-card:nth-child(2) .feature-content {
  --bg-from: #ede7f6;
  --bg-to: #d1c4e9;
}

.feature-card:nth-child(3) .feature-content {
  --bg-from: #e1f5fe;
  --bg-to: #b3e5fc;
}

.feature-content:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: transform 0.5s ease;
}

.feature-content:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card:nth-child(1) .feature-icon i {
  color: #ec407a;
}

.feature-card:nth-child(2) .feature-icon i {
  color: #7e57c2;
}

.feature-card:nth-child(3) .feature-icon i {
  color: #29b6f6;
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  color: #424242;
  margin-bottom: 0.5rem;
}

.feature-description {
  font-size: 0.875rem;
  color: #616161;
  text-align: center;
}
</style> 