<template>
  <div ref="chartRef" style="height: 300px;"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ data: Array })
const chartRef = ref()

function renderChart() {
  const chart = echarts.init(chartRef.value)
  console.log(props.data)
  chart.setOption({
    xAxis: {
      type: 'category',
      dataZoom: [{ type: 'slider', start: 0, end: 50 }],
      data: props.data.map(i => i.appName),
      axisLabel: {
        rotate: 40,  // 旋转40度
        interval: 0, // 全部显示
        fontSize: 12,
        formatter: value => value.length > 6 ? value.slice(0, 6) + '…' : value // 超长截断
      }
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: props.data.map(i => i.duration),
        name: '使用时长',
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          color: '#333',
          formatter: (params) => {
            return typeof params.value === 'number'
              ? params.value.toFixed(0) + ' 分'
              : params.value
          }
        }
      }
    ]
  })
}

onMounted(renderChart)
watch(() => props.data, renderChart)
</script>