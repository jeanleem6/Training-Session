import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const mode = ref<'light' | 'dark'>()
    const followSystem = ref(true) // Default to true for better UX
    const brandColor = ref('')

    const setMode = (newMode: 'light' | 'dark') => {
      mode.value = newMode
    }

    const setFollowSystem = (follow: boolean) => {
      followSystem.value = follow
    }

    const setBrandColor = (color: string) => {
      brandColor.value = color
    }

    return {
      mode,
      followSystem,
      brandColor,
      setMode,
      setFollowSystem,
      setBrandColor
    }
  },
  {
    persist: {
      key: 'app-theme',
      pick: ['mode', 'followSystem', 'brandColor']
    }
  }
)
