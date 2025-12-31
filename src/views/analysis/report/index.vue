<template>
  <div class="report-container">
    <div class="report-content" ref="reportRef">
      <!-- 2. Filters -->
      <a-card class="filter-card export-ignore" :bordered="false" :loading="filterLoading">
        <DynamicForm
          v-if="schemas.length"
          :schemas="schemas"
          :model="selectedFilters"
          :label-width="100"
          :action-col-options="{ span: 24 }"
        >
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

      <!-- 1. Report Header -->
      <ReportHeader
        :current-date="currentDate"
        :current-user="currentUser"
        :export-loading="exportLoading"
        :on-export="exportReport"
      />

      <!-- 3. Report Summary -->
      <ReportSummary
        :total-count="totalCount"
        :major-count="majorCount"
        :top-business="topBusiness"
        :top-category="topCategory"
      />

      <!-- 4. General Overview -->
      <GeneralOverview
        :level-pie-option="levelPieOption"
        :source-bar-option="sourceBarOption"
        :word-cloud-option="wordCloudOption"
        :property-pie-option="propertyPieOption"
        :business-bar-option="businessBarOption"
      />

      <!-- 5. Trend Analysis -->
      <TrendAnalysis :trend-line-option="trendLineOption" />

      <!-- 6. Unit Ranking -->
      <UnitRanking :unit-bar-option="unitBarOption" />

      <!-- 7. Category Analysis -->
      <CategoryAnalysis :category-bar-option="categoryBarOption" />

      <!-- 8. Detail List -->
      <DetailList :major-table-data="majorTableData" />

      <!-- 9. Report Footer -->
      <ReportFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'

// Composables
import { useReportFilter } from './composables/useReportFilter'
import { useReportData } from './composables/useReportData'

// Components
import ReportHeader from './components/ReportHeader.vue'
import ReportSummary from './components/ReportSummary.vue'
import GeneralOverview from './components/GeneralOverview.vue'
import TrendAnalysis from './components/TrendAnalysis.vue'
import UnitRanking from './components/UnitRanking.vue'
import CategoryAnalysis from './components/CategoryAnalysis.vue'
import DetailList from './components/DetailList.vue'
import ReportFooter from './components/ReportFooter.vue'

defineOptions({
  name: 'AnalysisReport',
})

const reportRef = ref<HTMLElement | null>(null)
const exportLoading = ref(false)
const currentDate = dayjs().format('YYYY年MM月DD日')
const currentUser = '安全管理员'

// 1. Initialize Logic
const {
  filterLoading,
  schemas,
  selectedFilters,
  searchParams,
  fetchFilterData,
  handleSearch,
  handleReset,
} = useReportFilter(() => refreshAllData())

const {
  totalCount,
  majorCount,
  topBusiness,
  topCategory,
  wordCloudOption,
  levelPieOption,
  sourceBarOption,
  businessBarOption,
  propertyPieOption,
  trendLineOption,
  unitBarOption,
  categoryBarOption,
  majorTableData,
  refreshAllData,
} = useReportData(searchParams)

// 2. Export Logic
const exportReport = async () => {
  if (!reportRef.value) return
  exportLoading.value = true
  try {
    // 1. Clone the report element
    const clone = reportRef.value.cloneNode(true) as HTMLElement

    // 2. Remove elements with 'export-ignore' class
    const ignoredElements = clone.querySelectorAll('.export-ignore')
    ignoredElements.forEach((el) => el.remove())

    // 3. Handle Charts (Canvas to Image)
    // Find all chart containers in the original live DOM
    const liveChartContainers = reportRef.value.querySelectorAll('.chart-inner')
    // Find all chart containers in the clone
    const clonedChartContainers = clone.querySelectorAll('.chart-inner')

    // Replace canvas with image in clone
    for (let i = 0; i < liveChartContainers.length; i++) {
      const liveContainer = liveChartContainers[i]
      const clonedContainer = clonedChartContainers[i]
      if (!liveContainer || !clonedContainer) continue

      const canvas = liveContainer.querySelector('canvas')

      if (canvas instanceof HTMLCanvasElement && clonedContainer) {
        const dataURL = canvas.toDataURL('image/png')
        // 创建图片元素
        const img = document.createElement('img')
        img.src = dataURL
        img.style.width = '100%'
        // 清空克隆容器并添加图片
        clonedContainer.innerHTML = ''
        clonedContainer.appendChild(img)
      }
    }

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
             body { font-family: 'SimSun', serif; }
             h1 { text-align: center; font-size: 24px; color: #333; }
             .report-section { margin-bottom: 30px; }
             table { width: 100%; border-collapse: collapse; }
             th, td { border: 1px solid #000; padding: 8px; text-align: left; }
             img { max-width: 100%; }
          </style>
        </head>
        <body>
          ${clone.innerHTML}
        </body>
      </html>
    `
    const blob = (await asBlob(content, {
      orientation: 'portrait',
      margins: { top: 720, right: 720, bottom: 720, left: 720 },
    })) as Blob
    // 4. 触发下载
    saveAs(blob, `隐患数据分析报告_${currentDate}.docx`)
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    exportLoading.value = false
  }
}

// 3. Lifecycle
onMounted(async () => {
  await fetchFilterData()
  await refreshAllData()
})
</script>

<style scoped>
.report-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}

.report-content {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 8px;
}
</style>
