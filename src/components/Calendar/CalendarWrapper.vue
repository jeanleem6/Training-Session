<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { dayjs } from 'element-plus'
import CalendarEventContent from './CalendarEventContent.vue'

const props = defineProps({
  activeView: String,
  events: Array,
  dayMaxEvents: {
    type: Number,
    default: 2
  }
})
const emit = defineEmits(['event-click', 'show-more', 'view-dates-change'])

const calendarRef = ref()

watch(
  () => props.activeView,
  async () => {
    await nextTick()
    const calendarApi = calendarRef.value?.getApi()
    if (calendarApi) {
      emit('view-dates-change', calendarApi.view.currentStart)
    }
  }
)

function setEventClassName(arg) {
  return arg.event.extendedProps.status
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, listPlugin, interactionPlugin],
  initialView: props.activeView,
  headerToolbar: false,
  events: props.events,
  validRange: {
    start: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    end: dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD')
  },
  dayMaxEvents: props.dayMaxEvents, // ✅ 限制每日最多顯示事件数量
  eventClick({ event }) {
    emit('event-click', event)
  },
  moreLinkClick(info) {
    // 手动找出触发“+n more”的按钮 DOM
    // const moreLinkEl = info.dayEl.querySelector('.fc-more-link')

    const dateStr = dayjs(info.date).format('YYYY-MM-DD')
    const eventsInDay = props.events.filter((e) => dayjs(e.start).format('YYYY-MM-DD') === dateStr)

    // 更精确地定位 `.fc-more` 按钮
    const moreBtn = info.el?.querySelector('.fc-more-link') || info.jsEvent?.target?.closest('.fc-more-link')

    if (!(moreBtn instanceof HTMLElement)) {
      console.warn('未找到 .fc-more-link 對應的 DOM 元素')
      return 'none'
    }

    emit('show-more', {
      events: eventsInDay,
      el: moreBtn
    })
    return 'none' // 防止 FullCalendar 自己打開內建 popover
  },
  eventClassNames: setEventClassName
}))
</script>

<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions">
    <template #eventContent="{ event }">
      <CalendarEventContent :event="event" />
    </template>
  </FullCalendar>
</template>

<style lang="scss" scoped>
.fc-direction-ltr {
  $color-orange: orange;
  $color-green: green;
  $color-blue: blue;

  :deep(.fc-daygrid-day-frame) {
    .fc-daygrid-day-top {
      position: absolute;
      bottom: 0;
      right: 0;
      opacity: 0.5;
    }

    .fc-daygrid-event {
      width: calc(100% - 8px);
      margin: 4px;
      padding: 4px 8px;
      border-left: 2px solid;
      border-radius: 4px;

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
      &.delay {
        border-left-color: $color-blue;
        background-color: rgba($color-blue, 0.1);
        color: $color-blue;
      }

      .event__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }
  }
}
.truncate {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.fc-more-btn {
  margin-top: 2px;
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
}
</style>
