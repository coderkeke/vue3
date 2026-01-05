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
import { getHiddenDangerColor, HIDDEN_DANGER_ORDER } from '../constants'

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
const option = ref<ECOption | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getChartStats('隐患级别', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sortedStats = [...data.stats].sort((a, b) => {
        const indexA = HIDDEN_DANGER_ORDER.indexOf(String(a['隐患级别']))
        const indexB = HIDDEN_DANGER_ORDER.indexOf(String(b['隐患级别']))
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })

      option.value = {
        title: { text: '隐患级别分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: '隐患级别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            minAngle: 5,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)',
            },
            labelLayout: {
              hideOverlap: false,
            },
            labelLine: {
              show: true,
            },
            data: sortedStats.map((i) => ({
              value: i.count,
              name: String(i['隐患级别']),
              itemStyle: { color: getHiddenDangerColor(String(i['隐患级别'])) },
            })),
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
