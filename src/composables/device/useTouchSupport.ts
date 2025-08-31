// 是否支援「觸控」（根據瀏覽器觸控能力）
import { isRef, ref } from 'vue'

export function useTouchSupport(sharedRef) {
  const isTouchDevice = isRef(sharedRef) ? sharedRef : ref(false)

  const detectTouch = () => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  return {
    isTouchDevice,
    detectTouch
  }
}
