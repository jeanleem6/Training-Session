<script setup lang="ts">
import { onMounted, nextTick, version } from 'vue'
import GlobalHeader from './components/GlobalHeader.vue'
import PreLoader from '@/views/PreLoader.vue'

import { useDeviceStore, useLoaderState, useThemeStore } from '@/store'

const deviceStore = useDeviceStore()
const isLoading = useLoaderState()
const themeStore = useThemeStore()
const layoutMode = computed(() => deviceStore.layoutMode)
onMounted(() => {
  console.log(`App Mounted! Vue version: v${version}`)

  nextTick(() => {
    isLoading.changeStateFalse()
  })
})
</script>

<template>
  <el-container :class="`layout-${layoutMode}`">
    <GlobalHeader />
    <PreLoader v-if="isLoading.state" :class="themeStore.mode" />
    <router-view v-show="!isLoading.state" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color-main);
}
</style>
