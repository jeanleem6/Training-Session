<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
if (!instance?.proxy) throw new Error('组件未初始化')
const theme = instance.proxy.$theme

function toggleTheme() {
  theme.setFollowSystem(false)
  theme.setThemeMode(theme.themeMode.value === 'light' ? 'dark' : 'light')
}

function changeColor() {
  theme.setBrandColor('#646cff')
}

function toggleFollowSystem() {
  theme.setFollowSystem(!theme.followSystem.value)
}
</script>

<template>
  <el-row>
    <el-col>
      <el-button @click="toggleTheme">切換 Light/Dark</el-button>
    </el-col>
    <el-col>
      <el-button @click="toggleFollowSystem">切換系統跟隨模式</el-button>
    </el-col>
    <el-col>
      <el-button @click="changeColor">換品牌色</el-button>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-col {
  margin: 0.5rem 0;
}
</style>
