import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 創建 Pinia 實例
const pinia = createPinia()

// 使用持久化存儲插件
pinia.use(
  createPersistedState({
    storage: localStorage // <'sessionStorage' | 'localStorage'> （可在模塊中設置 storage 來覆蓋該全局配置）
  })
)

// 導出 Pinia 實例給 main.js 使用
export default pinia

// 模塊統一導出
export * from './modules/device'
export * from './modules/theme'
export * from './modules/isloading'
