<template>
  <div class="image-uploader">
    <div 
      v-if="!selectedImage && !isLoading" 
      class="upload-placeholder"
      @click="selectImage"
    >
      <div class="icon-wrapper">
        <font-awesome-icon :icon="['fas', 'image']" />
      </div>
      <p class="placeholder-text">{{ placeholder || '点击选择图片' }}</p>
    </div>
    
    <div v-else-if="isLoading" class="loading-container">
      <AppleLoader />
      <p class="loading-text">{{ loadingText }}</p>
    </div>
    
    <div v-else class="preview-container">
      <div class="preview-wrapper">
        <img :src="selectedImage.preview" alt="Selected product" class="preview-image">
        
        <div class="image-actions">
          <button class="action-button remove" @click="removeImage">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
          <button class="action-button upload" @click="uploadImage" v-if="!uploaded">
            <font-awesome-icon :icon="['fas', 'upload']" />
          </button>
        </div>
      </div>
      
      <p class="image-name">{{ selectedImage.name }}</p>
    </div>
  </div>
</template>

<script>
import fileService from '@/services/fileService'
import AppleLoader from '@/components/common/AppleLoader.vue'

export default {
  name: 'ImageUploader',
  components: {
    AppleLoader
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedImage: null,
      isLoading: false,
      loadingText: '上传中...',
      uploaded: false
    }
  },
  methods: {
    selectImage() {
      fileService.selectImage({
        onSelect: (files) => {
          if (files && files.length > 0) {
            this.selectedImage = files[0]
            this.uploaded = false
            this.$emit('image-selected', this.selectedImage)
          }
        }
      })
    },
    removeImage() {
      if (this.selectedImage && this.selectedImage.preview) {
        URL.revokeObjectURL(this.selectedImage.preview)
      }
      this.selectedImage = null
      this.uploaded = false
      this.$emit('image-removed')
    },
    uploadImage() {
      if (!this.selectedImage) return
      
      this.isLoading = true
      this.loadingText = '上传中...'
      
      this.$emit('upload-start', this.selectedImage)
      
      // Simulating upload progress
      setTimeout(() => {
        this.loadingText = '处理中...'
        setTimeout(() => {
          this.isLoading = false
          this.uploaded = true
          this.$emit('upload-complete', this.selectedImage)
        }, 800)
      }, 1200)
    },
    setLoading(loading, text = '上传中...') {
      this.isLoading = loading
      this.loadingText = text
    },
    setUploaded(uploaded) {
      this.uploaded = uploaded
    }
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F7;
  border: 2px dashed #C7C7CC;
  border-radius: 12px;
  height: 220px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  background-color: #F0F0F2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #34C759, #30D158);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(52, 199, 89, 0.25);
}

.icon-wrapper svg {
  font-size: 24px;
  color: white;
}

.placeholder-text {
  font-size: 15px;
  color: #8E8E93;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F5F5F7;
  border-radius: 12px;
  height: 220px;
}

.loading-text {
  font-size: 15px;
  color: #8E8E93;
  margin-top: 16px;
  font-weight: 500;
}

.preview-container {
  width: 100%;
}

.preview-wrapper {
  position: relative;
  width: 100%;
  height: 270px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
}

.action-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.action-button.remove {
  background-color: rgba(255, 255, 255, 0.9);
  color: #FF3B30;
}

.action-button.upload {
  background-color: rgba(255, 255, 255, 0.9);
  color: #34C759;
}

.action-button:hover {
  transform: scale(1.1);
}

.image-name {
  font-size: 13px;
  color: #8E8E93;
  margin-top: 10px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
</style> 