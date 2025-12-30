<template>
  <div class="p-4">
    <a-card title="数据筛选" :loading="loading">
      <DynamicForm :model="selectedFilters" :schemas="schemas" :row-props="{ gutter: [16, 16] }">
        <template #action>
          <div style="text-align: right">
            <a-space>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </div>
        </template>
      </DynamicForm>
    </a-card>

    <div class="mt-4">
      <a-card title="图表展示" :loading="chartLoading">
        <!-- 关键分布指标 (第一行) -->
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12">
            <a-card :bordered="false">
              <BasicChart :options="levelPieOption" height="300px" />
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card :bordered="false">
              <BasicChart :options="sourcePieOption" height="300px" />
            </a-card>
          </a-col>
        </a-row>

        <!-- 核心业务堆叠图 (第二行) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :span="24">
            <a-card :bordered="false">
              <BasicChart :options="chartOption" height="400px" />
            </a-card>
          </a-col>
        </a-row>

        <!-- 管理与业态 (第三行) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :lg="12">
            <a-card :bordered="false">
              <BasicChart :options="unitBarOption" height="500px" />
            </a-card>
          </a-col>
          <a-col :xs="24" :lg="12">
            <a-card :bordered="false">
              <BasicChart :options="businessPieOption" height="500px" />
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HiddenDangerAnalysis',
})
import { ref, onMounted } from 'vue'
import {
  getFilterOptions,
  getChartStats,
  type FilterData,
  type ChartDataResponse,
} from '@/api/analysis'
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'
import type { FormSchema } from '@/components/DynamicForm/types'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

const loading = ref(false)
const chartLoading = ref(false)
const schemas = ref<FormSchema[]>([])
const selectedFilters = ref<Record<string, unknown>>({})
const chartOption = ref<ECOption | null>(null)
const levelPieOption = ref<ECOption | null>(null)
const sourcePieOption = ref<ECOption | null>(null)
const unitBarOption = ref<ECOption | null>(null)
const businessPieOption = ref<ECOption | null>(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getFilterOptions()
    // 根据 excelApi 的定义，res 是 UnifiedResponse，res.data 是后端返回的完整对象
    const filterData = res.data as unknown as FilterData

    if (filterData && filterData.success) {
      const newSchemas: FormSchema[] = []

      filterData.groupColumns.forEach((col) => {
        const options = filterData.columnStats[col] || []

        newSchemas.push({
          field: col,
          label: col,
          component: 'Select',
          componentProps: {
            options: options.map((opt) => {
              console.log('opt:', opt)
              const labelStr = opt[col]
              return {
                label: `${labelStr} (${opt.count})`,
                value: labelStr,
              }
            }),
            showSearch: true,
            allowClear: true,
            mode: 'multiple',
            maxTagCount: 1,
            placeholder: '请选择',
          },
          colProps: {
            span: 6,
            xs: 24,
            sm: 12,
            md: 8,
            lg: 6,
            xl: 6,
          },
        })
      })

      // 添加操作按钮占位符
      newSchemas.push({
        field: 'action',
        label: '',
        slot: 'action',
        formItemProps: {
          wrapperCol: { span: 24 },
        },
        colProps: {
          span: 6,
          xs: 24,
          sm: 12,
          md: 8,
          lg: 6,
          xl: 6,
        },
      })

      schemas.value = newSchemas
    }
  } catch (error) {
    console.error('获取筛选条件失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchChartData = async () => {
  chartLoading.value = true
  try {
    const conditions: Record<string, unknown> = {}
    Object.keys(selectedFilters.value).forEach((key) => {
      const val = selectedFilters.value[key]
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val) && val.length === 0) return
        conditions[key] = val
      }
    })

    const conditionParams = Object.keys(conditions).length ? conditions : undefined

    // 并发请求多个维度的统计数据
    const [mainRes, levelRes, sourceRes, unitRes, businessRes] = await Promise.all([
      getChartStats('隐患总类别,隐患级别', conditionParams),
      getChartStats('隐患级别', conditionParams),
      getChartStats('隐患来源', conditionParams),
      getChartStats('整改责任单位', conditionParams),
      getChartStats('业态', conditionParams),
    ])

    const mainData = mainRes.data as unknown as ChartDataResponse
    if (mainData && mainData.success) {
      updateMainChart(mainData)
    }

    const levelData = levelRes.data as unknown as ChartDataResponse
    if (levelData && levelData.success) {
      updateLevelChart(levelData)
    }

    const sourceData = sourceRes.data as unknown as ChartDataResponse
    if (sourceData && sourceData.success) {
      updateSourceChart(sourceData)
    }

    const unitData = unitRes.data as unknown as ChartDataResponse
    if (unitData && unitData.success) {
      updateUnitChart(unitData)
    }

    const businessData = businessRes.data as unknown as ChartDataResponse
    if (businessData && businessData.success) {
      updateBusinessChart(businessData)
    }
  } catch (error) {
    console.error('获取图表数据失败:', error)
  } finally {
    chartLoading.value = false
  }
}

// 1. 处理主图表 (堆叠柱状图)
const updateMainChart = (data: ChartDataResponse) => {
  const levels = new Set<string>()
  const categories = new Set<string>()
  const dataMap = new Map<string, Map<string, number>>()

  data.stats.forEach((item) => {
    const category = String(item['隐患总类别'])
    const level = String(item['隐患级别'])
    const count = item.count

    levels.add(level)
    categories.add(category)

    if (!dataMap.has(category)) {
      dataMap.set(category, new Map())
    }
    dataMap.get(category)!.set(level, count)
  })

  const levelList = Array.from(levels)
  const categoryList = Array.from(categories)

  const source: Array<Array<string | number>> = [['product', ...levelList]]

  categoryList.forEach((cat) => {
    const row: Array<string | number> = [cat]
    levelList.forEach((level) => {
      row.push(dataMap.get(cat)?.get(level) || 0)
    })
    source.push(row)
  })

  chartOption.value = {
    title: { text: '隐患类别分布' },
    legend: {},
    tooltip: {},
    dataset: { source: source },
    xAxis: { type: 'category', axisLabel: { interval: 0, rotate: 30 } },
    yAxis: {},
    series: levelList.map(() => ({ type: 'bar', stack: 'total' })),
  }
}

// 2. 处理隐患级别 (饼图)
const updateLevelChart = (data: ChartDataResponse) => {
  levelPieOption.value = {
    title: { text: '隐患级别占比', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '隐患级别',
        type: 'pie',
        radius: '50%',
        data: data.stats.map((item) => ({
          value: item.count,
          name: String(item['隐患级别']),
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

// 3. 处理隐患来源 (环形图)
const updateSourceChart = (data: ChartDataResponse) => {
  sourcePieOption.value = {
    title: { text: '隐患来源分布', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [
      {
        name: '隐患来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' },
        },
        labelLine: { show: false },
        data: data.stats.map((item) => ({
          value: item.count,
          name: String(item['隐患来源']),
        })),
      },
    ],
  }
}

// 4. 处理责任单位 (横向柱状图 - Top 10)
const updateUnitChart = (data: ChartDataResponse) => {
  // 排序并取前10
  const sortedStats = data.stats
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .reverse() // ECharts category axis needs reversed data to show top at top

  unitBarOption.value = {
    title: { text: '整改责任单位 TOP 10' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: {
      type: 'category',
      data: sortedStats.map((item) => String(item['整改责任单位'])),
    },
    series: [
      {
        name: '隐患数量',
        type: 'bar',
        data: sortedStats.map((item) => item.count),
      },
    ],
  }
}

// 5. 处理业态分布 (玫瑰图)
const updateBusinessChart = (data: ChartDataResponse) => {
  businessPieOption.value = {
    title: { text: '业态分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '业态',
        type: 'pie',
        radius: [20, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: { borderRadius: 8 },
        data: data.stats.map((item) => ({
          value: item.count,
          name: String(item['业态']),
        })),
      },
    ],
  }
}

onMounted(() => {
  fetchData()
  fetchChartData()
})

const handleSearch = () => {
  console.log('Search Params:', selectedFilters.value)
  fetchChartData()
}

const handleReset = () => {
  Object.keys(selectedFilters.value).forEach((key) => {
    selectedFilters.value[key] = undefined
  })
  fetchChartData()
}
</script>

<style scoped></style>
