<template>
  <div class="p-4">
    <el-card>
      <h2>应用使用统计</h2>

      <div class="search-bar">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="mb-4"
        />
        <el-select
          class="el-select-type"
          v-model="searchType"
          filterable
          allow-create
          placeholder="请输入或选择"
        >
          <el-option v-for="t in allTypes" :key="t" :label="t" :value="t" />
        </el-select>
        <el-button type="primary" @click="fetchData">刷新数据</el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-card>
          <h3 class="text-lg font-semibold mb-2">每小时使用率</h3>
          <CategoryChart :data="chartTimeData" />
        </el-card>
        <el-card>
          <h3 class="text-lg font-semibold mb-2">使用时长排行（前5）</h3>
          <CategoryChart :data="chartTopData" />
        </el-card>

        <el-card>
          <h3 class="text-lg font-semibold mb-2">类型占比</h3>
          <PieChart :data="typeData" />
        </el-card>

        <el-card>
          <h3 class="text-lg font-semibold mb-2">设备占比</h3>
          <PieChart :data="deviceData" />
        </el-card>
      </div>

      <el-table :data="usageTable" class="my-4" style="width: 100%">
        <el-table-column prop="date" label="时间" :formatter="formatUnixDate" />
        <el-table-column prop="device" label="设备" />
        <el-table-column prop="packagename" label="包名" />
        <el-table-column prop="appName" label="程序名" />
        <el-table-column prop="actionDuration" label="使用时长（秒）" />

        <el-table-column label="类型">
          <template #default="{ row }">
            <LongPressSelect
              v-model="row.type"
              :options="allTypes"
              @click="(e) => gussType(row, e)"
              @change="
                () => {
                  row.modified = true;
                  submitChanges();
                }
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import CategoryChart from '@/components/CategoryChart.vue';
import PieChart from '@/components/PieChart.vue'
import Api from '../service/Api.vue'
import { service } from '@/service/Service';
import LongPressSelect from '@/components/LongPressSelect.vue'

const today = new Date()
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(today.getDate() - 7)

const dateRange = ref([sevenDaysAgo, today])

const usageTable = ref([])

const chartTopData = ref([])
const chartTimeData = ref([])

const deviceData = ref([])
const typeData = ref([])

const allTypes = ref([])
const searchType = ref()
const lastInterval = ref()



// 2. 获取所有可选 type
const fetchTypes = async () => {
    const res = await service.get('/app-record/types')
    allTypes.value = res.data?.data || []
}
const gussType = async (row, ele) => {
    const res = await service.post('/appRecordExt/getGussTypes',row )
    let value = Object.entries(res.data?.data)
      .sort((a, b) => b[1] -a[1]).map(item => item[0]) || [];
    allTypes.value.forEach(v => {
      let found = false;
      value.forEach(v1 => {
        if (v === v1) {
          found = true
        }
      })
      if (!found) {
        value.push(v)
      }
    })
    allTypes.value = value
    ElMessage.success("类型猜测完成")
}

// 3. 提交修改
const submitChanges = async () => {
    const toUpdate = usageTable.value.filter(r => r.modified)
    if (toUpdate.length === 0) {
        ElMessage.warning('没有需要保存的修改')
        return
    }

    await service.post('/app-record/update-types', toUpdate)
    toUpdate.forEach(value => {
        value.modified = undefined
        let found = false;
        allTypes.value.forEach(v => {
            if (v === value.type) {
                found = true
            }
        })
        if (!found) {
            allTypes.value.push(value.type)
        }
    })
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
async function addDataGradually(res) {
  if (lastInterval.value) {
    clearInterval(lastInterval.value)
  }
  usageTable.value = []
  let a= [  ]
  a.splice()
  let index = 0;
  // 每  秒添加一个新的数据项
  const interval = setInterval(() => {
    if (index < res.length - 0) {
      usageTable.value.push(...res.splice(index, index + 1));
      index+=1;
    } else {
      usageTable.value.push(...res.splice(index, res.length - 1));
      clearInterval(interval); // 停止定时器
      clearInterval(lastInterval.value)
    }
  }, 10);  // 每秒添加一条数据
  lastInterval.value = interval
}


async function fetchData() {
    try {
        const [startDate, endDate] = dateRange.value || []
        const res = await fetchAppUsageStats({ startDate, endDate })

        addDataGradually(res);

        // chartTimeData: 每个 app_name 的总 actionDuration
        chartTopData.value = res
            .reduce((map, item) => {
                if (!item.appName) {
                  return map
                }
                const existing = map.find(i => i.tag == item.appName)
                if (existing) {
                    existing.value += item.actionDuration
                } else {
                    map.push({ tag: item.appName, value: item.actionDuration })
                }
                return map
            }, [])
            .sort((a, b) => b.value - a.value) // 排序：使用时间从大到小
            .map(item => {return {tag: item.tag, value: (item.value / 60).toFixed(0)}})
            .slice(0, 5) // 只保留前 5 项

      // 处理数据，按小时聚合每个应用的使用时长
      chartTimeData.value = res
        .map(item => {
          // 返回新的对象，包含时间和应用的时长
          return {
            tag: new Date(item.date * 1000), // new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours(), 0, 0, 0),
            appName: item.appName,
            actionDuration: item.actionDuration, // 转换为分钟
          };
        })
        .reduce((acc, item) => {
          if (!item.appName) {
            return acc;
          }

          const startTime = new Date(item.tag);  // 起始时间
          let remainingDuration = item.actionDuration; // 剩余时长（秒）
          let currentTime = new Date(startTime); // 当前时间（从起始时间开始）


          while (remainingDuration > 0) {
            // 获取当前小时的结束时间
            const nextHour = new Date(currentTime);
            nextHour.setHours(currentTime.getHours() + 1, 0, 0, 0); // 设置为下一个小时的起始时间

            // 当前小时的时长
            const hourDuration = (nextHour - currentTime) / 1000; // 当前小时的时长（秒）

            if (remainingDuration <= hourDuration) {
              // 调整为整点时间
              currentTime.setMinutes(0, 0, 0);  // 将时间调整到整点（小时）
              // 如果剩余时长小于当前小时的时长，则直接加到当前小时
              const existing = acc.find(i => i.tag.valueOf() === currentTime.valueOf());
              if (existing) {
                existing.value += remainingDuration;
              } else {
                acc.push({ tag: currentTime, value: remainingDuration });
              }
              remainingDuration = 0;
            } else {
              // 调整为整点时间
              currentTime.setMinutes(0, 0, 0);  // 将时间调整到整点（小时）
              // 否则，填满当前小时，并将剩余时长传递到下一个小时
              const existing = acc.find(i => i.tag.valueOf() === currentTime.valueOf());
              if (existing) {
                existing.value += hourDuration;
              } else {
                acc.push({ tag: currentTime, value: hourDuration });
              }
              remainingDuration -= hourDuration;  // 减去当前小时的时长
              currentTime = new Date(nextHour);  // 跳到下一个整点时间
            }
          }
          return acc;
        }, [])
        .map((item => {
          return {
            tag: item.tag, value: (item.value / 60).toFixed(0) // 分
          }}))
        .sort((a, b) => {
          // 按时间排序
          return a.tag.valueOf() - b.tag.valueOf();
        });

        // deviceData: 每个 device 出现次数（用于饼图）
        deviceData.value = res.reduce((map, item) => {
            if (!item.appName) {
              return map;
            }
            const existing = map.find(i => i.tag === item.device)
            if (existing) {
                existing.value += 1
            } else {
                map.push({ tag: item.device, value: 1 })
            }
            return map
        }, [])
          .map(item => {return {tag: item.tag, value: item.value}})
        // typeData: 每个 type 出现次数（用于饼图）
        typeData.value = res.reduce((map, item) => {
            if (!item.appName) {
              return map;
            }
            const existing = map.find(i => i.tag === item.type)
            if (existing) {
                existing.value += item.actionDuration
            } else {
                map.push({ tag: item.type, value: item.actionDuration })
            }
            return map
        }, [])
          .map(item => {return {tag: item.tag, value: (item.value / 60).toFixed(0)}})
    } catch (e) {
        ElMessage.error('加载失败: ' + e)
    }
}
onMounted(() => {
    fetchTypes()
    fetchData()
})
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