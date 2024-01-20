<template>
  <div class="page__home">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content ep-bg-purple">
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="Please input" />
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple">
          <el-form-item label="Region">
            <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="重庆" value="chongqing" />
              <el-option label="成都" value="chengdu" />
            </el-select>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple"></div>
      </el-col>

      <el-col :span="3">
        <div class="grid-content ep-bg-purple"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content ep-bg-purple"></div>
      </el-col>
    </el-row>

    <el-carousel v-if="isShow">
      <el-carousel-item v-for="item in list" :key="item">
        <el-image :src="item.Image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomePage'
}
</script>

<script lang="ts" setup>
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { getImages } from '@/http/index'

const isShow = ref(false)
const list = ref()

const form = reactive({
  name: '',
  region: ''
})

onMounted(async () => {
  list.value = (await getImages()).data
  isShow.value = true
})

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>

<style lang="scss">
$ep-bg-purple: #d3dce6;

.page__home {
  padding: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  box-sizing: border-box;
  min-height: 42px;
  padding: 5px 15px;
  border-radius: 4px;

  .el-form-item {
    margin-bottom: 0;
  }
}
.ep-bg-purple {
  background-color: $ep-bg-purple;
}
</style>
