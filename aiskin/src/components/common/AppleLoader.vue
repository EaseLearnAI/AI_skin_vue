<template>
  <div class="apple-loader-container" :style="{ opacity: opacity }">
    <svg class="apple-loader" viewBox="0 0 50 50" width="50" height="50">
      <circle 
        class="loader-circle"
        cx="25" 
        cy="25" 
        r="20" 
        fill="none" 
        stroke="url(#gradient)" 
        stroke-width="4"
        stroke-linecap="round">
      </circle>
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34C759" />
          <stop offset="100%" stop-color="#30D158" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'AppleLoader',
  props: {
    opacity: {
      type: Number,
      default: 1.0
    }
  }
}
</script>

<style scoped>
.apple-loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.apple-loader {
  transform-origin: center;
  animation: rotate 1.2s linear infinite;
}

.loader-circle {
  stroke-dasharray: 125;
  stroke-dashoffset: 125;
  animation: dash 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 2px rgba(52, 199, 89, 0.3));
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 125;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -125;
  }
}
</style> 