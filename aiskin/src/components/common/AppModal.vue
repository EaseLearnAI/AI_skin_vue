<template>
  <Modal 
    :show="show" 
    :size="size" 
    :close-on-backdrop="closeOnBackdrop" 
    @close="$emit('close')"
  >
    <slot></slot>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'AppModal',
  components: {
    Modal
  },
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
  emits: ['close']
}
</script>

<style scoped>
/* No additional styling needed, using Modal.vue's styles */
</style> 