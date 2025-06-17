<script setup>
import { computed } from 'vue'
import { dayjs } from 'element-plus'
const props = defineProps({
  events: Array,
  currentDate: Date
})

const emit = defineEmits(['event-click'])

const filteredEvents = computed(() => {
  const start = dayjs(props.currentDate).startOf('month').subtract(1, 'month')
  const end = dayjs(props.currentDate).endOf('month').add(1, 'month')

  return props.events.filter((e) => {
    const date = dayjs(e.start)
    return (date.isAfter(start) || date.isSame(start, 'day')) && (date.isBefore(end) || date.isSame(end, 'day'))
  })
})

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}
</script>

<template>
  <div class="p-4">
    <ul class="space-y-2">
      <li
        v-for="event in filteredEvents"
        :key="event.id"
        class="p-2 border rounded hover:bg-gray-50 cursor-pointer"
        @click="$emit('event-click', event)"
      >
        <div class="font-semibold">{{ event.title }}</div>
        <div class="text-xs text-gray-500">{{ formatDate(event.start) }} ~ {{ formatDate(event.end) }}</div>
      </li>
    </ul>
  </div>
</template>
