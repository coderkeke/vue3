<template>
  <div class="p-4">
    <a-card title="数据筛选" :loading="loading">
      <DynamicForm
        :model="selectedFilters"
        :schemas="schemas"
        :row-props="{ gutter: [16, 16] }"
        :label-col="{ style: { width: '130px' } }"
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

    <div class="mt-4">
      <a-card :body-style="{ backgroundColor: '#f5f5f5' }" title="图表展示">
        <!-- 第一行: 隐患类别词云 -->
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            <CategoryWordCloud :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第二行: 隐患级别(饼图) & 整改单位(折线图) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :md="12">
            <LevelPieChart :conditions="searchParams" />
          </a-col>
          <a-col :xs="24" :md="12">
            <UnitLineChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第三行: 隐患类别(折线图) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :md="24">
            <CategoryLineChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第四行: 业态分布(条形图) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :lg="24">
            <BusinessBarChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第五行: 隐患来源(条形图) & 业务属性(条形图) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :md="12">
            <SourceBarChart :conditions="searchParams" />
          </a-col>
          <a-col :xs="24" :md="12">
            <PropertyBarChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第六行: 发现时间(堆叠柱状图) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :span="24">
            <TimeStackBarChart :conditions="searchParams" />
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
import { getFilterOptions, type FilterData } from '@/api/analysis'
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'
import type { FormSchema } from '@/components/DynamicForm/types'

import LevelPieChart from './components/LevelPieChart.vue'
import CategoryLineChart from './components/CategoryLineChart.vue'
import SourceBarChart from './components/SourceBarChart.vue'
import PropertyBarChart from './components/PropertyBarChart.vue'
import BusinessBarChart from './components/BusinessBarChart.vue'
import UnitLineChart from './components/UnitLineChart.vue'
import TimeStackBarChart from './components/TimeStackBarChart.vue'
import CategoryWordCloud from './components/CategoryWordCloud.vue'

const loading = ref(false)
const schemas = ref<FormSchema[]>([])
const selectedFilters = ref<Record<string, unknown>>({})
const searchParams = ref<Record<string, unknown>>({})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getFilterOptions()
    // 根据 excelApi 的定义，res 是 UnifiedResponse，res.data 是后端返回的完整对象
    const filterData = res.data as unknown as FilterData

    if (filterData && filterData.success && filterData.summary) {
      const newSchemas: FormSchema[] = []

      // 遍历 summary.fieldSummaries 来获取字段名
      filterData.summary.fieldSummaries.forEach((fieldSummary) => {
        const col = fieldSummary.fieldName
        // 从 groupedStats 中获取对应的选项列表
        const options = filterData.groupedStats[col] || []

        newSchemas.push({
          field: col,
          label: col,
          component: 'Select',
          componentProps: {
            options: options.map((opt) => {
              const labelStr = opt.field_value
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

onMounted(() => {
  fetchData()
})

const handleSearch = () => {
  const conditions: Record<string, unknown> = {}
  Object.keys(selectedFilters.value).forEach((key) => {
    const val = selectedFilters.value[key]
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val) && val.length === 0) return
      conditions[key] = val
    }
  })
  console.log('Search Params:', conditions)
  searchParams.value = conditions
}

const handleReset = () => {
  Object.keys(selectedFilters.value).forEach((key) => {
    selectedFilters.value[key] = undefined
  })
  searchParams.value = {}
}
</script>

<style scoped></style>
