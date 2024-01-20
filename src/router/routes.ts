const modules = import.meta.glob('@/views/*.vue')

const routes = [
  { name: 'HomePage', path: '/', component: modules['/src/views/HomePage.vue'] },
  { name: 'ListPage', path: '/ListPage', component: modules['/src/views/ListPage.vue'] },
  { name: 'TestPage', path: '/TestPage', component: modules['/src/views/TestPage.vue'] }
]

export default routes
