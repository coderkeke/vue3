import { ref } from 'vue'
import { getFilterOptions, type FilterData } from '@/api/analysis'
import type { FormSchema } from '@/components/DynamicForm/types'

export function useReportFilter(onSearch?: () => void) {
  const filterLoading = ref(false)
  const schemas = ref<FormSchema[]>([])
  const selectedFilters = ref<Record<string, unknown>>({})
  const searchParams = ref<Record<string, unknown>>({})

  const fetchFilterData = async () => {
    filterLoading.value = true
    try {
      const res = await getFilterOptions()
      const filterData = res.data as unknown as FilterData

      if (filterData && filterData.success && filterData.summary) {
        const newSchemas: FormSchema[] = []

        filterData.summary.fieldSummaries.forEach((fieldSummary) => {
          const col = fieldSummary.fieldName
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
      filterLoading.value = false
    }
  }

  const handleSearch = () => {
    const conditions: Record<string, unknown> = {}
    Object.keys(selectedFilters.value).forEach((key) => {
      const val = selectedFilters.value[key]
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val) && val.length === 0) return
        conditions[key] = val
      }
    })
    searchParams.value = conditions
    // Refresh data
    if (onSearch) onSearch()
  }

  const handleReset = () => {
    Object.keys(selectedFilters.value).forEach((key) => {
      selectedFilters.value[key] = undefined
    })
    searchParams.value = {}
    // Refresh data
    if (onSearch) onSearch()
  }

  return {
    filterLoading,
    schemas,
    selectedFilters,
    searchParams,
    fetchFilterData,
    handleSearch,
    handleReset,
  }
}
