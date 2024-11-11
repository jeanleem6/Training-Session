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
</script>
