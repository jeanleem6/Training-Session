/**
 * 在 Setup Store（第二個參數是(函數)） 中：
 * - ref() 就是 state 屬性
 * - computed() 就是 getters
 * - function() 就是 actions
 *
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Device Store
 *
 * 管理當前裝置資訊，包含：
 * - deviceType: 裝置類型 ('ios' | 'android' | 'pc')
 * - layoutMode: 畫面佈局模式 ('mobile' | 'tablet' | 'desktop')
 * - isTouchDevice: 是否支持觸控操作 (boolean)
 * - orientation: 畫面方向 ('portrait' | 'landscape')
 *
 * 同時提供輔助方法：
 * - isMobile(): 判斷當前是否為手機佈局
 * - updateOrientation(): 根據螢幕寬高更新方向
 */
export const useDeviceStore = defineStore('device', () => {
  const deviceType = ref('pc') // 'ios' | 'android' | 'pc'
  const layoutMode = ref('desktop') // 'mobile' | 'tablet' | 'desktop'
  const isTouchDevice = ref(false)
  const orientation = ref('portrait') // 'portrait' | 'landscape'

  const isPC = computed(() => deviceType.value === 'pc')
  const isMobile = computed(() => layoutMode.value === 'mobile')
  const isTablet = computed(() => layoutMode.value === 'tablet')
  const isDesktop = computed(() => layoutMode.value === 'desktop')

  return {
    deviceType,
    layoutMode,
    isTouchDevice,
    orientation,
    isPC,
    isMobile,
    isTablet,
    isDesktop
  }
})
