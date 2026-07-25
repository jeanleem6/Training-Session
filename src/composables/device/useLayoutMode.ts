// 根據視窗寬度判斷「佈局模式」（'mobile' | 'tablet' | 'desktop'）
import { isRef, ref } from 'vue'

export function useLayoutMode(sharedRef) {
  const layoutMode = isRef(sharedRef) ? sharedRef : ref('desktop')

  const getLayoutMode = () => {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  return {
    layoutMode,
    getLayoutMode
  }
}
