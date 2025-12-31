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
import * as echarts from 'echarts/core'

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
const option = ref<ECOption | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getChartStats('隐患级别', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      option.value = {
        title: { text: '隐患级别分布', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: data.stats.map((i) => String(i['隐患级别'])),
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed', // 虚线网格
              color: '#eee',
            },
          },
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '60%', // 调整柱子宽度
            data: data.stats.map((i) => i.count),
            itemStyle: {
              borderRadius: [5, 5, 0, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' }, // 渐变起始色
                { offset: 0.5, color: '#188df0' }, // 中间色
                { offset: 1, color: '#188df0' }, // 结束色
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' },
                ]),
              },
            },
          },
        ],
      }
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
