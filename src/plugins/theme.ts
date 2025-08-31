import { ref, watch, computed } from 'vue'
import type { App, Ref, ComputedRef } from 'vue'

export type ThemeMode = 'light' | 'dark'
const DEFAULT_BRAND = '#ff8a00'

// ================================
// 從 Element Plus 獲取默認主題色
// ================================
function getDefaultBrandColor(): string {
  // 嘗試從 CSS 變量獲取，如果不存在則使用默認值
  const root = document.documentElement
  const cssPrimary = getComputedStyle(root).getPropertyValue('--el-color-primary').trim()

  return cssPrimary || DEFAULT_BRAND
}

// ================================
// 從當前加載的主題中獲取 primary 顏色
// ================================
function getCurrentThemePrimary() {
  const root = document.documentElement
  const primaryColor = getComputedStyle(root).getPropertyValue('--el-color-primary').trim()
  const store = JSON.parse(localStorage.getItem('app-theme') || '{}')

  return store?.brandColor || primaryColor || DEFAULT_BRAND
}

// ================================
// Theme 接口
// ================================
export interface Theme {
  themeMode: Ref<ThemeMode>
  followSystem: Ref<boolean>
  brandColor: Ref<string>
  currentPrimary: ComputedRef<string>
  setThemeMode: (mode: ThemeMode) => void
  setFollowSystem: (follow: boolean) => void
  setBrandColor: (color: string) => void
  isDarkThemeLoaded: Ref<boolean>
  resetToThemeDefault: () => void
}

// ================================
// 全局响应式状态
// ================================
const themeMode = ref<ThemeMode>('light')
const brandColor = ref<string>('')
const followSystem = ref<boolean>(true)
const isDarkThemeLoaded = ref<boolean>(false)

// 計算當前主題的 primary 顏色
const currentPrimary = computed(() => {
  return brandColor.value || getCurrentThemePrimary()
})

// ================================
// Element Plus 暗色主題加載
// ================================
async function loadElementDarkTheme(): Promise<void> {
  if (!isDarkThemeLoaded.value) {
    try {
      await import('@/styles/element/dark.scss')
      isDarkThemeLoaded.value = true

      // 暗色主題加載後，更新品牌色
      if (!brandColor.value) {
        brandColor.value = getCurrentThemePrimary()
      }
    } catch (error) {
      console.warn('Failed to load Element Plus dark theme:', error)
    }
  }
}

function unloadElementDarkTheme(): void {
  // 移除暗色主題樣式（如果已加載）
  if (isDarkThemeLoaded.value) {
    const darkStyles = document.querySelectorAll('style[data-theme="dark"], link[data-theme="dark"]')
    darkStyles.forEach((style) => style.remove())
    isDarkThemeLoaded.value = false
  }
}

// ================================
// 颜色工具
// ================================
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '')
  if (hex.length === 3)
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  const bigint = parseInt(hex, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function tintColor(color: string, tint: number): string {
  const [r, g, b] = hexToRgb(color)
  return rgbToHex(Math.round(r + (255 - r) * tint), Math.round(g + (255 - g) * tint), Math.round(b + (255 - b) * tint))
}

function shadeColor(color: string, shade: number): string {
  const [r, g, b] = hexToRgb(color)
  return rgbToHex(Math.round(r * (1 - shade)), Math.round(g * (1 - shade)), Math.round(b * (1 - shade)))
}

// ================================
// 延遲加載 themeStore - 正確的方式
// ================================
let themeStore: any = null

async function getThemeStore(): Promise<any> {
  if (!themeStore && typeof window !== 'undefined') {
    try {
      // 通過 app 實例獲取 Pinia
      const app = (window as any).__vue_app__

      if (app && app.config.globalProperties.$pinia) {
        const { useThemeStore } = await import('@/store')
        themeStore = useThemeStore(app.config.globalProperties.$pinia)
      }
    } catch (error) {
      console.warn('Failed to load theme store from app instance:', error)
    }
  }
  return themeStore
}

// ================================
// 持久化到 themeStore 或 localStorage
// ================================
async function saveTheme() {
  try {
    const store = await getThemeStore()
    if (store) {
      // 存儲到 themeStore
      store.setMode(themeMode.value)
      store.setFollowSystem(followSystem.value)
      store.setBrandColor(brandColor.value)
      return
    }
  } catch (error) {
    console.warn('Failed to save to theme store, falling back to localStorage:', error)
  }

  // 備用方案：直接存到 localStorage
  localStorage.setItem(
    'app-theme',
    JSON.stringify({
      mode: themeMode.value,
      brand: brandColor.value,
      followSystem: followSystem.value
    })
  )
}

async function loadTheme() {
  try {
    const store = await getThemeStore()

    if (store) {
      if (store.mode) themeMode.value = store.mode
      if (store.brandColor) brandColor.value = store.brandColor
      if (store.followSystem !== undefined) followSystem.value = store.followSystem
      return
    }
  } catch (error) {
    console.warn('Failed to load from theme store, falling back to localStorage:', error)
  }

  // 備用方案：從 localStorage 加載
  try {
    const saved = localStorage.getItem('app-theme')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.mode) themeMode.value = parsed.mode
      if (parsed.brand) brandColor.value = parsed.brand
      if (parsed.followSystem !== undefined) followSystem.value = parsed.followSystem
    }
  } catch (e) {
    console.warn('Theme load from localStorage failed', e)
  }
}

// ================================
// 主题应用
// ================================
function applyBrandColor(color: string) {
  brandColor.value = color
  const root = document.documentElement
  root.style.setProperty('--el-color-primary', color)

  // 生成顏色變量
  for (let i = 1; i <= 9; i++) {
    root.style.setProperty(`--el-color-primary-light-${i}`, tintColor(color, i / 10))
  }
  root.style.setProperty('--el-color-primary-dark-2', shadeColor(color, 0.2))

  saveTheme()
}

function resetToThemeDefault() {
  const defaultColor = getCurrentThemePrimary()
  applyBrandColor(defaultColor)
}

async function applyThemeMode(mode: ThemeMode) {
  themeMode.value = mode
  const root = document.documentElement

  if (mode === 'dark') {
    root.classList.add('dark')
    await loadElementDarkTheme()
  } else {
    root.classList.remove('dark')
    unloadElementDarkTheme()
  }

  // 如果沒有自定義品牌色，使用當前主題的默認色
  if (!brandColor.value) {
    const primaryColor = getCurrentThemePrimary()
    if (primaryColor && primaryColor !== DEFAULT_BRAND) {
      brandColor.value = primaryColor
      applyBrandColor(primaryColor)
    }
  }

  saveTheme()
}

// ================================
// 系统深色模式监听
// ================================
function setupSystemListener() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  const listener = (e: MediaQueryListEvent) => {
    if (followSystem.value) {
      applyThemeMode(e.matches ? 'dark' : 'light')
    }
  }

  // 使用現代的事件監聽方式
  if (media.addEventListener) {
    media.addEventListener('change', listener)
  } else {
    // 兼容舊版瀏覽器
    media.addListener(listener)
  }

  // 初始化
  if (followSystem.value) {
    applyThemeMode(media.matches ? 'dark' : 'light')
  }

  // 返回清理函數
  return () => {
    if (media.removeEventListener) {
      media.removeEventListener('change', listener)
    } else {
      media.removeListener(listener)
    }
  }
}

// ================================
// 插件安装
// ================================
export default {
  install(app: App) {
    // 只在客戶端執行
    if (typeof window === 'undefined') return

    // 加載保存的主題設置
    loadTheme()

    // 如果沒有保存的品牌色，使用當前主題的默認色
    if (!brandColor.value) {
      brandColor.value = getCurrentThemePrimary()
    }

    // 應用品牌色和主題模式
    applyBrandColor(brandColor.value)

    // 設置系統監聽器並保存清理函數
    let cleanupSystemListener: (() => void) | null = null

    // 監聽 followSystem 變化
    watch(
      followSystem,
      (newValue) => {
        // 清理舊的監聽器
        if (cleanupSystemListener) {
          cleanupSystemListener()
          cleanupSystemListener = null
        }

        // 如果需要跟隨系統，設置新的監聽器
        if (newValue) {
          cleanupSystemListener = setupSystemListener()
        }

        saveTheme()
      },
      { immediate: true }
    )

    // 監聽主題模式變化
    watch(themeMode, async (newMode) => {
      if (newMode === 'dark') {
        await loadElementDarkTheme()
      } else {
        unloadElementDarkTheme()
      }

      // 主題切換時，如果沒有自定義品牌色，更新為當前主題的默認色
      if (!brandColor.value) {
        const primaryColor = getCurrentThemePrimary()
        if (primaryColor) {
          brandColor.value = primaryColor
          applyBrandColor(primaryColor)
        }
      }

      saveTheme()
    })

    const setThemeMode = (mode: ThemeMode) => applyThemeMode(mode)
    const setFollowSystem = (follow: boolean) => {
      followSystem.value = follow
      saveTheme()
    }
    const setBrandColor = (color: string) => applyBrandColor(color)

    const theme: Theme = {
      themeMode,
      followSystem,
      brandColor,
      currentPrimary,
      setThemeMode,
      setFollowSystem,
      setBrandColor,
      isDarkThemeLoaded,
      resetToThemeDefault
    }

    // 提供給全局使用
    app.config.globalProperties.$theme = theme
    app.provide('theme', theme)

    // 應用初始主題
    applyThemeMode(themeMode.value)
  }
}
