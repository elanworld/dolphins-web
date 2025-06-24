<template>
  <div class="layoutWrapper">
    <!-- 顶部 Header -->
    <div class="layoutHeader">
      <div class="header-title">📊 应用使用统计系统</div>
      <div class="header-user">欢迎你！</div>
    </div>

    <div class="layoutMain">
      <!-- 左侧菜单栏 -->
      <div class="containerLayout">
        <div v-show="!isCollapse" class="systemTitle">🛠️ 菜单栏</div>

        <div class="collapse-toggle-wrapper">
          <el-button @click="isCollapse = !isCollapse" class="collapse-toggle">
            {{ isCollapse ? '+' : '折叠菜单' }}
          </el-button>
        </div>


        <el-menu default-active="" class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen"
          @close="handleClose" :router="true" background-color="#1f2d3d" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="/">
            <el-icon>
              <Files />
            </el-icon>
            <template #title>文件管理</template>
          </el-menu-item>
          <el-menu-item index="/history">
            <el-icon>
              <Document />
            </el-icon>
            <template #title>chrom历史</template>
          </el-menu-item>
          <el-menu-item index="/show">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <template #title>数据展示</template>
          </el-menu-item>
          <el-menu-item index="/statistic">
            <el-icon>
              <DataBoard />
            </el-icon>
            <template #title>使用统计</template>
          </el-menu-item>
          <el-menu-item index="/login">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>设置</template>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 页面内容 -->
      <div class="contentPage">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document, Setting, DataAnalysis, HomeFilled, Files, DataBoard
} from '@element-plus/icons-vue'
import Background from './Background.vue';

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.layoutWrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部 header 样式 */
.layoutHeader {
  height: 60px;
  background-color: #2c3e50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10PX 24px;
  font-size: 18px;
  font-weight: bold;
}

/* 主体区域：菜单 + 页面内容 */
.layoutMain {
  display: flex;
  flex: 1;
}

/* 左侧菜单栏 */
.containerLayout {
  background-color: #1f2d3d;
  padding: 10px;
  color: #fff;
}

.systemTitle {
  margin-bottom: 20px;
  color: #ffd04b;
  text-align: center;
}


/* 设置更小的折叠菜单宽度，例如 40px */
.el-menu--collapse {
  width: 20px !important;
  min-width: 20px !important;
}


.collapse-toggle-wrapper {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  margin: 10px 0;
}

.collapse-toggle {
  font-size: 14px;
  color: #fff;
}

.el-menu-item {
  padding: 0;
  position: relative;
}

/* 内容页区域 */
.contentPage {
  flex: 1;
  padding: 24px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>