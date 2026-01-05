<template>
  <div class="business-chart-container">
    <a-row :gutter="16">
      <a-col :span="12">
        <BasicChart ref="chart1Ref" :options="option1" height="400px" @click="handleChart1Click" />
      </a-col>
      <a-col :span="12">
        <BasicChart :options="option2" height="400px" />
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getChartStats, type ChartDataResponse } from '@/api/analysis'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'
import type { PieSeriesOption } from 'echarts/charts'

const props = defineProps<{ conditions: Record<string, unknown> }>()
const loading = ref(false)
const option1 = ref<ECOption | null>(null)
const option2 = ref<ECOption | null>(null)
const selectedLevel1 = ref<string | null>(null)

// Fetch Level 1 Data
const fetchLevel1Data = async () => {
  try {
    const res = await getChartStats('业态_一级分类_', props.conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      // Sort to find the most frequent category
      const sortedStats = [...data.stats].sort((a, b) => b.count - a.count)
      if (sortedStats.length > 0 && !selectedLevel1.value && sortedStats[0]) {
        selectedLevel1.value = String(sortedStats[0]['业态_一级分类_'])
      }

      option1.value = {
        title: { text: '业态一级分类', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '业态一级分类',
            type: 'pie',
            radius: '50%',
            selectedMode: 'single',
            selectedOffset: 10,
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)',
            },
            data: data.stats.map((i) => ({
              value: i.count,
              name: String(i['业态_一级分类_']),
              selected: selectedLevel1.value === String(i['业态_一级分类_']),
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// Fetch Level 2 Data
const fetchLevel2Data = async () => {
  try {
    const conditions = { ...props.conditions }
    if (selectedLevel1.value) {
      conditions['业态_一级分类_'] = selectedLevel1.value
    }

    const res = await getChartStats('业态_二级分类_', conditions)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      option2.value = {
        title: {
          text: selectedLevel1.value ? `${selectedLevel1.value}-二级分类` : '业态二级分类',
          left: 'center',
        },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: '业态二级分类',
            type: 'pie',
            radius: '50%',
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)',
            },
            data: data.stats.map((i) => ({
              value: i.count,
              name: String(i['业态_二级分类_']),
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    await fetchLevel1Data()
    await fetchLevel2Data()
  } finally {
    loading.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleChart1Click = (params: any) => {
  if (params.name && selectedLevel1.value !== params.name) {
    selectedLevel1.value = params.name

    // Update visual selection without re-fetching data
    if (option1.value && Array.isArray(option1.value.series) && option1.value.series[0]) {
      const series = option1.value.series[0]
      const data = series.data as { name: string; value: number; selected?: boolean }[]

      if (data) {
        const newData = data.map((i) => ({
          ...i,
          selected: i.name === selectedLevel1.value,
        }))

        option1.value = {
          ...option1.value,
          series: [
            {
              ...series,
              data: newData,
            } as PieSeriesOption,
          ],
        }
      }
    }

    fetchLevel2Data()
  }
}

watch(
  () => props.conditions,
  () => {
    selectedLevel1.value = null // Reset selection on global filter change
    fetchData()
  },
  { deep: true },
)

onMounted(fetchData)
</script>
