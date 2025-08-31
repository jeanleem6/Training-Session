/**
 * useDeviceInfo
 *
 * 提供裝置相關資訊的組合式函數，包含：
 *
 * - `deviceType`：根據 UA 判斷設備類型（'ios' | 'android' | 'pc'）
 * - `layoutMode`：根據視窗寬度判斷佈局模式（'mobile' | 'tablet' | 'desktop'）
 * - `isTouchDevice`：是否支援觸控（根據瀏覽器觸控能力）
 * - `orientation`：監測螢幕方向變化（'portrait' | 'landscape'）
 *
 * 支援自動偵測設備變更（例如 DevTools 切換設備、視窗縮放），並自動更新對應資訊。
 *
 * ✅ 支援現代瀏覽器的 Screen Orientation API；
 * ✅ 備援支援舊設備（如 iOS Safari）使用 `window.orientationchange`。
 *
 * 📌 適用於響應式佈局、自適應介面邏輯、平台差異化判斷等場景。
 *
 * @returns {{
 *   deviceType: Ref<'ios' | 'android' | 'pc'>,
 *   layoutMode: Ref<'mobile' | 'tablet' | 'desktop'>,
 *   isTouchDevice: Ref<boolean>,
 *   orientation: Ref<'portrait' | 'landscape'>,
 *   initWatchers: () => void,
 *   cleanupWatchers: () => void
 * }}
 */

import { onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores'
import { useDeviceType } from './device/useDeviceType'
import { useLayoutMode } from './device/useLayoutMode'
import { useTouchSupport } from './device/useTouchSupport'
import { useOrientation } from './device/useOrientation'
import throttle from 'lodash/throttle'

// 儲存所有註冊的回調，當裝置資訊更新時會依序觸發
const callbacks = []

/**
 * 註冊設備資訊變更監聽器
 * 可用於響應設備變化（如縮放、方向變更、UA 更換等）
 *
 * @param {() => void} callback - 變更時要觸發的回調
 * @returns {() => void} - 用於移除該回調的函數
 */
export function watchDeviceChange(callback) {
  callbacks.push(callback)
  return () => {
    const index = callbacks.indexOf(callback)
    if (index !== -1) callbacks.splice(index, 1)
  }
}

// 監聽器引用計數，確保多組件同時使用時能共用監聽
let refCount = 0

/**
 * useDeviceInfo 核心組合式函數
 *
 * 初始化裝置資訊，並在變更時更新狀態與觸發回調
 */
export function useDeviceInfo() {
  const store = useDeviceStore()

  const { getDeviceType } = useDeviceType()
  const { getLayoutMode } = useLayoutMode()
  const { detectTouch } = useTouchSupport()
  const { getOrientation } = useOrientation()

  // 更新所有設備狀態並同步至 store，然後觸發所有回調
  const update = async () => {
    const nextDeviceType = getDeviceType()
    const nextLayoutMode = getLayoutMode()
    const nextIsTouch =
      typeof window !== 'undefined' ? 'ontouchstart' in window || navigator.maxTouchPoints > 0 : detectTouch()
    const nextOrientation = getOrientation()

    if (store.deviceType !== nextDeviceType) store.deviceType = nextDeviceType
    if (store.layoutMode !== nextLayoutMode) store.layoutMode = nextLayoutMode
    if (store.isTouchDevice !== nextIsTouch) store.isTouchDevice = nextIsTouch
    if (store.orientation !== nextOrientation) store.orientation = nextOrientation

    callbacks.forEach(cb => cb())
  }

  // 當視窗大小變更時觸發，節流控制
  const resizeHandler = throttle(update, 100)

  // 當裝置方向變更時觸發（橫 / 豎）
  const orientationHandler = () => {
    const next = getOrientation()
    if (store.orientation !== next) {
      store.orientation = next
      callbacks.forEach(cb => cb())
    }
  }

  // 當首次偵測到觸控事件時，更新為觸控裝置
  const touchHandler = () => {
    if (!store.isTouchDevice) {
      store.isTouchDevice = true
      callbacks.forEach(cb => cb())
    }
    window.removeEventListener('touchstart', touchHandler)
  }

  // 初始化監聽器，只會執行一次
  function initWatchers() {
    if (typeof window === 'undefined') return
    if (refCount === 0) {
      update()
      window.addEventListener('resize', resizeHandler)
      const orientationAPI = typeof screen !== 'undefined' ? screen.orientation : null
      orientationAPI?.addEventListener('change', orientationHandler)
      window.addEventListener('orientationchange', orientationHandler)
      window.addEventListener('touchstart', touchHandler, { once: true })
    }
    refCount++
  }

  // 移除所有監聽器，釋放資源
  function cleanupWatchers() {
    if (typeof window === 'undefined') return
    refCount--
    if (refCount <= 0) {
      refCount = 0
      window.removeEventListener('resize', resizeHandler)
      resizeHandler.cancel?.()
      const orientationAPI = typeof screen !== 'undefined' ? screen.orientation : null
      orientationAPI?.removeEventListener('change', orientationHandler)
      window.removeEventListener('orientationchange', orientationHandler)
      window.removeEventListener('touchstart', touchHandler)
    }
  }

  onMounted(() => {
    initWatchers() // 初始化裝置監聽
  })
  onUnmounted(() => {
    cleanupWatchers() // 清除裝置監聽
  })

  return {
    deviceType: store.deviceType,
    layoutMode: store.layoutMode,
    isTouchDevice: store.isTouchDevice,
    orientation: store.orientation,
    initWatchers,
    cleanupWatchers
  }
}

/**
 * 用於在 Vue 元件中監聽設備變更，會在 `mounted` 時註冊並立即觸發一次回調
 *
 * @param {() => void} callback - 要執行的變更回調
 */
export function onDeviceChange(callback) {
  let stop = null
  if (typeof window === 'undefined') return

  onMounted(async () => {
    // 確保 state 更新後再執行第一次 callback
    await Promise.resolve()
    callback()
    stop = watchDeviceChange(callback)
  })

  onUnmounted(() => {
    if (typeof stop === 'function') stop()
  })

  // 回傳給外部手動取消監聽
  return () => {
    if (typeof stop === 'function') stop()
  }
}
