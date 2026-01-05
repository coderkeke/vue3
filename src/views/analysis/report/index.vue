<template>
  <div class="report-container">
    <div ref="reportRef" class="report-content">
      <!-- 2. Filters -->
      <a-card class="filter-card export-ignore" :bordered="false" :loading="filterLoading">
        <DynamicForm
          v-if="schemas.length"
          :schemas="schemas"
          :model="selectedFilters"
          :label-col="{ style: { width: '110px' } }"
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
        :export-loading="exportLoading"
        :on-export="() => exportReport(`隐患数据分析报告_${currentDate}.docx`)"
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
        :property-bar-option="propertyBarOption"
        :conditions="searchParams"
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
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'

// Composables
import { useReportFilter } from './composables/useReportFilter'
import { useReportData } from './composables/useReportData'
import { useReportExport } from './composables/useReportExport'

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
const currentDate = dayjs().format('YYYY年MM月DD日')

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
  propertyBarOption,
  trendLineOption,
  unitBarOption,
  categoryBarOption,
  majorTableData,
  refreshAllData,
} = useReportData(searchParams)

// 2. Export Logic
const { exportLoading, exportReport } = useReportExport(reportRef)

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
