<template>
  <a-card :bordered="false" :loading="loading">
    <BasicChart :options="option" height="400px" />
  </a-card>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getChartStats, type ChartDataResponse } from '@/api/analysis'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const option = ref<ECOption | any>(null)

// 分离配置逻辑
const getChartOption = (data: { name: string; value: number }[]) => {
  return {
    title: {
      text: '隐患类别词云',
      left: 'center',
      top: 10, // 增加顶部距离
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
    },
    tooltip: { show: true },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: '15%', // 增加图表与顶部的距离，避开标题
        width: '90%',
        height: '85%', // 调整高度防止溢出
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [0, 0],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            // 鲜艳的色盘
            const colors = [
              '#5470c6',
              '#91cc75',
              '#fac858',
              '#ee6666',
              '#73c0de',
              '#3ba272',
              '#fc8452',
              '#9a60b4',
              '#ea7ccc',
            ]
            return colors[Math.floor(Math.random() * colors.length)]
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: data,
      },
    ],
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getChartStats('隐患分类别', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const chartData = data.stats.map((i) => ({
        name: String(i['隐患分类别']),
        value: i.count,
      }))
      option.value = getChartOption(chartData)
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
