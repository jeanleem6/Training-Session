import { ref, nextTick } from 'vue'

export function createReload() {
  const isAppActive = ref(true)

  const reload = () => {
    isAppActive.value = false
    nextTick(() => {
      isAppActive.value = true
    })
  }

  const showLoading = () => {
    isAppActive.value = false
  }

  const hideLoading = () => {
    isAppActive.value = true
  }

  return {
    isAppActive,
    reload,
    showLoading,
    hideLoading
  }
}

export function installAppReload(app) {
  const reload = createReload()

  app.provide('showLoading', reload.showLoading)
  app.provide('hideLoading', reload.hideLoading)
  app.provide('reload', reload.reload)

  app.provide('isAppActive', reload.isAppActive)
}
