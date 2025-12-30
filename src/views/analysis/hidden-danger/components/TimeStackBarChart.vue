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

      // 定义高优先级
      const highPriorityLevels = ['重大隐患', '较大隐患']

      const series = levelList.map((level) => {
        const isHighPriority = highPriorityLevels.some((k) => level.includes(k))
        return {
          name: level,
          type: 'bar', // 全部回归柱状图
          stack: isHighPriority ? 'high' : 'low', // 分组堆叠
          xAxisIndex: isHighPriority ? 0 : 1, // 对应不同的 Grid
          yAxisIndex: isHighPriority ? 0 : 1,
          emphasis: { focus: 'series' },
          data: timeList.map((time) => dataMap.get(time)?.get(level) || 0),
        }
      })

      option.value = {
        title: { text: '发现时间与隐患级别趋势', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: levelList, top: 'bottom' },
        axisPointer: { link: [{ xAxisIndex: 'all' }] }, // 联动两个图表的指示器
        grid: [
          // 上半部分：展示重大/较大隐患
          { left: '60', right: '20', top: '10%', height: '35%' },
          // 下半部分：展示一般/较小隐患
          { left: '60', right: '20', top: '55%', height: '35%' },
        ],
        xAxis: [
          {
            type: 'category',
            data: timeList,
            gridIndex: 0,
            axisLabel: { show: false }, // 隐藏上图的X轴标签
            axisTick: { show: false },
          },
          {
            type: 'category',
            data: timeList,
            gridIndex: 1,
            position: 'bottom',
            axisLabel: { rotate: 45 },
          },
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            name: '重大/较大',
            nameLocation: 'end',
            splitLine: { show: true, lineStyle: { type: 'dashed' } },
          },
          {
            type: 'value',
            gridIndex: 1,
            name: '一般/较小',
            nameLocation: 'end',
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
