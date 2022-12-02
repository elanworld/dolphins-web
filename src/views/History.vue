<script setup lang="ts">

import {reactive} from "vue";
import service from "../service/service.vue";
import Pagination from "@/views/Pagination.vue"

const data = reactive({list: [], pageSize: undefined, total: undefined, current: undefined, title: undefined})
const changePage = (n: number) => {
  service.get("http://localhost:8080/launcher-box/chromeHistory", {
    params: {
      current: n,
      title: data.title === '' ? undefined : data.title
    }
  }).then(res => {
    data.list = res.data.data.records
    data.pageSize = res.data.data.size
    data.current = res.data.data.current
    data.total = res.data.data.total
  })
}
changePage(1)

</script>

<template>
  <el-input v-model="data.title" placeholder="tile"></el-input>
  <el-table ref="multipleTable" :data="data.list" :stripe=true :border=true style="width: 100%">
    <el-table-column prop="title" label="title"></el-table-column>
    <el-table-column prop="webUrl" label="webUrl"></el-table-column>
  </el-table>
  <Pagination @change-page='e => changePage(e)' :pagesize='data.pageSize' :total='data.total' :page='data.current'/>
</template>

<style>

</style>