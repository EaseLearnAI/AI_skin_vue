<template>
  <div class="search-bar">
    <i class="fas fa-search search-icon"></i>
    <input 
      type="search" 
      :placeholder="placeholder" 
      class="search-input"
      v-model="searchQuery"
      @input="onInput"
    >
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: '搜索...'
    },
    delay: {
      type: Number,
      default: 300 // Debounce delay in ms
    }
  },
  data() {
    return {
      searchQuery: '',
      timeout: null
    }
  },
  methods: {
    onInput() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.$emit('search', this.searchQuery)
      }, this.delay)
    }
  }
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9e9e9e;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #424242;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(248, 187, 208, 0.5);
}

.search-input::placeholder {
  color: #9e9e9e;
}
</style> 