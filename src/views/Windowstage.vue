<template>
    <div class="monitor-container">
        <el-card>
            <h2>监控列表</h2>
            <el-button type="primary" @click="fetchData" :loading="loading">刷新数据</el-button>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="category" label="分类" width="120" />
                <el-table-column prop="taskName" label="名称" width="150" />
                <el-table-column prop="result[0].tip" label="提示" />
                <el-table-column label="时间" width="100">
                    <template #default="{ row }">
                        <span :style="{ color: row.result[0].color }">
                            {{ row.result[0].time }}{{ row.result[0].unit }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { service } from "@/service/Service";
import api from "@/service/Api.vue";

interface TableItem {
    id: number;
    name: string;
    time: string;
    result?: any; // 颜色数据
}

const tableData = ref<TableItem[]>([]);
const loading = ref(false);

// 获取主列表数据
const fetchData = async () => {
    loading.value = true;
    try {

        service.post(api.scheduleTask, { category: "show" })
            .then(async (value) => {
                if (!value?.data) return;

                const enhancedData = await Promise.all(
                    value.data?.data.map(async (item: TableItem) => {
                        // 这里可以调用二次接口，比如获取颜色
                        const colorRes = await service.get(api.schedule, { params: { id: item.id, run: false } })
                        return { ...item, result: colorRes.data };
                    })
                );
                tableData.value = enhancedData
            })
            .catch((error) => {
                console.error("请求失败:", error);
            })
    } catch (error) {
        console.error("数据加载失败:", error);
        ElMessage.error("数据加载失败");
    } finally {
        loading.value = false;
    }
};

// 颜色映射到 Element UI 标签
const getTagType = (color: string) => {
    switch (color) {
        case "red":
            return "danger";
        case "yellow":
            return "warning";
        case "green":
            return "success";
        default:
            return "";
    }
};

// 组件挂载时自动加载数据
onMounted(fetchData);

</script>

<style scoped>
.monitor-container {
    width: 80%;
    margin: auto;
}
</style>