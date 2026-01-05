<template>
  <a-card :bordered="false" :loading="loading">
    <BasicChart :options="option" height="400px" />
  </a-card>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getWordCloudData, type WordCloudResponse } from '@/api/analysis'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const option = ref<ECOption | any>(null)

// 分离配置逻辑
const getChartOption = (data: { name: string; value: number; textStyle?: { color: string } }[]) => {
  return {
    title: {
      text: '隐患关键词云（top50）',
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
            return (
              'rgb(' +
              [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(',') +
              ')'
            )
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
    const res = await getWordCloudData(50)
    const data = res.data as unknown as WordCloudResponse
    if (data && data.success) {
      // 按频率降序排序
      const sortedData = data.data.sort((a, b) => b.frequency - a.frequency)

      const chartData = sortedData.map((i, index) => {
        let color
        // Top 1 红色
        if (index === 0) {
          color = '#ff4d4f'
        }
        // Top 2 橙色
        else if (index === 1) {
          color = '#fa8c16'
        }

        return {
          name: i.keyword,
          value: i.frequency,
          textStyle: color ? { color } : undefined,
        }
      })
      option.value = getChartOption(chartData)
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
