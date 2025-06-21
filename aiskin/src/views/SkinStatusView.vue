<template>
  <div class="skinstatus-view">

    
    <AppHeader 
      title="肌肤检测" 
      icon="camera" 
      right-icon="history"
      bg-color="bg-sakura"
      :show-back-button="true" 
    />

    <main class="main-content">
      <SkinCamera 
        @take-picture="onTakePicture"
        @select-from-gallery="onSelectFromGallery"
        ref="skinCamera"
      />
      
      <div v-if="imageSelected" class="selected-image-container">
        <h3 class="selected-image-title">
          <font-awesome-icon icon="image" />
          已选择图片
        </h3>
        <div class="selected-image">
          <img :src="selectedImage" alt="Selected skin image">
        </div>
        <div class="image-actions">
          <button class="analyze-button" @click="analyzeImage">
            <font-awesome-icon icon="search" />
            分析皮肤
          </button>
          <button class="cancel-button" @click="cancelImageSelection">
            <font-awesome-icon icon="times" />
            取消
          </button>
        </div>
      </div>
      
      <SkinAnalysis 
        v-if="!imageSelected"
        :hydration="skinData.hydration"
        :oil="skinData.oil"
        :sensitivity="skinData.sensitivity"
      />
      
      <SkinRecommendations 
        v-if="!imageSelected"
        :recommendations="recommendations"
      />
    </main>

    <BottomNavigation />
    
    <!-- 开发中提示弹窗 -->
    <div class="modal" v-if="showDevelopmentModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>功能开发中</h3>
          <button class="close-btn" @click="showDevelopmentModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <p>皮肤状态检测功能正在开发中，敬请期待！</p>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="showDevelopmentModal = false">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import AppHeader from '@/components/common/AppHeader.vue'
import BottomNavigation from '@/components/common/BottomNavigation.vue'
import SkinCamera from '@/components/skinstatus/SkinCamera.vue'
import SkinAnalysis from '@/components/skinstatus/SkinAnalysis.vue'
import SkinRecommendations from '@/components/skinstatus/SkinRecommendations.vue'

export default {
  name: 'SkinStatusView',
  components: {
    AppHeader,
    BottomNavigation,
    SkinCamera,
    SkinAnalysis,
    SkinRecommendations
  },
  data() {
    return {
      showDevelopmentModal: true,
      imageSelected: false,
      selectedImage: null,
      selectedFile: null,
      skinData: {
        hydration: {
          value: 75,
          description: '皮肤水分充足，继续保持喵～',
          change: 5
        },
        oil: {
          value: 60,
          description: 'T区油分略偏高，建议使用控油产品喵～'
        },
        sensitivity: {
          level: 2,
          description: '轻度敏感，建议使用温和产品喵～'
        }
      },
      recommendations: [
        {
          title: '防晒提醒',
          description: '今日紫外线较强，记得涂防晒喵～',
          icon: 'sun'
        },
        {
          title: '护理时间表',
          description: '查看今日护理时间安排',
          icon: 'clock'
        }
      ]
    }
  },
  methods: {
    onTakePicture() {
      // 实际项目中，这里会调用摄像头API
      console.log('Taking picture for skin analysis')
      // 模拟拍照，实际应用中应该获取真实照片
      this.simulateCameraCapture()
    },
    onSelectFromGallery(data) {
      // 处理从相册选择的图片
      console.log('Selected image from gallery', data)
      this.selectedFile = data.file
      this.selectedImage = data.preview
      this.imageSelected = true
    },
    simulateCameraCapture() {
      // 模拟拍照功能，实际项目中应该调用设备摄像头
      this.selectedImage = 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600'
      this.imageSelected = true
    },
    analyzeImage() {
      // 分析图片，实际项目中应该调用API或本地处理
      console.log('Analyzing skin image...')
      // 模拟分析过程
      setTimeout(() => {
        this.imageSelected = false
        // 更新分析结果
        this.updateAnalysisResults()
      }, 1500)
    },
    cancelImageSelection() {
      this.imageSelected = false
      this.selectedImage = null
      this.selectedFile = null
    },
    updateAnalysisResults() {
      // 更新分析结果，实际项目中应该根据API返回的数据
      this.skinData = {
        hydration: {
          value: Math.floor(Math.random() * 30) + 70, // 70-100
          description: '皮肤水分充足，继续保持喵～',
          change: Math.floor(Math.random() * 10) - 3 // -3 to 7
        },
        oil: {
          value: Math.floor(Math.random() * 40) + 40, // 40-80
          description: Math.random() > 0.5 
            ? 'T区油分略偏高，建议使用控油产品喵～' 
            : '油脂分泌正常，但注意T区清洁喵～'
        },
        sensitivity: {
          level: Math.floor(Math.random() * 3) + 1, // 1-3
          description: '轻度敏感，建议使用温和产品喵～'
        }
      }
    }
  }
}
</script>

<style scoped>
.skinstatus-view {
  min-height: 100vh;
  background-color: #fff9fb;
  padding-bottom: 5rem;
}

.main-content {
  padding: 1rem;
}

.selected-image-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.selected-image-title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.selected-image-title svg {
  color: #F8BBD0;
  margin-right: 0.5rem;
}

.selected-image {
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.selected-image img {
  width: 100%;
  display: block;
}

.image-actions {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 0.75rem;
}

.analyze-button, .cancel-button {
  padding: 0.75rem;
  border: none;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
}

.analyze-button {
  background-color: #F8BBD0;
  color: white;
}

.analyze-button svg {
  margin-right: 0.5rem;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #757575;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f5f5f5;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  text-align: center;
}

.modal-body p {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f5f5f5;
}

.confirm-btn {
  padding: 0.75rem 2rem;
  background-color: #F8BBD0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: #d63384;
}
</style>