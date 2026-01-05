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
    const res = await getChartStats('隐患业务属性', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      option.value = {
        title: { text: '隐患业务属性分布', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: data.stats.map((i) => String(i['隐患业务属性'])),
          axisTick: { alignWithLabel: true },
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: data.stats.map((i) => i.count),
            label: { show: true, position: 'right' },
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
