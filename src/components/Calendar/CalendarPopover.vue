<script setup>
import { dayjs } from 'element-plus'
import { ClickOutside as vClickOutside } from 'element-plus'

const props = defineProps(['visible', 'target', 'events'])
const emit = defineEmits(['hide'])

function formatTime(start, end) {
  return `${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`
}

function onClickOutside() {
  if (props.visible) {
    emit('hide')
  }
}
</script>

<template>
  <div ref="buttonRef" v-click-outside="onClickOutside">
    <el-popover
      :visible="visible"
      :virtual-ref="target"
      placement="top"
      width="280"
      trigger="click"
      popper-class="more__events"
      virtual-triggering
    >
      <div v-if="events.length" class="popover-list">
        <div v-for="e in events" :key="e.id || e.title + e.start" class="popover-event">
          <div class="event-title">{{ e.title }}</div>
          <div class="event-meta">
            <span class="time">{{ formatTime(e.start, e.end) }}</span>
            <span class="status-dot" :class="e.extendedProps?.status">{{ e.extendedProps?.status }}</span>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.popover-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;

  .popover-event {
    padding: 6px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
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

      .status-dot {
        border-radius: 18px;
        display: inline-block;
      }
    }
  }
}
</style>
