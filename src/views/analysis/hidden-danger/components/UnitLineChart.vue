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
const option = ref<ECOption | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getChartStats('整改责任单位', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const stats = data.stats

      option.value = {
        title: { text: '整改责任单位统计', left: 'center' },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: stats.map((i) => String(i['整改责任单位'])),
          axisLabel: { interval: 0, rotate: 45 },
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '数量',
            type: 'line',
            data: stats.map((i) => i.count),
            areaStyle: {},
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
