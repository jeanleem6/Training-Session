import { ref } from "vue"
import { defineStore } from "pinia"

export const useLoaderState = defineStore("isLoading", () => {

  const state = ref(false)

  const changeStateTrue = () => {
    state.value = true
  }

  const changeStateFalse = () => {
    state.value = false
  }

  return { state, changeStateTrue, changeStateFalse }
})
