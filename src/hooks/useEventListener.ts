import { onMounted, onUnmounted } from 'vue'

// 更新后的 useEventListener 函数，接受泛型参数 T
// 使得 T 必须是 Event 或其子类
export default function useEventListener<T extends Event>(
  target: Window | HTMLElement,  // 目标是 `Window` 或 `HTMLElement`
  event: string,                 // 事件类型（如 'mousemove', 'resize' 等）
  callback: (event: T) => void   // 泛型回调，接收 T 类型的事件
) {
  // 将 callback 转换为 EventListener 类型，这样它就能与 addEventListener 兼容
  const eventListener: EventListener = (event) => callback(event as T)

  onMounted(() => {
    if (target && typeof target.addEventListener === 'function') {
      target.addEventListener(event, eventListener);
    }
  });

  onUnmounted(() => {
    if (target && typeof target.removeEventListener === 'function') {
      target.removeEventListener(event, eventListener);
    }
  });
}
