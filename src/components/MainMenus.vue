<template>
  <el-menu :default-active="route.path" mode="horizontal" class="el-menu-vertical-demo" @select="handleSelect">
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
import { useRoute } from 'vue-router'
import router from '@/router/index'
import routes from '@/router/routes'

const route = useRoute()

// open menu
const handleSelect = (key: string, keyPath: string[]) => {
  router.push(keyPath[0])
}
</script>
