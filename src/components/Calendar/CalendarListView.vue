<script setup>
import { computed } from 'vue'
import { dayjs } from 'element-plus'
const props = defineProps({
  events: Array,
  currentDate: Date
})

const emit = defineEmits(['event-click'])

// 仅显示：上一月、当月、下一月的数据
const filteredEvents = computed(() => {
  // 当前日期的上一月的第一天
  const start = dayjs(props.currentDate).startOf('month').subtract(1, 'month')
  // 当前日期的下一月的最后一天
  const end = dayjs(props.currentDate).endOf('month').add(1, 'month')

  return props.events.filter((e) => {
    const date = dayjs(e.start)
    return (date.isAfter(start) || date.isSame(start, 'day')) && (date.isBefore(end) || date.isSame(end, 'day'))
  })
})

// 格式化日期范围
const formatDateRange = (event) => {
  const start = dayjs(event.start)
  const end = dayjs(event.end)
  const isSameDay = start.isSame(end, 'day')

  if (isSameDay) return `${start.format('MM-DD HH:mm')} ~ ${end.format('HH:mm')}`
  return `${start.format('MM-DD HH:mm')} ~ ${end.format('MM-DD HH:mm')}`
}
</script>

<template>
  <ul class="calendar__list">
    <li
      v-for="event in filteredEvents"
      :key="event.id"
      class="item"
      :class="event.status"
      @click="$emit('event-click', event)"
    >
      <div class="time__range">{{ formatDateRange(event) }}</div>
      <div class="title">{{ event.title }}</div>
      <span class="status">{{ event.status }}</span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.calendar__list {
  $color-orange: orange;
  $color-green: green;
  $color-blue: blue;

  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  padding: 0;
  list-style: none;

  .item {
    position: relative;
    padding: 0.5rem 0.75rem;
    border-left: 0.25rem solid rgba(0, 0, 0, 0.24);
    border-radius: 0.275rem;
    background-color: #eee;
    font-size: 0.75rem;
    line-height: 1.5;
    text-align: left;

    .time__range {
      font-weight: 700;
    }

    .title {
      color: rgba(0, 0, 0, 0.5);
    }

    .status {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0 0.3rem;
      border-radius: 0.25rem;
      background-color: rgba(255, 255, 255, 0.75);
    }

    &.todo {
      border-left-color: $color-orange;
      background-color: rgba($color-orange, 0.1);
      color: $color-orange;
    }
    &.done {
      border-left-color: $color-green;
      background-color: rgba($color-green, 0.1);
      color: $color-green;
    }
    &.on {
      border-left-color: $color-blue;
      background-color: rgba($color-blue, 0.1);
      color: $color-blue;
    }
  }
}
</style>
