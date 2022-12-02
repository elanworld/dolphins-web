<script setup lang="ts">

import {reactive} from "vue";

const upload = (e:Event) => {
  console.log(e)
  console.log(e.target.value);
}

const data = reactive([{id:33,"title":"kkk"}, {id:33,"title":"kkk"}])



</script>

<template>
  <el-table ref="multipleTable" :data="data" stripe="true" border="true" style="width: 100%" @selection-change="" v-loading="">
    <el-table-column prop="title" label="title" width="120"> </el-table-column>
    <el-table-column prop="webUrl" label="webUrl" width="120"> </el-table-column>
  </el-table>
</template>

<style>

</style>