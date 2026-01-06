<template>
  <a-card :bordered="false" :loading="loading">
    <a-row :gutter="16">
      <a-col :span="12">
        <BasicChart
          ref="chart1Ref"
          :options="option1"
          :update-options="{ notMerge: false }"
          height="400px"
          @click="handleChart1Click"
        />
      </a-col>
      <a-col :span="12">
        <BasicChart :options="option2" height="400px" />
      </a-col>
    </a-row>
  </a-card>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getChartStats, type ChartDataResponse } from '@/api/analysis'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

interface StatItem {
  count: number
  [key: string]: string | number
}

interface ChartClickParams {
  componentType: string
  seriesType: string
  seriesIndex: number
  seriesName: string
  name: string
  dataIndex: number
  data: unknown
  dataType: string
  value: number | string
  color: string
}

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
const option1 = ref<ECOption | null>(null)
const option2 = ref<ECOption | null>(null)
const selectedLevel1 = ref<string | null>(null)
const level1Stats = ref<StatItem[]>([])

const renderChart1 = (keepZoom = false) => {
  if (!level1Stats.value.length) return

  const baseOption: ECOption = {
    title: { text: '隐患类别_一级分类', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 20, bottom: 80, containLabel: false },
    xAxis: {
      type: 'category',
      data: level1Stats.value.map((i) => String(i['隐患类别_一级分类'])),
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '数量',
        type: 'bar',
        barWidth: '60%',
        data: level1Stats.value.map((i) => ({
          value: i.count,
          itemStyle: {
            color: String(i['隐患类别_一级分类']) === selectedLevel1.value ? '#ee6666' : '#91CC75',
          },
        })),
        itemStyle: { color: '#91CC75' },
      },
    ],
  }

  if (!keepZoom) {
    baseOption.dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 60, // 默认显示前 60% 的数据
        bottom: 10,
        height: 15, // 设置高度细一点
        left: '12%', // 距离左边 10%
        right: '10%', // 距离右边 10%
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 60,
      },
    ]
  }

  option1.value = baseOption
}

// Fetch Level 1 Data
const fetchLevel1Data = async () => {
  loading.value = true
  try {
    const res = await getChartStats('隐患类别_一级分类', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      // Sort to find the most frequent category
      level1Stats.value = [...data.stats].sort((a, b) => b.count - a.count)

      // Set default selection
      const firstItem = level1Stats.value[0]
      if (firstItem && !selectedLevel1.value) {
        selectedLevel1.value = String(firstItem['隐患类别_一级分类'])
      }

      renderChart1()

      // Fetch level 2 data after level 1 is ready
      fetchLevel2Data()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Fetch Level 2 Data
const fetchLevel2Data = async () => {
  if (!selectedLevel1.value) return

  try {
    const conditions = { ...props.conditions }
    conditions['隐患类别_一级分类'] = selectedLevel1.value

    const res = await getChartStats('隐患类别_二级分类', conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sortedStats = [...data.stats].sort((a, b) => b.count - a.count)

      option2.value = {
        title: {
          text: `${selectedLevel1.value}-二级分类`,
          left: 'center',
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 50, right: 20, bottom: 80, containLabel: false },
        // 添加数据区域缩放组件，解决数据量大时X轴标签拥挤的问题
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 60, // 默认显示前 60% 的数据
            bottom: 10,
            height: 15, // 设置高度细一点
            left: '12%', // 距离左边 10%
            right: '10%', // 距离右边 10%
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 60,
          },
        ],
        xAxis: {
          type: 'category',
          data: sortedStats.map((i) => String(i['隐患类别_二级分类'])),
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '60%',
            data: sortedStats.map((i) => i.count),
            itemStyle: { color: '#FAC858' },
          },
        ],
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const handleChart1Click = (p: unknown) => {
  const params = p as ChartClickParams
  if (params.name && selectedLevel1.value !== params.name) {
    selectedLevel1.value = params.name
    renderChart1(true)
    fetchLevel2Data()
  }
}

watch(
  () => props.conditions,
  () => {
    selectedLevel1.value = null // Reset selection when conditions change
    fetchLevel1Data()
  },
  { deep: true },
)

onMounted(fetchLevel1Data)
</script>
