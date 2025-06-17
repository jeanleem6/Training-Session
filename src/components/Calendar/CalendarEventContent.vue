<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  event: Object
})

const title = props.event?.title || ''
const status = props.event?.extendedProps?.status || ''
</script>

<template>
  <el-tooltip placement="top" effect="light" :content="title">
    <div class="event__content" :class="status">
      <span class="truncate">{{ title }}</span>
      <span class="status">{{ status }}</span>
    </div>
  </el-tooltip>
</template>

<style scoped>
.event-content {
  display: inline-block;
}

.truncate {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
