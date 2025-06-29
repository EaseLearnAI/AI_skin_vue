<template>
  <div class="tag-selector">
    <div class="tag-selector-header">
      <h3 class="selector-title">{{ title }}</h3>
      <button v-if="showClose" class="close-button" @click="$emit('close')">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>
    
    <div class="opening-date-section">
      <h4 class="section-title">开封日期</h4>
      <div class="date-input">
        <input 
          type="date" 
          v-model="openingDate"
          class="date-picker"
        >
      </div>
    </div>
    
    <div class="tag-section">
      <h4 class="section-title">选择产品类型</h4>
      <div class="predefined-tags">
        <button 
          v-for="(tag, index) in predefinedTags" 
          :key="`tag-${index}`"
          class="tag-button"
          :class="{ 'selected': selectedTag === tag }"
          @click="selectTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    
    <div class="action-buttons">
      <button 
        class="cancel-button" 
        @click="$emit('cancel')"
      >
        取消
      </button>
      <button 
        class="confirm-button" 
        @click="confirmSelection"
      >
        确认
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagSelector',
  props: {
    title: {
      type: String,
      default: '产品信息'
    },
    initialTag: {
      type: String,
      default: ''
    },
    initialDate: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      predefinedTags: ['洁面', '精华', '面膜', '防晒', '面霜', '爽肤水', '乳液', '眼霜'],
      selectedTag: this.initialTag,
      openingDate: this.initialDate || new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    selectTag(tag) {
      this.selectedTag = tag;
    },
    confirmSelection() {
      this.$emit('confirm', {
        tag: this.selectedTag,
        openingDate: this.openingDate ? new Date(this.openingDate).toISOString() : null
      });
      
      // Navigate to product analysis page after confirmation
      this.$router.push('/product');
    }
  }
}
</script>

<style scoped>
.tag-selector {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.tag-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.selector-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f1f1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.opening-date-section {
  margin-bottom: 1.5rem;
}

.date-input {
  width: 100%;
}

.date-picker {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #333;
}

.tag-section {
  margin-bottom: 1.5rem;
}

.predefined-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #e0e0e0;
  background-color: white;
  color: #424242;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-button.selected {
  background-color: #E1BEE7;
  border-color: #CE93D8;
  color: #6A1B9A;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-button, .confirm-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #e0e0e0;
  background-color: white;
  color: #424242;
}

.confirm-button {
  border: none;
  background-color: #F48FB1;
  color: white;
}

.confirm-button:disabled {
  background-color: #f8bbd0;
  cursor: not-allowed;
}
</style> 