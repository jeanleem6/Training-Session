<script setup>
const model = defineModel()
const emit = defineEmits(['change-view'])
const onTabClick = (tab) => emit('change-view', tab.paneName)
</script>

<template>
  <el-tabs v-model="model" @tab-click="onTabClick">
    <el-tab-pane label="Month" name="dayGridMonth" />
    <el-tab-pane label="List" name="listMonth" />
  </el-tabs>
</template>

<style lang="scss" scoped>
.el-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}
</style>
