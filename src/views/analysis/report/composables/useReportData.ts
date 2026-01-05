import { ref, type Ref } from 'vue'
import { getChartStats, getWordCloudData, getTableData, type ChartDataResponse, type WordCloudResponse } from '@/api/analysis'
import type { ECOption } from '@/utils/echarts'
import type { LineSeriesOption } from 'echarts/charts'

export interface ReportItem {
  id?: string | number
  隐患级别?: string
  隐患名称?: string
  发现时间?: string
  整改责任单位?: string
  隐患总类别?: string
  具体要求?: string
  [key: string]: unknown
}

export interface UseReportDataReturn {
  totalCount: Ref<number>
  majorCount: Ref<number>
  topBusiness: Ref<string>
  topCategory: Ref<string>
  topUnit: Ref<string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wordCloudOption: Ref<ECOption | any>
  levelPieOption: Ref<ECOption | null>
  sourceBarOption: Ref<ECOption | null>
  businessBarOption: Ref<ECOption | null>
  propertyBarOption: Ref<ECOption | null>
  trendLineOption: Ref<ECOption | null>
  unitBarOption: Ref<ECOption | null>
  categoryBarOption: Ref<ECOption | null>
  majorTableData: Ref<ReportItem[]>
  refreshAllData: () => Promise<void>
}

export function useReportData(searchParams: Ref<Record<string, unknown>>): UseReportDataReturn {
  // Meta Data
  const totalCount = ref(0)
  const majorCount = ref(0)
  const topBusiness = ref('-')
  const topCategory = ref('-')
  const topUnit = ref('-')

  // Chart Options
  const wordCloudOption = ref<ECOption | any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const levelPieOption = ref<ECOption | null>(null)
  const sourceBarOption = ref<ECOption | null>(null)
  const businessBarOption = ref<ECOption | null>(null)
  const propertyBarOption = ref<ECOption | null>(null)
  const trendLineOption = ref<ECOption | null>(null)
  const unitBarOption = ref<ECOption | null>(null)
  const categoryBarOption = ref<ECOption | null>(null)

  // Table Data
  const majorTableData = ref<ReportItem[]>([])

  // 0. WordCloud
  const initWordCloud = async () => {
    const res = await getWordCloudData(100, 2)
    const data = res.data as unknown as WordCloudResponse
    if (data && data.success) {
      const sortedData = [...data.data].sort((a, b) => b.frequency - a.frequency)
      const chartData = sortedData.map((i, index) => {
        let color
        if (index === 0) {
          color = '#ff4d4f'
        } else if (index === 1) {
          color = '#fa8c16'
        }
        return {
          name: i.keyword,
          value: i.frequency,
          textStyle: color ? { color } : undefined,
        }
      })

      wordCloudOption.value = {
        tooltip: { show: true },
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [0, 0],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return (
                  'rgb(' +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(',') +
                  ')'
                )
              },
            },
            emphasis: {
              focus: 'self',
              textStyle: {
                shadowBlur: 10,
                shadowColor: '#333',
              },
            },
            data: chartData,
          },
        ],
      }
    }
  }

  // 1. Level
  const initLevel = async () => {
    const res = await getChartStats('隐患级别', searchParams.value)
    const data = res.data
    if (data && data.success) {
      const stats = data.stats
      totalCount.value = stats.reduce((sum, i) => sum + i.count, 0)
      majorCount.value = stats.find((i) => String(i['隐患级别']) === '重大隐患')?.count || 0

      levelPieOption.value = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '0%' },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: stats.map((i) => ({ value: i.count, name: String(i['隐患级别']) })),
            label: { formatter: '{b}: {c} ({d}%)' },
          },
        ],
      }
    }
  }

  // 2. Source
  const initSource = async () => {
    const res = await getChartStats('隐患来源', searchParams.value)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sorted = data.stats.sort((a, b) => b.count - a.count)
      
      sourceBarOption.value = {
        tooltip: { trigger: 'axis' },
        grid: { containLabel: true, bottom: '10%' },
        xAxis: {
          type: 'category',
          data: sorted.map((i) => String(i['隐患来源'])),
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: { type: 'value' },
        series: [
          { 
            type: 'bar', 
            data: sorted.map((i) => i.count), 
            itemStyle: { color: '#52c41a' },
            label: { show: true, position: 'top' }
          },
        ],
      }
    }
  }

  // 3. Business
  const initBusiness = async () => {
    const res = await getChartStats('业态_一级分类_', searchParams.value)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sorted = data.stats.sort((a, b) => b.count - a.count)
      topBusiness.value = String(sorted[0]?.['业态_一级分类_'] || '-')
      // businessBarOption is handled by BusinessBarChart component
    }
  }

  // 4. Property
  const initProperty = async () => {
    const res = await getChartStats('隐患业务属性', searchParams.value)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sorted = data.stats.sort((a, b) => b.count - a.count)
      
      propertyBarOption.value = {
        tooltip: { trigger: 'axis' },
        grid: { containLabel: true, bottom: '10%' },
        xAxis: {
          type: 'category',
          data: sorted.map((i) => String(i['隐患业务属性'])),
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: { type: 'value' },
        series: [
          { type: 'bar', data: sorted.map((i) => i.count), itemStyle: { color: '#722ed1' } },
        ],
      }
    }
  }

  // 5. Trend
  const initTrend = async () => {
    // 1. Get involved levels first
    const levelRes = await getChartStats('隐患级别', searchParams.value)
    if (!levelRes.data || !levelRes.data.success) return

    const levels = levelRes.data.stats.map((i) => String(i['隐患级别']))
    const allDates = new Set<string>()

    interface TrendSeriesItem {
      name: string
      stats: ChartDataResponse['stats']
    }
    const seriesList: TrendSeriesItem[] = []

    // 2. Fetch trend for each level in parallel
    await Promise.all(
      levels.map(async (level) => {
        // Override '隐患级别' to query specific level trend
        const params = { ...searchParams.value, 隐患级别: level }
        const res = await getChartStats('发现时间', params)
        if (res.data && res.data.success) {
          const stats = res.data.stats
          stats.forEach((s) => allDates.add(String(s['发现时间'])))
          seriesList.push({
            name: level,
            stats: stats,
          })
        }
      }),
    )

    // 3. Process Dates (Sort and take last 30)
    const sortedDates = Array.from(allDates)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-30)

    // 4. Build Series Data aligned to sortedDates
    const series: LineSeriesOption[] = seriesList.map((item) => {
      const dateMap = new Map(item.stats.map((i) => [String(i['发现时间']), i.count]))
      const data = sortedDates.map((date) => dateMap.get(date) || 0)
      return {
        name: item.name,
        type: 'line',
        smooth: true,
        data: data,
        symbol: 'circle',
        symbolSize: 6,
      }
    })

    // 5. Update Option
    trendLineOption.value = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: levels,
        bottom: '0%',
        icon: 'circle',
      },
      grid: { containLabel: true, bottom: '10%' },
      xAxis: {
        type: 'category',
        data: sortedDates,
        boundaryGap: false,
      },
      yAxis: { type: 'value' },
      series: series,
    }
  }

  // 6. Unit
  const initUnit = async () => {
    const res = await getChartStats('整改责任单位', searchParams.value)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sorted = data.stats.sort((a, b) => b.count - a.count).slice(0, 10)
      topUnit.value = String(sorted[0]?.['整改责任单位'] || '-')

      unitBarOption.value = {
        tooltip: { trigger: 'axis' },
        grid: { bottom: '20%' },
        xAxis: {
          type: 'category',
          data: sorted.map((i) => String(i['整改责任单位'])),
          axisLabel: { interval: 0, rotate: 45 },
        },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'bar',
            data: sorted.map((i) => i.count),
            itemStyle: { color: '#faad14' },
            label: { show: true, position: 'top' },
          },
        ],
      }
    }
  }

  // 7. Category
  const initCategory = async () => {
    const res = await getChartStats('隐患总类别', searchParams.value)
    const data = res.data as unknown as ChartDataResponse
    if (data && data.success) {
      const sorted = data.stats.sort((a, b) => b.count - a.count).slice(0, 10)
      topCategory.value = String(sorted[0]?.['隐患总类别'] || '-')

      categoryBarOption.value = {
        tooltip: { trigger: 'axis' },
        grid: { containLabel: true, bottom: '10%' },
        xAxis: {
          type: 'category',
          data: sorted.map((i) => String(i['隐患总类别'])),
          axisLabel: {
            interval: 0,
            rotate: 30,
            formatter: (value: string) =>
              value.length > 6 ? value.substring(0, 6) + '...' : value,
          },
        },
        yAxis: { type: 'value' },
        series: [
          { type: 'bar', data: sorted.map((i) => i.count), itemStyle: { color: '#722ed1' } },
        ],
      }
    }
  }

  // 8. Table
  const initTable = async () => {
    const params = {
      limit: 1000,
      ...searchParams.value,
    }
    const res = await getTableData(params as Record<string, unknown>)
    if (res.data && res.data.success) {
      const list = res.data.data as ReportItem[]

      // Filter out '较小隐患', show '重大隐患' and '一般隐患' etc.
      const levels = ['重大隐患', '较大隐患','一般隐患']
      const filteredList = list.filter((i) => levels.includes(String(i['隐患级别'])))

      // 1. Calculate Major Hidden Danger count for each unit
      const unitMajorCounts: Record<string, number> = {}
      filteredList.forEach((item) => {
        const unit = String(item['整改责任单位'] || '其他')
        if (!unitMajorCounts[unit]) unitMajorCounts[unit] = 0
        if (String(item['隐患级别']) === '重大隐患') {
          unitMajorCounts[unit]++
        }
      })

      // 2. Sort the list
      filteredList.sort((a, b) => {
        const unitA = String(a['整改责任单位'] || '其他')
        const unitB = String(b['整改责任单位'] || '其他')

        // Primary: Unit's Major Count (Descending)
        // The unit with more major hidden dangers comes first
        const countA = unitMajorCounts[unitA] || 0
        const countB = unitMajorCounts[unitB] || 0
        if (countA !== countB) return countB - countA

        // Secondary: Group by Unit Name (keep same units together)
        if (unitA !== unitB) return unitA.localeCompare(unitB, 'zh-CN')

        // Tertiary: Major Hidden Dangers first within the unit
        const levelA = String(a['隐患级别']) === '重大隐患' ? 1 : 0
        const levelB = String(b['隐患级别']) === '重大隐患' ? 1 : 0
        return levelB - levelA
      })

      majorTableData.value = filteredList
    }
  }

  const refreshAllData = async () => {
    await Promise.all([
      initWordCloud(),
      initLevel(),
      initSource(),
      initBusiness(),
      initProperty(),
      initTrend(),
      initUnit(),
      initCategory(),
      initTable(),
    ])
  }

  return {
    totalCount,
    majorCount,
    topBusiness,
    topCategory,
    topUnit,
    wordCloudOption,
    levelPieOption,
    sourceBarOption,
    businessBarOption,
    propertyBarOption,
    trendLineOption,
    unitBarOption,
    categoryBarOption,
    majorTableData,
    refreshAllData,
  }
}
