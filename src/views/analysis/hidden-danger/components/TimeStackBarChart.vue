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
import type { BarSeriesOption } from 'echarts/charts'
import { getHiddenDangerColor, HIDDEN_DANGER_ORDER } from '../constants'

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
      const levelList = Array.from(levelSet).sort((a, b) => {
        const indexA = HIDDEN_DANGER_ORDER.indexOf(a)
        const indexB = HIDDEN_DANGER_ORDER.indexOf(b)
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })
      const series: BarSeriesOption[] = levelList.map((level) => {
        return {
          name: level,
          type: 'bar', // 全部用柱状图
          stack: 'total',
          emphasis: { focus: 'series' },
          itemStyle: { color: getHiddenDangerColor(level) },
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
        series: series,
      }
    }
  } finally {
    loading.value = false
  }
}

watch(() => props.conditions, fetchData, { deep: true })
onMounted(fetchData)
</script>
