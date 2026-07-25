import { useDeviceStore } from '@/store'
import { watchDeviceChange } from '@/composables/useDeviceInfo'
import type { App } from 'vue'

export default {
  install(app: App) {
    const deviceStore = useDeviceStore()

    // 提供全域 deviceStore 狀態
    app.config.globalProperties.$deviceInfo = deviceStore
    app.provide('deviceInfo', deviceStore)

    // 提供監聽變化的 API
    app.provide('watchDeviceChange', watchDeviceChange)
  }
}
