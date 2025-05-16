<template>
  <div class="add-product">
    <h3 class="section-title">
      <i class="fas fa-plus-circle"></i>
      添加新产品到猫窝
    </h3>
    <div class="add-options">
      <button class="add-option" @click="captureProduct">
        <div class="option-icon">
          <i class="fas fa-camera"></i>
        </div>
        <span class="option-title">拍照识别</span>
        <p class="option-description">猫眼扫描成分</p>
      </button>
      <button class="add-option" @click="selectFromGallery">
        <div class="option-icon">
          <i class="fas fa-image"></i>
        </div>
        <span class="option-title">相册选择</span>
        <p class="option-description">从相册中选择</p>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProduct',
  methods: {
    captureProduct() {
      this.$emit('capture-product')
    },
    selectFromGallery() {
      this.$emit('select-from-gallery')
    }
  }
}
</script>

<style scoped>
.add-product {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.add-product:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 182, 193, 0.25);
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-title i {
  color: #F8BBD0;
  margin-right: 0.5rem;
}

.add-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.add-option {
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
  text-align: center;
}

.add-option:hover {
  background-color: #ffd6e5;
  transform: translateY(-2px);
}

.option-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, #F8BBD0, #E1BEE7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.add-option:hover .option-icon {
  transform: scale(1.1);
}

.option-icon i {
  color: white;
  font-size: 1.25rem;
}

.option-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.option-description {
  font-size: 0.75rem;
  color: #757575;
  margin: 0;
}
</style> 