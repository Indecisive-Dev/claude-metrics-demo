<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: String,
  alt: String,
  class: String,
})

const isFullscreen = ref(false)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    isFullscreen.value = false
  }
}
</script>

<template>
  <div>
    <!-- Thumbnail -->
    <img
      :src="props.src"
      :alt="props.alt"
      :class="[props.class, 'cursor-zoom-in hover:opacity-80 transition-opacity']"
      @click="toggleFullscreen"
    />

    <!-- Fullscreen overlay -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 cursor-zoom-out"
        @click="toggleFullscreen"
        @keydown="handleKeydown"
        tabindex="0"
      >
        <img
          :src="props.src"
          :alt="props.alt"
          class="max-w-[95vw] max-h-[95vh] object-contain"
        />
        <div class="absolute top-4 right-4 text-white/70 text-sm">
          Click or press ESC to close
        </div>
      </div>
    </Teleport>
  </div>
</template>
