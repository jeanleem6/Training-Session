<script setup>
import { ref, onMounted } from 'vue'
import CalendarToolbar from '@/components/Calendar/CalendarToolbar.vue'
import CalendarTabs from '@/components/Calendar/CalendarTabs.vue'
import CalendarWrapper from '@/components/Calendar/CalendarWrapper.vue'
import CalendarListView from '@/components/Calendar/CalendarListView.vue'
import CalendarPopover from '@/components/Calendar/CalendarPopover.vue'
import { getScheduleList } from '@/api/schedule'
import { dayjs } from 'element-plus'
import { onClickOutside } from '@vueuse/core'

const activeView = ref('dayGridMonth')
const events = ref([])
const currentDate = ref(new Date())
const loading = ref(true)
const fallbackTarget = ref(null)

const popoverEl = ref(null) // 綁定 Popover 元素（虛擬 ref）
const calendarWrapperRef = ref(null) // 綁定整個日曆容器
const popoverTarget = ref(null) // 被點擊的 more 按鈕

// 點擊外部自動關閉 popover
// onClickOutside(popoverEl, () => {
//   if (popover.value.visible) {
//     // 點擊 outside popover 及 calendarWrap 才關閉
//     popover.value.visible = false
//     popover.value.target = null
//     popover.value.events = []
//   }
// })

const popover = ref({
  visible: false,
  target: null,
  events: []
})

function hidePopover() {
  console.log('listPage hide popover')
  popover.value.visible = false
}

function handleViewChange(view) {
  activeView.value = view
}

function handlePrev() {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'month').toDate()
  fetchScheduleList(currentDate.value)
}
function handleToday() {
  currentDate.value = new Date()
  fetchScheduleList(currentDate.value)
}
function handleNext() {
  currentDate.value = dayjs(currentDate.value).add(1, 'month').toDate()
  fetchScheduleList(currentDate.value)
}

function handleShowMore({ events: dayEvents, el }) {
  const target = el instanceof HTMLElement ? el : fallbackTarget.value
  popoverTarget.value = target

  popover.value = {
    visible: true,
    target,
    events: dayEvents
  }
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
  <div class="calendar__wrap">
    <CalendarToolbar @prev="handlePrev" @today="handleToday" @next="handleNext">
      <template #status>
        <span class="text-xs text-gray-500">● 待辦</span>
        <span class="text-xs text-green-500 ml-2">● 已完成</span>
        <span class="text-xs text-red-500 ml-2">● 延期</span>
      </template>
      <template #tabs>
        <CalendarTabs v-model="activeView" @change-view="handleViewChange" />
      </template>
    </CalendarToolbar>

    <div v-if="loading" class="loading" v-loading="loading"></div>

    <div v-else class="wrap">
      <!-- 月曆視圖 -->
      <CalendarWrapper
        v-if="activeView === 'dayGridMonth'"
        ref="calendarWrapperRef"
        :activeView="activeView"
        :events="events"
        @event-click="goToDetail"
        @show-more="handleShowMore"
        @view-dates-change="fetchScheduleList"
      />

      <!-- 列表視圖 -->
      <CalendarListView v-else :events="events" :currentDate="currentDate" @event-click="goToDetail" />
    </div>

    <CalendarPopover
      ref="popoverEl"
      :visible="popover.visible"
      :target="popover.target"
      :events="popover.events"
      @hide="hidePopover"
    />

    <span ref="fallbackTarget" style="position: fixed; left: -9999px; top: -9999px"></span>
  </div>
</template>

<style>
.loading {
  height: 80vh;
}
</style>
