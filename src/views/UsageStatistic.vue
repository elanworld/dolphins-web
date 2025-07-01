<template>
    <div class="p-4">
        <el-card>
            <h2>应用使用统计</h2>

            <div class="search-bar">
                <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" class="mb-4" />
                <el-select class="el-select-type" v-model="searchType" filterable allow-create placeholder="请输入或选择">
                    <el-option v-for="t in allTypes" :key="t" :label="t" :value="t" />
                </el-select>
                <el-button type="primary" @click="fetchData">刷新数据</el-button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <el-card>
                    <h3 class="text-lg font-semibold mb-2">使用时长排行（前5）</h3>
                    <AppUsageChart :data="chartData" />
                </el-card>

                <el-card>
                    <h3 class="text-lg font-semibold mb-2">类型占比</h3>
                    <AppDevicePieChart :data="typeData" />
                </el-card>

                <el-card>
                    <h3 class="text-lg font-semibold mb-2">设备占比</h3>
                    <AppDevicePieChart :data="deviceData" />
                </el-card>
            </div>


            <el-table :data="usageTable" class="my-4" style="width: 100%">
                <el-table-column prop="appName" label="程序名" />
                <el-table-column prop="packagename" label="包名" />
                <el-table-column prop="duration" label="使用时长（秒）" />
                <el-table-column prop="device" label="设备" />
                <el-table-column prop="date" label="时间" :formatter="formatUnixDate" />

                <el-table-column label="类型">
                    <template #default="{ row }">
                        <el-select v-model="row.type" filterable allow-create placeholder="请输入或选择"
                            @change="() => {
                                row.modified = true
                                submitChanges()
                            }">
                            <el-option v-for="t in allTypes" :key="t" :label="t" :value="t" />
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AppUsageChart from '@/components/AppUsageChart.vue';
import AppDevicePieChart from '@/components/AppDevicePieChart.vue'
import Api from '../service/Api.vue'
import { service } from '@/service/Service';

const today = new Date()
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate() - 6)

const dateRange = ref([sevenDaysAgo, today])

const usageTable = ref([])

const chartData = ref([])

const deviceData = ref([])
const typeData = ref([])

const records = ref([])
const allTypes = ref([])
const searchType = ref()


onMounted(() => {
    const [startDate, endDate] = dateRange.value || []
    fetchAppUsageStats({ startDate, endDate })
    fetchTypes()
})

// 2. 获取所有可选 type
const fetchTypes = async () => {
    const res = await service.get('/app-record/types')
    allTypes.value = res.data || []
}

// 3. 提交修改
const submitChanges = async () => {
    const toUpdate = usageTable.value.filter(r => r.modified)
    if (toUpdate.length === 0) {
        ElMessage.warning('没有需要保存的修改')
        return
    }

    await service.post('/app-record/update-types', toUpdate)
    toUpdate.forEach(value => value.modified = undefined)
    ElMessage.success('保存成功')
}

function formatUnixDate(row) {
    const timestamp = row.date
    const date = new Date(timestamp * 1000) // 时间戳单位是秒，要乘1000
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
function fetchAppUsageStats({ startDate, endDate }) {
    return service.get(Api.appRecord, {
        params: { minTime: formatDate(startDate), maxTime: formatDate(endDate), type: searchType.value }
    }).then(res => res.data?.data)
}

async function fetchData() {
    try {
        const [startDate, endDate] = dateRange.value || []
        const res = await fetchAppUsageStats({ startDate, endDate })
        usageTable.value = res

        // chartData: 每个 app_name 的总 duration
        chartData.value = res
            .reduce((map, item) => {
                const existing = map.find(i => i.appName === item.appName)
                if (existing) {
                    existing.duration += (item.duration / 60)
                } else {
                    map.push({ appName: item.appName, duration: (item.duration / 60) })
                }
                return map
            }, [])
            .sort((a, b) => b.duration - a.duration) // 排序：使用时间从大到小
            .slice(0, 5) // 只保留前 5 项

        // deviceData: 每个 device 出现次数（用于饼图）
        deviceData.value = res.reduce((map, item) => {
            const existing = map.find(i => i.tag === item.device)
            if (existing) {
                existing.count += 1
            } else {
                map.push({ tag: item.device, count: 1 })
            }
            return map
        }, [])
        // typeData: 每个 type 出现次数（用于饼图）
        typeData.value = res.reduce((map, item) => {
            const existing = map.find(i => i.tag === item.type)
            if (existing) {
                existing.count += item.duration
            } else {
                map.push({ tag: item.type, count: item.duration })
            }
            return map
        }, [])
    } catch (e) {
        ElMessage.error('加载失败' + e)
    }
}
onMounted(() => fetchData())
</script>

<style scoped>
h2,
h3 {
    margin-bottom: 12px;
}

.search-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    overflow-x: auto;
    padding-bottom: 8px;
}


.search-bar .el-button {
    flex-shrink: 0;
}

.el-select-type {
    width: 20%;
}
</style>