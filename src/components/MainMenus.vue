<template>
  <el-menu :default-active="activeIndex" mode="horizontal" class="el-menu-vertical-demo" @select="handleSelect">
    <el-menu-item v-for="route in routes" :index="route.path" :route="{ path: route.path }">
      <el-icon>
        <HomeFilled v-if="route.name === 'HomePage'" />
        <Grid v-if="route.name === 'ListPage'" />
        <EditPen v-if="route.name === 'TestPage'" />
      </el-icon>
      {{ route.name }}
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router/index'
import routes from '@/router/routes'

// 设置默认激活tab
const pathName = location.pathname.match(/^\/([^\/]*?)$/)
const currentPath = pathName?.[0] ?? '/'
const activeIndex = ref(currentPath)

// open menu
const handleSelect = (key: string, keyPath: string[]) => {
  router.push(keyPath[0])
}
</script>
