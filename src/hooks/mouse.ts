import { ref } from 'vue'
import useEventListener from './useEventListener'

export default function useMouse() {
  const x = ref(0)
  const y = ref(0)

  // `update` 函数处理 `MouseEvent`
  function update(e: MouseEvent): void {
    x.value = e.pageX
    y.value = e.pageY
  }

  // 使用泛型来确保类型安全，`MouseEvent` 作为类型参数传递给 `useEventListener`
  useEventListener<MouseEvent>(window, 'mousemove', update)

  return { x, y }
}
