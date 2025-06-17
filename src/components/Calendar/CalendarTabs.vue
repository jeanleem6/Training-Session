<script setup>
const model = defineModel()
const emit = defineEmits(['change-view'])
const onTabClick = (tab) => emit('change-view', tab.paneName)
</script>

<template>
  <el-tabs v-model="model" @tab-click="onTabClick">
    <el-tab-pane label="日历模式" name="dayGridMonth" />
    <el-tab-pane label="列表模式" name="listMonth" />
  </el-tabs>
</template>
