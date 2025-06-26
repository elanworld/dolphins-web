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
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: props.data.map(i => ({ name: i.tag, value: i.count }))
        }
      ]
    })
  }
  
  onMounted(renderChart)
  watch(() => props.data, renderChart)
  </script>
  