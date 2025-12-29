<template>
  <div class="p-4">
    <!-- 头部筛选 -->
    <a-card :bordered="false" class="mb-4">
      <DynamicForm ref="formRef" v-model:model="searchParams" :schemas="schemas" :label-width="80">
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

    <!-- 表格展示 -->
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { DynamicForm, type FormSchema } from '@/components/DynamicForm'
import { getTableList, type TableItem, type TableParams } from '@/api/demo/table'

// 搜索参数
const searchParams = reactive<TableParams>({})
const formRef = ref()

// 表格数据
const loading = ref(false)
const tableData = ref<TableItem[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

// 表单配置
const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 6 },
    componentProps: {
      placeholder: '请输入名称',
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
      ],
      placeholder: '请选择状态',
    },
  },
  {
    field: 'action',
    label: ' ', // 空标签占位
    slot: 'action',
    component: 'Input', // 占位组件，实际会被插槽覆盖
    colProps: { span: 12 }, // 占据剩余空间
  },
]

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
]

// 获取状态颜色
const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    active: 'green',
    inactive: 'red',
    pending: 'orange',
  }
  return map[status] || 'default'
}

// 获取列表数据
const fetchData = async () => {
  loading.value = true
  try {
    const params: TableParams = {
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }
    const res = await getTableList(params)
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.current = 1 // 重置到第一页
  fetchData()
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  pagination.current = 1
  fetchData()
}

// 表格分页/排序/筛选变化
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.p-4 {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
