<script setup>
defineEmits(['prev', 'today', 'next'])
</script>

<template>
  <div class="calendar-toolbar flex justify-between mb-2">
    <div class="left-tools flex items-center gap-2">
      <el-button size="small" @click="$emit('prev')">上一月</el-button>
      <el-button size="small" @click="$emit('today')">今日</el-button>
      <el-button size="small" @click="$emit('next')">下一月</el-button>
      <slot name="status" />
    </div>
    <div class="right-tabs">
      <slot name="tabs" />
    </div>
  </div>
</template>

<style scoped>
.calendar-toolbar {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 0.5rem;
}
</style>
