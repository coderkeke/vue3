<template>
  <a-card :bordered="false" :loading="loading">
    <BasicChart :options="option" height="300px" />
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
    const res = await getChartStats('隐患总类别', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      option.value = {
        title: { text: '隐患总类别分布', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { 
          type: 'category', 
          data: data.stats.map(i => String(i['隐患总类别'])),
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: { type: 'value' },
        series: [{
          name: '数量',
          type: 'bar',
          data: data.stats.map(i => i.count),
          itemStyle: { color: '#91CC75' }
        }]
      }
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
