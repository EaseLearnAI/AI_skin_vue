<template>
  <div class="selected-products">
    <h2 class="title">
      <i class="fas fa-shopping-basket"></i>
      你选择了这些产品喵～
    </h2>
    <div class="product-list">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.image" :alt="product.name" class="product-image">
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-description">
            <span>{{ product.description }}</span>
          </div>
        </div>
        <button class="remove-button" @click="removeProduct(index)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedProducts',
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  emits: ['remove'],
  methods: {
    removeProduct(index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style scoped>
.selected-products {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.title i {
  color: #f44336;
  margin-right: 0.5rem;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #fff9fb;
  border-radius: 0.5rem;
}

.product-image {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-info {
  flex: 1;
  margin-left: 0.75rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.product-description {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.product-description span {
  font-size: 0.75rem;
  color: #757575;
}

.remove-button {
  color: #bdbdbd;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s;
}

.remove-button:hover {
  color: #f44336;
}
</style> 