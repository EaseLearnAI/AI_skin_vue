<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click.self="closeOnBackdrop && $emit('close')">
      <div class="modal-content" :class="[size]">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    show(value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 0 1rem;
}

.modal-content {
  background-color: transparent;
  border-radius: 16px;
  max-height: 90vh;
  overflow: hidden;
  margin: 0;
  will-change: transform, opacity;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
}

.modal-content.small {
  width: 90%;
  max-width: 400px;
}

.modal-content.medium {
  width: 90%;
  max-width: 600px;
}

.modal-content.large {
  width: 90%;
  max-width: 800px;
}

.modal-content.full {
  width: 95%;
  height: 90vh;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 