<template>
  <Transition name="fade" mode="out-in">
    <div class="wrap">
      <div>Mouse position: x: {{ x }}, y: {{ y }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import useMouse from '@/hooks/mouse'

const { x, y } = useMouse()

/**
 * Closures relate to encapsulation because they allow you to hide variables
 */
function makeCounter() {
  let count = 0

  return function () {
    count++

    return count
  }
}

const counter = makeCounter()

console.log(counter())
console.log(counter())
</script>
