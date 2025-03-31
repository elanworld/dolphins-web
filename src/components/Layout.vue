<template>
  <div class="layoutTop">
    <div class="containerLayout">
      <div class="systemTitle">工具集合</div>
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
          <el-icon><Document /></el-icon>
          <template #title>chrom历史</template>
        </el-menu-item>
        <el-menu-item index="/show">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据展示</template>
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
    <div class="contentPage">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Location,
  Setting,DataAnalysis
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

.layoutTop {
  display: flex;
}

.containerLayout {
  flex: 1;
  justify-content: flex-start;
  max-width: 10%;
  padding: 3%;
  margin: 1%;
  z-index: 999;
}

.contentPage {
  flex: 10;
  padding: 2%;
  max-width: 80%;
}
.el-menu-vertical-demo {
  background-color: #42b983;
}
.systemTitle {
  margin-bottom: 30%;
}
.systemTitle:hover {
  color: #42b983;
}
.el-menu {
  width: 200px;
  min-height: 100vh;
  border-right: 1px solid #e6e6e6;
}

</style>