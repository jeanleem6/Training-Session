<script setup>
import { dayjs } from 'element-plus'
import { computed } from 'vue'

const props = defineProps({
  currentDate: {
    type: Date,
    default: new Date()
  }
})
defineEmits(['prev', 'today', 'next'])

const formatDate = computed(() => dayjs(props.currentDate).format('YYYY / MM'))
</script>

<template>
  <div class="calendar-toolbar">
    <div class="left-tools flex items-center gap-2">
      <el-button size="small" @click="$emit('prev')">
        <el-icon><ArrowLeftBold /></el-icon>
      </el-button>
      <el-button size="small" @click="$emit('today')"> Today </el-button>
      <el-button size="small" @click="$emit('next')">
        <el-icon><ArrowRightBold /></el-icon>
      </el-button>
      <slot name="status" />
    </div>

    <div class="current_day">{{ formatDate }}</div>

    <div class="right-tabs">
      <slot name="tabs" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-toolbar {
  $color-orange: orange;
  $color-green: green;
  $color-blue: blue;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  .left-tools {
    display: flex;
    align-items: center;

    :deep(> span) {
      margin-left: 0.5rem;
      font-size: 0.875rem;

      i {
        margin-right: 0.1rem;
      }

      &.todo i {
        color: $color-orange;
      }
      &.done i {
        color: $color-green;
      }
      &.delay i {
        color: $color-blue;
      }
    }
  }

  .current_day {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
