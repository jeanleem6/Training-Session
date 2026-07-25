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
  eventCountMap: Object,
  dayMaxEvents: {
    type: Number,
    default: 2
  }
})
const emit = defineEmits(['event-click', 'show-more', 'view-dates-change', 'hide-popover'])

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

function getEventCount(event) {
  const eventDate = dayjs(event.start).format('YYYY-MM-DD')
  return props.eventCountMap[eventDate] || 0
}

function gotoDate(date, isToday = false) {
  const calendarApi = calendarRef.value?.getApi()
  if (isToday) {
    calendarApi.today()
  } else {
    calendarApi.gotoDate(date)
  }
}

defineExpose({ gotoDate })

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
  fixedWeekCount: true,
  dayMaxEventRows: true,
  expandRows: true,
  contentHeight: '100%',
  // dayMaxEvents: props.dayMaxEvents, // ✅ 限制每日最多顯示事件数量
  eventClick({ event }) {
    emit('event-click', event)
  },
  moreLinkClick(info) {
    const eventsInDay = info.allSegs.map((seg) => seg.event)

    // 更精确地定位 `.fc-more` 按钮
    const moreBtn = info.jsEvent.target
    // console.log(info)

    emit('show-more', {
      events: eventsInDay,
      el: moreBtn,
      date: dayjs(info.date).format('YYYY-MM-DD')
    })
    return 'none' // 防止 FullCalendar 自己打開內建 popover
  },
  eventClassNames: setEventClassName
}))
</script>

<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions">
    <template #eventContent="{ event }">
      <CalendarEventContent :event="event" :eventCount="getEventCount(event)" />
    </template>
  </FullCalendar>
</template>

<style lang="scss" scoped>
.fc-direction-ltr {
  $color-orange: orange;
  $color-green: green;
  $color-blue: blue;

  height: 100%;

  :deep(.fc-daygrid-day-frame) {
    display: flex;
    flex-direction: column-reverse;

    .fc-daygrid-day-top {
      width: 28px;
      height: 10px;
      align-self: flex-end;

      .fc-daygrid-day-number {
        position: absolute;
        bottom: 0.2rem;
        font-size: 14px;
      }
    }

    .fc-daygrid-day-events {
      height: 100%;
      bottom: 0;
    }

    .fc-daygrid-event {
      width: calc(100% - 8px);
      margin: 4px 4px 0px;
      padding: 2px 8px;
      border-left: 2px solid;
      border-radius: 4px;
      line-height: 1.2;

      &::before,
      &::after {
        display: none;
      }

      &.fc-h-event {
        border-width: 0;
        border-left-width: 2px;

        .fc-event-main {
          color: inherit;
        }
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

      .event__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
    }

    .fc-more-link {
      position: absolute;
      bottom: -9px;
      left: 50%;
      padding: 0 0.5rem;
      border-radius: 18px;
      background-color: #f2f2f2;
      font-size: 12px;
      line-height: 18px;
      color: #409eff;
      transform: translateX(-50%);
      cursor: pointer;
    }
  }
}
</style>
