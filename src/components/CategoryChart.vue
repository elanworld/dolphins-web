<template>
  <div ref="chartRef" style="height: 300px"></div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick } from "vue";
import * as echarts from "echarts";

const props = defineProps({ data: Array });
const chartRef = ref();
let xAxisTimeType = ref(false);

function renderChart() {
  const chart = echarts.init(chartRef.value);
  chart.setOption({
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    xAxis: {
      type: xAxisTimeType.value ? "time" : "category",
      axisLabel: {
        interval: 0, // 强制显示所有标签
        rotate: 30,  // 可选：旋转一定角度，防止重叠
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        type: xAxisTimeType.value ? "line" : "bar",
        data: props.data.map((i) => [i.tag, i.value]),
      },
    ],
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {},
      },
    },
  });
}

watch(() => props.data,() => {
  if (props.data.length > 0 && typeof props.data[0].tag === "object") {
    xAxisTimeType.value = true;
  }
  renderChart()
});
watch(() => props.data, renderChart);
</script>