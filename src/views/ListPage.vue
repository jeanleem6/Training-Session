<template>
  <div class="page__jsplumb">
    <div ref="jsplumbContainer" id="jsplumbContainer" class="jsplumb__container"></div>
  </div>
</template>

<script>
export default {
  name: 'ListPage'
}
</script>
<script setup>
import { ref, onMounted } from 'vue'
import { ready, newInstance } from '@jsplumb/browser-ui'

onMounted(() => {
  const jsplumbContainer = document.querySelector('#jsplumbContainer')

  const instance = newInstance({
    container: jsplumbContainer
  })
})
</script>

<style lang="scss" scoped>
.jsplumb__container {
  position: relative;
  width: calc(100vw - 50px);
  height: calc(100vh - 110px);
  margin: 25px auto 0;
  border-radius: 12px;
  background-color: floralwhite;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>
