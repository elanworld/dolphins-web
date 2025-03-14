<template>
  <div class="layout">
    <div class="container">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">展开</el-radio-button>
        <el-radio-button :value="true">折叠</el-radio-button>
      </el-radio-group>
      <!-- 菜单 -->
      <el-menu default-active="" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
        @close="handleClose" :router="true">
        <el-menu-item index="/">
          <el-icon>
            <location />
          </el-icon>
          <template #title>home</template>
        </el-menu-item>
        <el-menu-item index="/history">
          <el-icon><icon-menu /></el-icon>
          <template #title>chrom历史</template>
        </el-menu-item>
        <el-menu-item>
          <el-icon>
            <setting />
          </el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 页面内容 -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.layout {
  display: flex;
}

.container {
  justify-content: flex-start;
  /* 左对齐 */
  align-items: center;
  /* 垂直居中 */
}

.el-menu {
  width: 200px;
  min-height: 100vh;
  border-right: 1px solid #e6e6e6;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>