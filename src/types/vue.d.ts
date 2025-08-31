import type { Theme } from '@/plugins/theme'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $theme: Theme
  }
}
