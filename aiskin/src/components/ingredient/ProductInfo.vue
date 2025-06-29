<template>
  <div class="product-info">
    <div class="product-container">
      <img :src="product.imageUrl || 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=200'" 
           :alt="product.name" 
           class="product-image">
      <div class="product-details">
        <h2 class="product-title">{{ product.name }}</h2>
        <div class="product-tags">
          <span v-for="(tag, index) in productTags" :key="index" class="product-tag">
            <font-awesome-icon :icon="['fas', tag.icon]" class="tag-icon" />
            {{ tag.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductInfo',
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        name: '',
        description: '',
        imageUrl: '',
        tags: []
      })
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  computed: {
    productTags() {
      return [
        { icon: 'check-circle', text: '温和配方' },
        { icon: 'tint', text: '弱酸性' }
      ]
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      this.$emit('toggle-favorite', this.isFavorite)
    }
  }
}
</script>

<style scoped>
.product-info {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.15);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.product-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.product-image {
  width: 6rem;
  height: 6rem;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #333;
  line-height: 1.3;
}

.product-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.favorite-button {
  color: #f48fb1;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.product-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.product-tag:first-child {
  background-color: #e8f5e9;
  color: #388e3c;
}

.product-tag:nth-child(2) {
  background-color: #e3f2fd;
  color: #1976d2;
}

.tag-icon {
  margin-right: 0.25rem;
}
</style>