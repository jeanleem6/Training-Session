<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import MainMenus from '@/components/MainMenus.vue'
import PreLoader from '@/views/PreLoader.vue'

import { useLoaderState } from '@/store/isloading'
import { currentThemeState } from '@/store/currentTheme'

const isLoading = useLoaderState()
const currentTheme = currentThemeState()

onMounted(() => {
  console.log('App Mounted!')

  nextTick(() => {
    isLoading.changeStateFalse()
  })
})
</script>

<template>
  <main-menus></main-menus>
  <PreLoader v-if="isLoading.state" :class="currentTheme.state" />
  <router-view v-show="!isLoading.state" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
