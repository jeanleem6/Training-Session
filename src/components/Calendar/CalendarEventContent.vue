<script setup>
import { dayjs } from 'element-plus'

const props = defineProps({
  event: Object,
  eventCount: Number
})
function handleEvent(e) {
  const timeArea = `${dayjs(e?.start).format('HH:mm')} - ${dayjs(e?.end).format('HH:mm')}`
  const title = e?.title || ''
  const status = e?.extendedProps?.status || ''
  const isSimpleView = props.eventCount > 2

  return { timeArea, title, status, isSimpleView }
}
const { timeArea, title, status, isSimpleView } = handleEvent(props.event)
</script>

<template>
  <el-tooltip placement="top" effect="light" :content="title">
    <div class="event__content" :class="[status, { simple__view: isSimpleView }]">
      <div class="time__area">{{ timeArea }}</div>
      <div v-if="isSimpleView" class="status">{{ status }}</div>
      <div v-else class="info">
        <span class="truncate">{{ title }}</span>
        <span class="status">{{ status }}</span>
      </div>
    </div>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.event__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 12px;
  justify-content: flex-start;

  &.simple__view {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .time__area {
    width: 100%;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .truncate {
    max-width: 120px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .status {
    font-weight: 700;
  }
}
</style>
