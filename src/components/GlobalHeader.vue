<script setup>
import MainMenus from '@/components/MainMenus.vue'
import ThemeOptions from '@/components/ThemeOptions.vue'
import { Setting } from '@element-plus/icons-vue'

const showConfig = ref(false)
function toggleConfig() {
  showConfig.value = !showConfig.value
}
</script>

<template>
  <el-header>
    <main-menus class="main__menus" />

    <el-button class="config" link @click="showConfig = true">
      <el-icon><Setting /></el-icon>
    </el-button>

    <el-drawer v-model="showConfig" direction="rtl" title="設置" resizable>
      <theme-options />
    </el-drawer>
  </el-header>
</template>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-menu-border-color);
  background-color: var(--bg-color-header);

  .main__menus {
    flex: 1;
  }

  .config {
    font-size: larger;
  }
}
</style>
