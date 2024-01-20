import { ref } from "vue"
import { defineStore } from "pinia"

export const currentThemeState = defineStore("currentTheme", () => {

  const h = (new Date()).getHours()
  const state = ref('')

  if (h > 5 && h < 18) {
    state.value = 'light'
  } else {
    state.value = 'dark'
  }

  return { state }
})
