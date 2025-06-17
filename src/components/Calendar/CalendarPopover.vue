<script setup>
import { dayjs } from 'element-plus'

defineProps(['visible', 'target', 'events'])
defineEmits(['hide'])

function formatTime(start, end) {
  return `${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`
}

function hidePopover() {
  console.log('hide')
  $emit('hide')
}
</script>

<template>
  <el-popover
    :visible="visible"
    :virtual-ref="target"
    placement="top"
    width="280"
    trigger="click"
    popper-class="more__events"
    teleported
    @hide="hidePopover"
  >
    <div v-if="events.length" class="popover-list">
      <div v-for="e in events" :key="e.id || e.title + e.start" class="popover-event">
        <div class="event-title">{{ e.title }}</div>
        <div class="event-meta">
          <span class="time">{{ formatTime(e.start, e.end) }}</span>
          <span
            class="status-dot"
            :class="{
              'bg-gray-400': e.status === 'todo',
              'bg-green-500': e.status === 'done',
              'bg-red-500': e.status === 'delay'
            }"
          />
        </div>
      </div>
    </div>
    <div v-else class="text-gray-400 text-sm text-center py-2">無事件</div>
  </el-popover>
</template>

<style scoped>
.popover-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}
.popover-event {
  padding: 6px 0;
  border-bottom: 1px solid #ebeef5;
}
.popover-event:last-child {
  border-bottom: none;
}
.event-title {
  font-weight: 500;
  font-size: 14px;
}
.event-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>
