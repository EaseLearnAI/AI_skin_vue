<template>
  <div class="skin-camera">
    <div class="camera-preview">
      <div class="camera-overlay">
        <div class="camera-message">
          <p>让我来看看你的肌肤状态喵～</p>
        </div>
      </div>
      <div class="camera-scanning"></div>
    </div>
    <div class="camera-actions">
      <button class="action-button camera" @click="takePicture">
        <font-awesome-icon icon="camera" />
        拍照检测
      </button>
      <button class="action-button gallery" @click="selectFromGallery">
        <font-awesome-icon icon="image" />
        从相册选择
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkinCamera',
  data() {
    return {
      imageSelected: false,
      imagePreview: null
    }
  },
  methods: {
    takePicture() {
      // 实际项目中，这里会调用摄像头API
      console.log('拍照检测')
      this.$emit('take-picture')
    },
    selectFromGallery() {
      // 创建文件选择器
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      
      // 监听文件选择事件
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
          // 创建文件读取器
          const reader = new FileReader()
          reader.onload = (e) => {
            this.imagePreview = e.target.result
            this.imageSelected = true
            // 通知父组件
            this.$emit('select-from-gallery', {
              file: file,
              preview: this.imagePreview
            })
          }
          reader.readAsDataURL(file)
        }
      })
      
      // 触发文件选择器点击
      fileInput.click()
    }
  }
}
</script>

<style scoped>
.skin-camera {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.camera-preview {
  position: relative;
  aspect-ratio: 4/3;
  background: linear-gradient(to bottom right, #5e35b1, #3949ab);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  background-size: cover;
  background-position: center;
}

.camera-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.camera-message {
  text-align: center;
}

.camera-message p {
  font-size: 0.875rem;
  color: white;
}

.camera-preview::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.camera-scanning {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  animation: scanEffect 3s ease-in-out infinite;
}

@keyframes scanEffect {
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(100%) scale(1.02); opacity: 0.4; }
  100% { transform: translateY(0) scale(1); opacity: 0.8; }
}

.camera-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff9fb;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  background-color: #ffd6e5;
  transform: translateY(-2px);
}

.action-button svg {
  font-size: 1.25rem;
  color: #F8BBD0;
  margin-bottom: 0.5rem;
}

.action-button:hover svg {
  color: #ad1457;
}
</style> 