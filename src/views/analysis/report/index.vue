<template>
  <div class="report-container">
    <div class="no-print actions-bar">
      <a-button style="margin-right: 10px" @click="handleExportWord">导出 Word</a-button>
      <a-button type="primary" @click="handlePrint">打印 / 导出 PDF</a-button>
    </div>

    <!-- Single Continuous Page Report -->
    <div class="a4-page portrait auto-height">
      <div class="report-header">
        <div class="logo-area">隐患管理中心</div>
        <div class="title-area">
          <h1>隐患管理分析报表</h1>
          <p class="subtitle">STATISTICAL ANALYSIS REPORT</p>
        </div>
        <div class="meta-area">
          <div class="meta-item">
            <span class="label">统计周期：</span>
            <span class="value">{{ dateRange }}</span>
          </div>
          <div class="meta-item">
            <span class="label">生成时间：</span>
            <span class="value">{{ generateTime }}</span>
          </div>
        </div>
      </div>

      <div class="summary-box">
        <div class="summary-title">核心结论</div>
        <div class="summary-content">
          本周期内共发现隐患 <b>{{ totalCount }}</b> 个，其中重大隐患 <b>{{ majorCount }}</b> 个。
          隐患高发业态为 <b>{{ topBusiness }}</b
          >，主要集中在 <b>{{ topCategory }}</b> 类别。 整改责任单位中，<b>{{ topUnit }}</b>
          隐患数量最多，需重点关注。
        </div>
      </div>

      <div class="chart-section">
        <div class="section-title">1. 隐患总体概况</div>

        <div class="chart-row single">
          <div class="chart-item">
            <h4>隐患级别分布</h4>
            <div class="chart-wrapper">
              <BasicChart :options="levelPieOption" height="100%" />
            </div>
          </div>
        </div>

        <div class="chart-row single" style="margin-top: 20px">
          <div class="chart-item">
            <h4>业务属性占比</h4>
            <div class="chart-wrapper">
              <BasicChart :options="propertyPieOption" height="100%" />
            </div>
          </div>
        </div>

        <div class="chart-row single" style="margin-top: 20px">
          <div class="chart-item">
            <h4>隐患来源构成</h4>
            <div class="chart-wrapper">
              <BasicChart :options="sourceBarOption" height="100%" />
            </div>
          </div>
        </div>

        <div class="chart-row single" style="margin-top: 20px">
          <div class="chart-item">
            <h4>各业态隐患分布</h4>
            <div class="chart-wrapper">
              <BasicChart :options="businessBarOption" height="100%" />
            </div>
          </div>
        </div>
      </div>

      <div class="print-break"></div>

      <div class="chart-section">
        <div class="section-title">2. 重点隐患趋势</div>
        <div class="chart-row single">
          <div class="chart-item">
            <h4>近30天新增隐患趋势图</h4>
            <div class="chart-wrapper">
              <BasicChart :options="trendLineOption" height="100%" />
            </div>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="section-title">3. 责任单位排名 (TOP10)</div>
        <div class="chart-row single">
          <div class="chart-item">
            <div class="chart-wrapper">
              <BasicChart :options="unitBarOption" height="100%" />
            </div>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="section-title">4. 隐患类别分析</div>
        <div class="chart-row single">
          <div class="chart-item">
            <div class="chart-wrapper">
              <BasicChart :options="categoryBarOption" height="100%" />
            </div>
          </div>
        </div>
      </div>

      <div class="print-break"></div>

      <div class="section-title">5. 隐患明细清单</div>
      <div class="list-wrapper">
        <div class="detail-list">
          <div v-for="item in majorTableData" :key="item.id" class="detail-item">
            <div class="item-title-row">
              <span
                class="word-tag"
                :class="{ major: item['隐患级别'] === '重大隐患' }"
                style="margin-right: 5px"
              >
                【{{ item['隐患级别'] }}】
              </span>
              <span class="item-title-text">{{ item['隐患名称'] }}</span>
            </div>

            <div class="item-meta">
              <span><span class="label">发现时间：</span>{{ item['发现时间'] }}</span>
              <span class="divider">|</span>
              <span><span class="label">责任单位：</span>{{ item['整改责任单位'] }}</span>
              <span class="divider">|</span>
              <span><span class="label">类别：</span>{{ item['隐患总类别'] }}</span>
            </div>

            <div class="item-desc">
              <div class="desc-label">具体要求：</div>
              <div class="desc-content">
                {{ item['具体要求'] || '暂无要求' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer at the very end -->
      <div class="report-footer">隐患管理分析周报 - 生成于 {{ generateTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AnalysisReport',
})

import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'
import { getChartStats, getTableData, type ChartDataResponse } from '@/api/analysis'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

interface ReportItem {
  id?: string | number
  隐患级别?: string
  隐患名称?: string
  发现时间?: string
  整改责任单位?: string
  隐患总类别?: string
  具体要求?: string
  [key: string]: unknown
}

// Constants
// No longer needed for auto-flow
// const ITEMS_PER_PAGE = 4

// Meta Data
const dateRange = ref(
  `${dayjs().subtract(30, 'day').format('YYYY-MM-DD')} 至 ${dayjs().format('YYYY-MM-DD')}`,
)
const generateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const totalCount = ref(0)
const majorCount = ref(0)
const topBusiness = ref('-')
const topCategory = ref('-')
const topUnit = ref('-')

// Chart Options
const levelPieOption = ref<ECOption | null>(null)
const sourceBarOption = ref<ECOption | null>(null)
const businessBarOption = ref<ECOption | null>(null)
const propertyPieOption = ref<ECOption | null>(null)
const trendLineOption = ref<ECOption | null>(null)
const unitBarOption = ref<ECOption | null>(null)
const categoryBarOption = ref<ECOption | null>(null)

// Table Data
const majorTableData = ref<ReportItem[]>([])
// No longer using computed pagination
// const tablePages = computed(() => { ... })

const handlePrint = () => {
  window.print()
}

const handleExportWord = async () => {
  const originalElement = document.querySelector('.a4-page') as HTMLElement
  if (!originalElement) return

  // 1. Clone the node to manipulate for export
  const clonedElement = originalElement.cloneNode(true) as HTMLElement

  // 2. Convert ECharts canvases to Images
  const originalWrappers = originalElement.querySelectorAll('.chart-wrapper')
  const clonedWrappers = clonedElement.querySelectorAll('.chart-wrapper')

  originalWrappers.forEach((wrapper, index) => {
    const canvas = wrapper.querySelector('canvas')
    if (canvas) {
      // Get the data URL (image) from the original canvas
      const dataURL = canvas.toDataURL('image/png')

      // Create an image element
      const img = document.createElement('img')
      img.src = dataURL
      // Constrain width for Word (approx 100% of container)
      img.style.width = '100%'

      // Replace content in the cloned wrapper
      const clonedWrapper = clonedWrappers[index]
      if (clonedWrapper) {
        clonedWrapper.innerHTML = ''
        clonedWrapper.appendChild(img)
      }
    }
  })

  // 3. Construct HTML with inline styles or style block
  // Note: Word handles tables better than Flexbox.
  // For this simple export, we rely on Word's default stacking for divs if flex fails.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'SimSun', serif; }
        .report-header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px; }
        h1 { font-size: 24pt; font-weight: bold; margin: 0; }
        .subtitle { font-size: 10pt; color: #666; }
        .summary-box { background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin-bottom: 20px; }
        .section-title { font-size: 14pt; font-weight: bold; background-color: #eee; padding: 5px; margin-top: 20px; }
        .chart-row { margin-bottom: 20px; page-break-inside: avoid; }
        .detail-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .item-title { font-weight: bold; font-size: 12pt; }
        .item-meta { color: #666; font-size: 10pt; }
      </style>
    </head>
    <body>
      ${clonedElement.outerHTML}
    </body>
    </html>
  `

  // 4. Generate Blob and Save
  const blob = (await asBlob(htmlContent, {
    orientation: 'portrait',
    margins: { top: 720, bottom: 720, left: 720, right: 720 }, // ~0.5 inch margins
  })) as Blob

  saveAs(blob, `隐患分析周报_${dayjs().format('YYYYMMDD')}.docx`)
}

onMounted(async () => {
  await Promise.all([
    initLevel(),
    initSource(),
    initBusiness(),
    initProperty(),
    initTrend(),
    initUnit(),
    initCategory(),
    initTable(),
  ])
})

// 1. Level
const initLevel = async () => {
  const res = await getChartStats('隐患级别')
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
  const res = await getChartStats('隐患来源')
  const data = res.data as unknown as ChartDataResponse
  if (data && data.success) {
    sourceBarOption.value = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: data.stats.map((i) => String(i['隐患来源'])) },
      series: [
        { type: 'bar', data: data.stats.map((i) => i.count), itemStyle: { color: '#52c41a' } },
      ],
    }
  }
}

// 3. Business
const initBusiness = async () => {
  const res = await getChartStats('业态')
  const data = res.data as unknown as ChartDataResponse
  if (data && data.success) {
    const sorted = data.stats.sort((a, b) => b.count - a.count)
    topBusiness.value = String(sorted[0]?.['业态'] || '-')

    businessBarOption.value = {
      tooltip: { trigger: 'axis' },
      grid: { containLabel: true, bottom: '10%' },
      xAxis: {
        type: 'category',
        data: sorted.map((i) => String(i['业态'])),
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: sorted.map((i) => i.count), itemStyle: { color: '#1890ff' } }],
    }
  }
}

// 4. Property
const initProperty = async () => {
  const res = await getChartStats('业务属性')
  const data = res.data as unknown as ChartDataResponse
  if (data && data.success) {
    propertyPieOption.value = {
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: data.stats.map((i) => ({ value: i.count, name: String(i['业务属性']) })),
          label: { show: false },
        },
      ],
    }
  }
}

// 5. Trend
const initTrend = async () => {
  const res = await getChartStats('发现时间')
  const data = res.data as unknown as ChartDataResponse
  if (data && data.success) {
    const sorted = data.stats
      .sort(
        (a, b) =>
          new Date(String(a['发现时间'])).getTime() - new Date(String(b['发现时间'])).getTime(),
      )
      .slice(-30)
    trendLineOption.value = {
      tooltip: { trigger: 'axis' },
      grid: { containLabel: true, bottom: '10%' },
      xAxis: { type: 'category', data: sorted.map((i) => String(i['发现时间'])) },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: sorted.map((i) => i.count), smooth: true, areaStyle: {} }],
    }
  }
}

// 6. Unit
const initUnit = async () => {
  const res = await getChartStats('整改责任单位')
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
  const res = await getChartStats('隐患总类别')
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
          formatter: (value: string) => (value.length > 6 ? value.substring(0, 6) + '...' : value),
        },
      },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: sorted.map((i) => i.count), itemStyle: { color: '#722ed1' } }],
    }
  }
}

// 8. Table
const initTable = async () => {
  const res = await getTableData({ limit: 1000 })
  if (res.data && res.data.success) {
    const list = res.data.data as ReportItem[]

    // Filter out '较小隐患', show '重大隐患' and '一般隐患' etc.
    const filteredList = list.filter((i) => String(i['隐患级别']) !== '较小隐患')

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
</script>

<style scoped lang="less">
.report-container {
  background-color: #f0f2f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: 'SimSun', 'Songti SC', serif; // Serif for report feel
}

.actions-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  max-width: 210mm;
}

.a4-page {
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 15mm 20mm; // Standard margins
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;

  &.portrait {
    width: 210mm;
    height: 297mm;
  }

  &.auto-height {
    height: auto;
    min-height: 297mm;
    page-break-after: auto;
  }
}

.report-header {
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .logo-area {
    font-weight: bold;
    font-size: 16px;
  }
  .title-area {
    text-align: center;
    flex: 1;
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .subtitle {
      margin: 5px 0 0;
      font-size: 10px;
      color: #666;
      letter-spacing: 2px;
    }
  }
  .meta-area {
    font-size: 12px;
    text-align: right;
    .meta-item {
      margin-bottom: 2px;
    }
    .label {
      color: #666;
    }
    .value {
      font-weight: bold;
    }
  }
}

.summary-box {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 5px solid #1890ff;

  .summary-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .summary-content {
    font-size: 14px;
    line-height: 1.6;
    text-align: justify;
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  background: #eee;
  padding: 5px 10px;
}

.chart-section {
  margin-bottom: 20px;

  .chart-row {
    display: flex;
    gap: 20px;
    height: 330px;

    &.single {
      height: 330px;
    }

    .chart-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      padding: 10px;

      h4 {
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 14px;
      }
      .chart-wrapper {
        flex: 1;
      }
    }
  }
}

.table-wrapper {
  flex: 1;
}

.list-wrapper {
  flex: 1;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  border: 1px solid #e8e8e8;
  padding: 15px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  page-break-inside: avoid;
  break-inside: avoid;

  .item-title-row {
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .word-tag {
    font-weight: bold;
    color: #1890ff;
    &.major {
      color: #f5222d;
    }
  }

  .item-title-text {
    font-weight: bold;
    font-size: 15px;
    color: #333;
  }

  .item-meta {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    border-bottom: 1px dashed #eee;
    padding-bottom: 10px;

    .label {
      color: #999;
    }
    .divider {
      color: #eee;
    }
  }

  .item-desc {
    font-size: 13px;
    color: #555;
    background: #fafafa;
    padding: 10px;
    border-radius: 2px;
    line-height: 1.6;
    border: 1px solid #f0f0f0;

    .desc-label {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .desc-content {
      text-align: justify;
    }
  }
}

.print-break {
  height: 20px;
  page-break-after: always;
}

.report-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #999;
  font-size: 12px;
}

@media print {
  .no-print {
    display: none;
  }
  .report-container {
    padding: 0;
    background: white;
  }
  .a4-page {
    box-shadow: none;
    margin: 0;
    // Reset page-break for the container, let content flow naturally
    page-break-after: auto;

    // Ensure the container itself doesn't force a huge height
    height: auto !important;
    min-height: 0 !important;
  }

  // Explicit page breaks where we put the divider
  .print-break {
    height: 0;
    margin: 0;
    page-break-after: always;
    break-after: page;
  }

  .chart-section,
  .summary-box {
    page-break-inside: avoid;
  }
}
</style>

<style lang="less">
/* Global print styles to override layout limitations */
@media print {
  html,
  body,
  #app {
    height: auto !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Hide all elements by default */
  body * {
    visibility: hidden;
  }

  /* Only show the report container and its children */
  .report-container,
  .report-container * {
    visibility: visible;
  }

  /* Position the report container at the top-left of the page */
  .report-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background: white;
  }

  /* Ensure the A4 page wrapper behaves correctly */
  .a4-page {
    margin: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
  }

  /* Hide the Ant Design popup/modal container if it exists */
  .ant-drawer,
  .ant-modal-root {
    display: none !important;
  }
}
</style>
