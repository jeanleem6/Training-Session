<script setup>
import { ref, onMounted } from 'vue'
import CalendarToolbar from '@/components/Calendar/CalendarToolbar.vue'
import CalendarTabs from '@/components/Calendar/CalendarTabs.vue'
import CalendarWrapper from '@/components/Calendar/CalendarWrapper.vue'
import CalendarListView from '@/components/Calendar/CalendarListView.vue'
import CalendarPopover from '@/components/Calendar/CalendarPopover.vue'
import { getScheduleList } from '@/api/schedule'
import { dayjs } from 'element-plus'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

const activeView = ref('listMonth') // dayGridMonth listMonth
const events = ref([])
const currentDate = ref(new Date())
const loading = ref(true)

const popoverRef = ref(null) // 綁定 Popover 元素（虛擬 ref）
const calendarWrapperRef = ref(null) // 綁定整個日曆容器

const eventCountMap = ref({}) // {'2025-06-21': 3, ...}

function updateEventCount(events) {
  const map = {}

  events.forEach((evt) => {
    const start = dayjs(evt.start).startOf('day')
    const end = dayjs(evt.end).startOf('day')

    const dayCount = end.diff(start, 'day') + 1 // 包含 end 当天

    for (let i = 0; i < dayCount; i++) {
      const dateKey = start.add(i, 'day').format('YYYY-MM-DD')
      map[dateKey] = (map[dateKey] || 0) + 1
    }
  })

  eventCountMap.value = map
}

const popover = ref({
  visible: false,
  target: null,
  events: [],
  date: ''
})

function hidePopover() {
  Object.assign(popover.value, {
    visible: false,
    target: null,
    events: [],
    date: ''
  })
}

function handleShowMore({ events, el, date }) {
  Object.assign(popover.value, {
    visible: true,
    target: el,
    events: events,
    date: date
  })
}

function handleViewChange(view) {
  activeView.value = view
}

function handlePrev() {
  const date = dayjs(currentDate.value).subtract(1, 'month').toDate()
  currentDate.value = date
  calendarWrapperRef.value?.gotoDate(date)
  fetchScheduleList(currentDate.value)
}
function handleToday() {
  const today = dayjs()
  // FullCalendar 切換視圖
  calendarWrapperRef.value?.gotoDate(today, true)

  currentDate.value = today
  fetchScheduleList(today)
}
function handleNext() {
  const date = dayjs(currentDate.value).add(1, 'month').toDate()
  currentDate.value = date
  calendarWrapperRef.value?.gotoDate(date)

  fetchScheduleList(currentDate.value)
}

function goToDetail(event) {
  // router.push(`/schedule/${event.id}`)
}

async function fetchScheduleList(date = new Date()) {
  const start = dayjs(date).startOf('month').format('YYYY-MM-DD')
  const end = dayjs(date).endOf('month').format('YYYY-MM-DD')
  try {
    const res = await getScheduleList({ start, end })
    events.value = res || []
    updateEventCount(events.value)
  } catch (err) {
    console.error('Failed to load schedule list:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchScheduleList(currentDate.value)
})
</script>

<template>
  <div class="page__container">
    <div class="page__inner">
      <CalendarToolbar :currentDate="currentDate" @prev="handlePrev" @today="handleToday" @next="handleNext">
        <template #status>
          <span class="todo"><i>●</i>Todo</span>
          <span class="done"><i>●</i>Done</span>
          <span class="delay"><i>●</i>Delay</span>
        </template>
        <template #tabs>
          <CalendarTabs v-model="activeView" @change-view="handleViewChange" />
        </template>
      </CalendarToolbar>

      <div class="calendar__wrap" v-loading="loading">
        <!-- 月曆視圖 -->
        <CalendarWrapper
          v-if="activeView === 'dayGridMonth'"
          ref="calendarWrapperRef"
          :activeView="activeView"
          :events="events"
          :eventCountMap="eventCountMap"
          @event-click="goToDetail"
          @show-more="handleShowMore"
          @view-dates-change="fetchScheduleList"
        />

        <!-- 列表視圖 -->
        <CalendarListView v-else :events="events" :currentDate="currentDate" @event-click="goToDetail" />

        <CalendarPopover
          ref="popoverRef"
          :visible="popover.visible"
          :target="popover.target"
          :events="popover.events"
          @hide="hidePopover"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.loading {
  height: 80vh;
}

.page__container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: auto;

  .page__inner {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-width: 900px;
    padding: 16px;
    border-radius: 12px;
    background-color: #fff;
  }
}

.calendar__wrap {
  flex-grow: 1;
  min-height: 480px;
}
</style>
