<template>
  <div class="p-4">
    <div class="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <DynamicForm layout="inline" :model="searchParams" :schemas="searchSchemas">
        <template #action>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </template>
      </DynamicForm>
    </div>

    <div class="mb-4 flex justify-end">
      <a-button type="primary" @click="openAddModal">
        <PlusOutlined />
        批量添加
      </a-button>
    </div>

    <!-- Add Modal -->
    <a-modal
      v-model:open="addModalVisible"
      title="批量添加专业用词"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="addLoading"
      @ok="handleAdd"
      @cancel="closeAddModal"
    >
      <DynamicForm
        ref="addFormRef"
        :model="addForm"
        :schemas="addSchemas"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      />
    </a-modal>

    <div class="bg-white rounded-lg shadow-sm">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'enabled'">
            <a-tag :color="record.enabled ? 'success' : 'error'">
              {{ record.enabled ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-popconfirm title="确定要删除这个专业用词吗？" @confirm="handleDelete(record.id)">
              <a-button type="link" danger size="small">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ProfessionalTermsManagement',
})
import { ref, onMounted, reactive } from 'vue'
import {
  getProfessionalTermsPage,
  addProfessionalTermsBatch,
  deleteProfessionalTerm,
  type ProfessionalTerm,
} from '@/api/analysis/professional-terms'
import type { TablePaginationConfig, TableColumnType } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { DynamicForm, type FormSchema } from '@/components/DynamicForm'

const tableLoading = ref(false)
const addLoading = ref(false)
const addModalVisible = ref(false)
const tableData = ref<ProfessionalTerm[]>([])
const addFormRef = ref()

// Search Params
const searchParams = reactive({
  keyword: '',
  category: '',
})

// Search Form Schema
const searchSchemas: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键词',
    component: 'Input',
    componentProps: { placeholder: '请输入关键词', allowClear: true },
    colProps: { span: 8 },
  },
  {
    field: 'category',
    label: '分类',
    component: 'Input',
    componentProps: { placeholder: '请输入分类', allowClear: true },
    colProps: { span: 8 },
  },
  {
    field: 'action',
    component: 'Input', // Dummy component, using slot
    slot: 'action',
    colProps: { span: 8 },
  },
]

// Add Form
const addForm = reactive({
  terms: '',
  category: '',
  description: '',
})

// Add Form Schema
const addSchemas: FormSchema[] = [
  {
    field: 'terms',
    label: '专业用词',
    component: 'TextArea',
    componentProps: {
      rows: 4,
      placeholder: '请输入专业用词，多个词用英文逗号分隔。例如：安全风险,安全隐患',
    },
    rules: [{ required: true, message: '请输入专业用词' }],
    colProps: { span: 24 },
  },
  {
    field: 'category',
    label: '分类',
    component: 'Input',
    componentProps: { placeholder: '请输入分类（可选）' },
    colProps: { span: 24 },
  },
  {
    field: 'description',
    label: '描述',
    component: 'TextArea',
    componentProps: { rows: 2, placeholder: '请输入描述（可选）' },
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
    title: '专业用词',
    dataIndex: 'term',
    key: 'term',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    key: 'enabled',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
  },
]

const fetchTableData = async (page = 1, pageSize = 10) => {
  tableLoading.value = true
  try {
    const res = await getProfessionalTermsPage({
      page: page,
      size: pageSize,
      keyword: searchParams.keyword,
      category: searchParams.category,
    })

    // res is UnifiedResponse<ProfessionalTermPageResult>
    const result = res.data

    if (result && Array.isArray(result.data)) {
      tableData.value = result.data
      pagination.total = result.total || 0
      pagination.current = page
      pagination.pageSize = pageSize
    } else {
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取专业用词列表失败:', error)
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  fetchTableData(1, pagination.pageSize)
}

const handleReset = () => {
  searchParams.keyword = ''
  searchParams.category = ''
  handleSearch()
}

const handleTableChange = (pag: TablePaginationConfig) => {
  fetchTableData(pag.current || 1, pag.pageSize || 10)
}

const openAddModal = () => {
  addForm.terms = ''
  addForm.category = ''
  addForm.description = ''
  addModalVisible.value = true
}

const closeAddModal = () => {
  addModalVisible.value = false
}

const handleAdd = async () => {
  // Validate form
  if (addFormRef.value) {
    try {
      await addFormRef.value.validate()
    } catch (e) {
      console.log(e)
      return // Validation failed
    }
  }

  addLoading.value = true
  try {
    await addProfessionalTermsBatch({
      terms: addForm.terms,
      category: addForm.category,
      description: addForm.description,
    })
    message.success('添加成功')
    closeAddModal()
    fetchTableData(1, pagination.pageSize)
  } catch (error) {
    console.error('添加专业用词失败:', error)
  } finally {
    addLoading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteProfessionalTerm(id)
    message.success('删除成功')
    fetchTableData(pagination.current, pagination.pageSize)
  } catch (error) {
    console.error('删除专业用词失败:', error)
  }
}

onMounted(() => {
  fetchTableData()
})
</script>

<style scoped></style>
