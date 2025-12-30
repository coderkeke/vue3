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
    const res = await getChartStats('发现时间,隐患级别', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const timeSet = new Set<string>()
      const levelSet = new Set<string>()
      const dataMap = new Map<string, Map<string, number>>()

      data.stats.forEach((item) => {
        const time = String(item['发现时间'])
        const level = String(item['隐患级别'])
        const count = item.count

        timeSet.add(time)
        levelSet.add(level)

        if (!dataMap.has(time)) {
          dataMap.set(time, new Map())
        }
        dataMap.get(time)!.set(level, count)
      })

      const timeList = Array.from(timeSet).sort()
      const levelList = Array.from(levelSet)
      const series = levelList.map((level) => {
        return {
          name: level,
          type: 'bar', // 全部用柱状图
          emphasis: { focus: 'series' },
          data: timeList.map((time) => dataMap.get(time)?.get(level) || 0),
        }
      })

      option.value = {
        title: { text: '发现时间与隐患级别趋势', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: levelList, top: 'bottom' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: [
          {
            type: 'category',
            data: timeList,
            axisLabel: { rotate: 45 },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '隐患数量',
            splitLine: { show: true, lineStyle: { type: 'dashed' } },
          },
        ],
        series: series as any,
      }
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
