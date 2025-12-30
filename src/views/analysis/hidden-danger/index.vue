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
      <a-card title="图表展示">
        <!-- 第一行: 级别(柱) & 类别(柱) -->
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12">
            <LevelBarChart :conditions="searchParams" />
          </a-col>
          <a-col :xs="24" :md="12">
            <CategoryBarChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第二行: 来源(饼) & 业务属性(饼) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :md="12">
            <SourcePieChart :conditions="searchParams" />
          </a-col>
          <a-col :xs="24" :md="12">
            <PropertyPieChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第三行: 业态(条形) & 整改单位(折线) -->
        <a-row :gutter="[16, 16]" class="mt-4">
          <a-col :xs="24" :lg="12">
            <BusinessBarChart :conditions="searchParams" />
          </a-col>
          <a-col :xs="24" :lg="12">
            <UnitLineChart :conditions="searchParams" />
          </a-col>
        </a-row>

        <!-- 第四行: 发现时间(堆叠柱) -->
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

import LevelBarChart from './components/LevelBarChart.vue'
import CategoryBarChart from './components/CategoryBarChart.vue'
import SourcePieChart from './components/SourcePieChart.vue'
import PropertyPieChart from './components/PropertyPieChart.vue'
import BusinessBarChart from './components/BusinessBarChart.vue'
import UnitLineChart from './components/UnitLineChart.vue'
import TimeStackBarChart from './components/TimeStackBarChart.vue'

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
