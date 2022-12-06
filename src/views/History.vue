<script setup lang="ts">

import {reactive} from "vue";
import service from "@/service/Service.vue";
import api from "@/service/Api.vue";
import Pagination from "@/views/Pagination.vue"
import {Search} from '@element-plus/icons-vue'

interface Data {
  list: {
    visitTime: number
    visitTimeStr: string
  }[],
  pageSize?: number,
  total?: number,
  current?: number,
  title?: string,
  minDate?: Date,
  maxDate?: Date,
}

const data: Data = reactive({
  list: []
})

const changePage = (n: number) => {
  service
  service.post(api.historyPage, {
    likeTitle: data.title === '' ? undefined : data.title,
    minVisitTime: data.minDate ? (data.minDate.valueOf() / 1000 + 11644473600) * 1000000 : undefined,
    maxVisitTime: data.maxDate ? (data.maxDate.valueOf() / 1000 + 11644473600) * 1000000 : undefined
  }, {params: {current: n}}).then(res => {
    data.list = res.data.data.records
    data.pageSize = res.data.data.size
    data.current = res.data.data.current
    data.total = res.data.data.total
    data.list.forEach(value => {
      let date = new Date((value.visitTime / 1000000 - 11644473600) * 1000)
      value.visitTimeStr = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    })
  })
}
changePage(1)

</script>

<template>
  <div class="container">
    <el-container>
      <el-header>
        <el-input v-model="data.title" placeholder="标题" class="el-input-c"></el-input>
        <el-date-picker
            v-model="data.minDate"
            type="date"
            placeholder="最小日期"
        />
        <el-date-picker
            v-model="data.maxDate"
            type="date"
            placeholder="最大日期"
        />
        <el-button @click="() => changePage(1)" :icon="Search" class="el-sub-menu"/>
      </el-header>
      <el-main>
        <el-table ref="multipleTable" :data="data.list" :stripe=true :border=true style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="webUrl" label="地址"></el-table-column>
          <el-table-column prop="visitTimeStr" label="日期"></el-table-column>
        </el-table>
        <Pagination @change-page='e => changePage(e)' :pagesize='data.pageSize' :total='data.total'
                    :page='data.current'/>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.el-input-c {
  width: auto;
}

</style>