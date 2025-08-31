// 根據 UA 判斷「設備類型」（'ios' | 'android' | 'pc'）
import { isRef, ref } from 'vue'

export function useDeviceType(sharedRef) {
  const deviceType = isRef(sharedRef) ? sharedRef : ref('pc')

  const getDeviceType = () => {
    if (typeof navigator === 'undefined') return 'pc'
    const ua = navigator.userAgent
    if (/android/i.test(ua)) return 'android'
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
    return 'pc'
  }

  return {
    deviceType,
    getDeviceType
  }
}
