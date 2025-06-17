import axios from 'axios'
import instance from '@/http/filter.ts'

export const getScheduleList = () =>
  new Promise((resolve, reject) => {
    resolve([
      {
        id: '1',
        title: 'Job 1',
        start: '2025-06-15 10:00',
        end: '2025-06-15 18:00',
        status: 'done'
      },
      {
        id: '2',
        title: 'Job 2',
        start: '2025-06-17 09:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '3',
        title: 'Job 3',
        start: '2025-06-17 10:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '4',
        title: 'Job 4',
        start: '2025-06-17 11:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '5',
        title: 'Job 5',
        start: '2025-06-18 10:00',
        end: '2025-06-18 18:00',
        status: 'delay'
      },
      {
        id: '6',
        title: 'Job 6',
        start: '2025-06-21 09:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      },
      {
        id: '7',
        title: 'Job 7',
        start: '2025-06-21 09:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      },
      {
        id: '8',
        title: 'Job 8',
        start: '2025-06-21 10:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      }
    ])
  })
