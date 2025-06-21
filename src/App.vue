<script setup lang="ts">
import { onMounted, nextTick, version } from 'vue'
import MainMenus from '@/components/MainMenus.vue'
import PreLoader from '@/views/PreLoader.vue'

import { useLoaderState } from '@/store/isloading'
import { currentThemeState } from '@/store/currentTheme'

const isLoading = useLoaderState()
const currentTheme = currentThemeState()

onMounted(() => {
  console.log(`App Mounted! Vue version: v${version}`)

  nextTick(() => {
    isLoading.changeStateFalse()
  })
})
</script>

<template>
  <el-container>
    <main-menus></main-menus>
    <PreLoader v-if="isLoading.state" :class="currentTheme.state" />
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
  background-color: #f2f2f2;
}
</style>
