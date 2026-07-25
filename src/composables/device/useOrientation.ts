//  監測螢幕方向變化（portrait / landscape）
import { isRef, ref } from 'vue'

export function useOrientation(sharedRef) {
  const orientation = isRef(sharedRef) ? sharedRef : ref('portrait')

  const getOrientation = () => {
    if (typeof window === 'undefined') return 'portrait'
    const angle = screen.orientation?.angle ?? window.orientation ?? 0
    return angle === 90 || angle === -90 ? 'landscape' : 'portrait'
  }

  return {
    orientation,
    getOrientation
  }
}
