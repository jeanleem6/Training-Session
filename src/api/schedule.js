import axios from 'axios'
import instance from '@/http/filter.ts'

export const getScheduleList = () =>
  new Promise((resolve, reject) => {
    resolve([
      {
        id: '1',
        title: 'Event 1',
        start: '2025-06-05 10:00',
        end: '2025-06-05 18:00',
        status: 'done'
      },
      {
        id: '1-1',
        title: 'Event 1-1',
        start: '2025-06-05 10:00',
        end: '2025-06-05 18:00',
        status: 'done'
      },
      {
        id: '1-2',
        title: 'Event 1-2',
        start: '2025-06-05 10:00',
        end: '2025-06-05 18:00',
        status: 'done'
      },
      {
        id: '1-3',
        title: 'Event 1-3',
        start: '2025-06-05 10:00',
        end: '2025-06-05 18:00',
        status: 'done'
      },
      // {
      //   id: '1-4',
      //   title: 'Event 1-4',
      //   start: '2025-06-05 10:00',
      //   end: '2025-06-05 18:00',
      //   status: 'done'
      // },
      {
        id: '2',
        title: 'Event 2',
        start: '2025-06-17 09:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '3',
        title: 'Event 3',
        start: '2025-06-17 10:00',
        end: '2025-06-18 01:00',
        status: 'todo'
      },
      {
        id: '4',
        title: 'Event 4',
        start: '2025-06-17 11:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '4-1',
        title: 'Event 4-1',
        start: '2025-06-17 11:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '4-2',
        title: 'Event 4-1',
        start: '2025-06-17 11:00',
        end: '2025-06-17 18:00',
        status: 'todo'
      },
      {
        id: '5',
        title: 'Event 5',
        start: '2025-06-18 10:00',
        end: '2025-06-18 18:00',
        status: 'delay'
      },
      {
        id: '5-1',
        title: 'Event 5-1',
        start: '2025-06-18 11:00',
        end: '2025-06-18 16:00',
        status: 'delay'
      },
      {
        id: '5-2',
        title: 'Event 5-2',
        start: '2025-06-18 11:00',
        end: '2025-06-18 16:00',
        status: 'delay'
      },
      {
        id: '5-3',
        title: 'Event 5-3',
        start: '2025-06-18 11:00',
        end: '2025-06-18 16:00',
        status: 'delay'
      },
      {
        id: '11',
        title: 'Event 11',
        start: '2025-06-19 11:00',
        end: '2025-06-19 16:00',
        status: 'delay'
      },
      {
        id: '12',
        title: 'Event 12',
        start: '2025-06-19 11:00',
        end: '2025-06-19 16:00',
        status: 'delay'
      },
      {
        id: '6',
        title: 'Event 6',
        start: '2025-06-21 09:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      },
      {
        id: '7',
        title: 'Event 7',
        start: '2025-06-21 09:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      },
      {
        id: '8',
        title: 'Event 8',
        start: '2025-06-21 10:00',
        end: '2025-06-21 18:00',
        status: 'delay'
      }
    ])
  })
