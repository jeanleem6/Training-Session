<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElLoading } from 'element-plus'

// 白天(6:00-18:00)用 light loading
const fullscreenLoading = ref(false)
function lightLoader() {
  fullscreenLoading.value = true
}

// 夜晚(6:00-18:00)用 dark loading
let loading: any
function darkLoader() {
  loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

const props = defineProps({
  class: String
})

if (props.class === 'light') {
  lightLoader()
} else {
  darkLoader()
}
onMounted(() => {})

onBeforeUnmount(() => {
  loading?.close()
  fullscreenLoading.value = false
})
</script>

<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="preloader"></div>
</template>
