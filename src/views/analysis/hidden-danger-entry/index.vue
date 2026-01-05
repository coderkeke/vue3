<template>
  <div class="p-4">
    <DynamicForm :model="selectedFilters" :schemas="schemas" :row-props="{ gutter: [16, 16] }">
      <template #action>
        <div class="text-right">
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </div>
      </template>
    </DynamicForm>

    <div class="my-4 flex justify-end">
      <a-button type="primary" @click="openImportModal">
        <UploadOutlined />
        导入Excel
      </a-button>
    </div>

    <!-- Import Modal -->
    <a-modal v-model:open="importModalVisible" title="导入Excel数据" :footer="null" :width="500">
      <div class="p-4">
        <div class="mb-4 flex items-center">
          <span class="mr-2">是否清除旧数据：</span>
          <a-switch v-model:checked="clearTable" checked-children="是" un-checked-children="否" />
          <span class="ml-2 text-gray-400 text-sm">
            {{ clearTable ? '将清空现有数据后导入' : '将在现有数据基础上追加' }}
          </span>
        </div>

        <a-upload-dragger
          name="file"
          :show-upload-list="false"
          :custom-request="handleUpload"
          accept=".xlsx, .xls"
          :disabled="uploadLoading"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此处上传</p>
          <p class="ant-upload-hint">支持 .xlsx, .xls 格式文件</p>
        </a-upload-dragger>
      </div>
    </a-modal>

    <div class="mt-4">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1000 }"
        @change="handleTableChange"
      >
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HiddenDangerEntry',
})
import { ref, onMounted, reactive } from 'vue'
import {
  getFilterOptions,
  getTableData,
  uploadExcelFile,
  type FilterData,
  type TableDataResponse,
} from '@/api/analysis'
import DynamicForm from '@/components/DynamicForm/DynamicForm.vue'
import type { FormSchema } from '@/components/DynamicForm/types'
import type { TablePaginationConfig, TableColumnType } from 'ant-design-vue'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const filterLoading = ref(false)
const tableLoading = ref(false)
const uploadLoading = ref(false)
const clearTable = ref(false)
const importModalVisible = ref(false)
const schemas = ref<FormSchema[]>([])
const selectedFilters = ref<Record<string, unknown>>({})
const tableData = ref<Record<string, unknown>[]>([])
const columns = ref<TableColumnType[]>([])

const pagination = reactive<TablePaginationConfig>({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 保存当前的查询条件，用于翻页
const currentConditions = ref<Record<string, unknown> | undefined>(undefined)

const fetchFilterData = async () => {
  filterLoading.value = true
  try {
    const res = await getFilterOptions()
    const filterData = res.data as unknown as FilterData

    if (filterData && filterData.success) {
      const newSchemas: FormSchema[] = []

      // 构建筛选表单
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

      // 添加操作按钮
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

      // 构建表格列
      if (filterData.allColumns) {
        columns.value = filterData.allColumns.map((col) => ({
          title: col,
          dataIndex: col,
          key: col,
          width: 150, // 默认宽度，可根据需要调整
          ellipsis: true,
        })) as TableColumnType[]
      }
    }
  } catch (error) {
    console.error('获取筛选条件失败:', error)
  } finally {
    filterLoading.value = false
  }
}

const fetchTableData = async (page = 1, pageSize = 10) => {
  tableLoading.value = true
  try {
    const offset = (page - 1) * pageSize
    const res = await getTableData({
      ...currentConditions.value,
      limit: pageSize,
      offset: offset,
    })

    const data = res.data

    // 如果返回的是 TableDataResponse 结构
    const responseData = data as TableDataResponse
    if (responseData && responseData.data) {
      tableData.value = responseData.data
      if (responseData.pagination) {
        pagination.total = responseData.pagination.totalCount || 0
      } else {
        pagination.total = 0
      }
    } else {
      tableData.value = []
      pagination.total = 0
    }

    pagination.current = page
    pagination.pageSize = pageSize
  } catch (error) {
    console.error('获取表格数据失败:', error)
  } finally {
    tableLoading.value = false
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

  // API 要求 conditions 是 JSON 字符串格式
  currentConditions.value = conditions

  // 重置分页并查询
  fetchTableData(1, pagination.pageSize)
}

const handleReset = () => {
  Object.keys(selectedFilters.value).forEach((key) => {
    selectedFilters.value[key] = undefined
  })
  currentConditions.value = undefined
  handleSearch()
}

const handleTableChange = (pag: TablePaginationConfig) => {
  fetchTableData(pag.current || 1, pag.pageSize || 10)
}

const openImportModal = () => {
  importModalVisible.value = true
  clearTable.value = false // 默认重置为不清除
}

const handleUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  uploadLoading.value = true
  try {
    await uploadExcelFile(file, clearTable.value)
    message.success('导入成功')
    onSuccess()
    // 导入成功后刷新表格数据
    fetchTableData(1, pagination.pageSize)
    importModalVisible.value = false // 关闭模态框
  } catch (error) {
    console.error('导入失败:', error)
    message.error('导入失败')
    onError(error)
  } finally {
    uploadLoading.value = false
  }
}

onMounted(() => {
  fetchFilterData()
  fetchTableData()
})
</script>

<style scoped></style>
