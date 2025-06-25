<script setup lang="ts">

import { reactive, onMounted} from "vue";
import {service, setStorage, getStorage} from "@/service/Service";
import api from "@/service/Api.vue";
import {Search} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'


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
  service.post(api.historyPage, {
    likeTitle: data.title === '' ? undefined : data.title,
    minVisitTime: data.minDate ? (data.minDate.valueOf() / 1000 + 11644473600) * 1000000 : undefined,
    maxVisitTime: data.maxDate ? (data.maxDate.valueOf() / 1000 + 11644473600) * 1000000 : undefined
  }, {params: {page: n}}).then(res => {
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

onMounted(() => {
  const route = useRoute()
  if (route.query?.auth) {
    localStorage.setItem("Authorization",route.query?.auth.toString())
  }
  changePage(1)
})

</script>

<template>
  <div class="containerHis">
    <el-container>
      <el-header class="el-header">
        <el-input v-model="data.title" placeholder="标题" class="el-input-c" @keyup.enter="changePage(1)"></el-input>
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
      <el-main class="el-main">
        <el-table class="el-table" ref="multipleTable" :data="data.list" :stripe=true :border=true :scroll-x="true" style="width: 100%">
          <el-table-column prop="title" label="标题">
            <template #default="{ row }" >
              <a :href="row.webUrl" target="_blank"> {{ row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="visitTimeStr" label="日期"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="data.pageSize" :total="data.total" @current-change="(e:number) => changePage(e)"/>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.containerHis {
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-input-c {
  flex: 1;
  margin-right: 10px;
}

.el-sub-menu {
  margin-left: 10px;
}


.el-main {
  margin-top: 20px;
}

.el-table {
  width: 100%;
}

.el-table__header th {
  font-weight: bold;
}

.el-table__body td {
  text-align: center;
}
.el-table-column {
  
  white-space: nowrap;
}

.el-sub-menu {
  margin-left: 20px;
}

.el-pagination {
  margin-top: 20px;
}


</style>