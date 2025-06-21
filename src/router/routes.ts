const modules = import.meta.glob('@/views/*.vue')

const routes = [
  { name: 'HomePage', path: '/', component: modules['/src/views/HomePage.vue'] },
  { name: 'FullCalendar', path: '/FullCalendar', component: modules['/src/views/FullCalendar.vue'] },
  { name: 'TestPage', path: '/TestPage', component: modules['/src/views/TestPage.vue'] }
]

export default routes
