import { dayjs } from 'element-plus'

interface ScheduleItem {
  id: string
  title: string
  start: string
  end: string
  status: 'todo' | 'on' | 'done'
}

function generateSchedules(): ScheduleItem[] {
  const schedules: ScheduleItem[] = []
  const currentTime = dayjs()
  const itemsCount = Math.floor(Math.random() * 10) + 1 // 生成1-10个项

  for (let i = 1; i <= itemsCount; i++) {
    // 获取当前月份的第一天和最后一天
    const startOfMonth = dayjs().startOf('month')
    const endOfMonth = dayjs().endOf('month')

    // 生成随机开始时间（在当前月份范围内）
    const randomStartTime = startOfMonth.valueOf() + Math.random() * (endOfMonth.valueOf() - startOfMonth.valueOf())

    const startDate = dayjs(randomStartTime)

    // 生成结束时间（开始时间 + 1分钟到24小时之间的随机间隔）
    const minEndTime = startDate.add(1, 'minute').valueOf()
    const maxEndTime = startDate.add(24, 'hour').valueOf()

    // 确保结束时间不超过当前月份的最后时刻
    const actualMaxEndTime = Math.min(maxEndTime, endOfMonth.valueOf())
    const randomEndTime = minEndTime + Math.random() * (actualMaxEndTime - minEndTime)
    const endDate = dayjs(randomEndTime)

    // 确定状态
    let status: 'todo' | 'on' | 'done'
    if (currentTime.isBefore(startDate)) {
      status = 'todo'
    } else if (currentTime.isBefore(endDate)) {
      status = 'on'
    } else {
      status = 'done'
    }

    schedules.push({
      id: i.toString(),
      title: `Event ${i}`,
      start: startDate.format('YYYY-MM-DD HH:mm'),
      end: endDate.format('YYYY-MM-DD HH:mm'),
      status
    })
  }

  return schedules
}

// 排序函数 - 按开始时间升序排列
function sortSchedules(schedules: ScheduleItem[]): ScheduleItem[] {
  return schedules.sort((a, b) => {
    const timeA = dayjs(a.start).valueOf()
    const timeB = dayjs(b.start).valueOf()
    return timeA - timeB
  })
}

// 生成班表
const schedules = generateSchedules()
const sortedSchedules = sortSchedules(schedules) // 排序后的班表

// 模拟获取班表的 API
export const getScheduleList = () =>
  new Promise<ScheduleItem[]>((resolve) => {
    resolve(sortedSchedules)
  })
