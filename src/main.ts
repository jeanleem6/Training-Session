// ===== Vue App 初始化 =====
import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import App from './App.vue'

// ===== 核心插件與全域資源 =====
import pinia from './store'
import router from './router/index'
import { installAppReload } from '@/plugins/appReload'
import themePlugin from './plugins/theme'

// ===== 全域樣式與語系設定 =====
import '@/assets/base.css' // 全域基礎樣式
import '@/styles/element/index.scss' // 自定義 Element Plus 主題

// ===== 建立 Vue App 實例 =====
const app: VueApp = createApp(App)

// ===== 安裝插件 =====
app.use(router)
app.use(pinia)

// 將 router 注入 Pinia store 中，支援 this.router 使用
pinia.use(({ store }) => {
  store.router = router
})

// 設置 Vue app 實例為全局變量
;(window as any).__vue_app__ = app

app.use(themePlugin)

// ===== 安裝 App Reload 功能（重載控制）=====
installAppReload(app)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }

app.mount('#app')

// 導出 app 實例以便測試或其他用途
export { app }
