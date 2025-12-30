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
    const res = await getChartStats('业务属性', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      option.value = {
        title: { text: '业务属性分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
          name: '业务属性',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          data: data.stats.map(i => ({ value: i.count, name: String(i['业务属性']) }))
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
