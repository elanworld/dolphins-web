<template>
    <div ref="chartRef" style="height: 300px;"></div>
  </template>
  
  <script setup>
  import { onMounted, watch, ref, onBeforeUnmount } from "vue";
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
          data: props.data.map(i => ({ name: i.tag, value: i.value }))
        }
      ]
    })
  }

  watch(() => props.data, renderChart)
  onMounted(renderChart)
  </script>
  