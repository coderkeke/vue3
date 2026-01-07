<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <DynamicForm :model="searchParams" :schemas="searchSchemas">
        <template #action>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </template>
      </DynamicForm>
    </div>

    <div class="bg-white rounded-lg shadow-sm">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="pagination"
        row-key="keyword"
        @change="handleTableChange"
      >
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'WordCloudManagement',
})
import { ref, onMounted, reactive } from 'vue'
import { getWordCloudPage, type WordCloudItem } from '@/api/analysis/word-cloud'
import type { TablePaginationConfig, TableColumnType } from 'ant-design-vue'
import { DynamicForm, type FormSchema } from '@/components/DynamicForm'

const tableLoading = ref(false)
const tableData = ref<WordCloudItem[]>([])

// Search Params
const searchParams = reactive({
  minFrequency: 0,
})

// Search Form Schema
const searchSchemas: FormSchema[] = [
  {
    field: 'action',
    component: 'Input', // Dummy component, using slot
    slot: 'action',
    colProps: { span: 24 },
  },
]

const pagination = reactive<TablePaginationConfig>({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const columns: TableColumnType[] = [
  {
    title: '序号',
    key: 'index',
    width: 80,
    customRender: ({ index }) => {
      return ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1
    },
  },
  {
    title: '关键词',
    dataIndex: 'keyword',
    key: 'keyword',
    minWidth: 300,
  },
  {
    title: '词频',
    dataIndex: 'frequency',
    key: 'frequency',
    sorter: true,
    width: 300,
  },
]

const fetchTableData = async (page = 1, pageSize = 10, sortField?: string, sortOrder?: string) => {
  tableLoading.value = true
  try {
    const res = await getWordCloudPage({
      page: page,
      size: pageSize,
      minFrequency: searchParams.minFrequency,
      orderBy: sortField || 'frequency',
      orderDir: sortOrder === 'ascend' ? 'asc' : 'desc',
    })

    const result = res.data

    if (result && Array.isArray(result.data)) {
      tableData.value = result.data
      if (result.pagination) {
        pagination.total = result.pagination.totalCount
        pagination.current = result.pagination.currentPage
        pagination.pageSize = result.pagination.pageSize
      }
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取词云数据失败:', error)
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  fetchTableData(1, pagination.pageSize)
}

const handleReset = () => {
  handleSearch()
}

const handleTableChange = (
  pag: TablePaginationConfig,
  filters: Record<string, unknown>,
  sorter: { field: string; order: string },
) => {
  const sortField = sorter.field
  const sortOrder = sorter.order
  fetchTableData(pag.current || 1, pag.pageSize || 10, sortField, sortOrder)
}

onMounted(() => {
  fetchTableData()
})
</script>

<style scoped></style>
