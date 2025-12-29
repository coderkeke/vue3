<template>
  <div class="p-4">
    <a-card title="Dynamic Form Demo" :bordered="false">
      <DynamicForm
        ref="dynamicFormRef"
        v-model:model="formData"
        :schemas="schemas"
        @submit="handleSubmit"
      >
        <template #customSlot="{ model, field }">
          <div style="display: flex; gap: 8px">
            <a-input v-model:value="model[field]" placeholder="Custom Slot Input" />
            <a-button type="primary">Action</a-button>
          </div>
        </template>
      </DynamicForm>

      <div class="actions" style="margin-top: 16px; text-align: center">
        <a-space>
          <a-button type="primary" @click="handleSubmit">提交 (Validate)</a-button>
          <a-button @click="handleReset">重置 (Reset)</a-button>
          <a-button @click="handleSet">设置数据 (Set Values)</a-button>
        </a-space>
      </div>

      <div style="margin-top: 24px; background: #f5f5f5; padding: 16px">
        <pre>{{ formData }}</pre>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DynamicForm, type FormSchema } from '@/components/DynamicForm'

// 模拟异步请求
const fetchOptionsApi = () => {
  return new Promise<{ label: string; value: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '异步选项1', value: 'opt1' },
        { label: '异步选项2', value: 'opt2' },
        { label: '异步选项3', value: 'opt3' },
      ])
    }, 1500)
  })
}

interface FormData {
  name?: string
  age?: number
  role?: string
  department?: string
  subscribe?: boolean
  tags?: string[]
  province?: string
  city?: string
  asyncSelect?: string
  custom?: string
  [key: string]: unknown
}

const dynamicFormRef = ref()
const formData = reactive<FormData>({})

// 模拟省市数据
const provinceData = [
  { label: '浙江', value: 'zhejiang' },
  { label: '江苏', value: 'jiangsu' },
]
const cityData: Record<string, { label: string; value: string }[]> = {
  zhejiang: [
    { label: '杭州', value: 'hangzhou' },
    { label: '宁波', value: 'ningbo' },
  ],
  jiangsu: [
    { label: '南京', value: 'nanjing' },
    { label: '苏州', value: 'suzhou' },
  ],
}

const schemas = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: { span: 12 },
    rules: [{ required: true, message: '请输入姓名' }],
    componentProps: {
      placeholder: '请输入您的姓名',
    },
  },
  {
    field: 'age',
    label: '年龄',
    component: 'InputNumber',
    colProps: { span: 12 },
    componentProps: {
      min: 1,
      max: 120,
    },
  },
  {
    field: 'role',
    label: '角色',
    component: 'Select',
    colProps: { span: 24 },
    defaultValue: 'user',
    componentProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ],
    },
  },
  {
    field: 'department',
    label: '部门 (联动)',
    component: 'Input',
    colProps: { span: 24 },
    // 只有当 role 是 admin 时才显示
    show: ({ model }) => model.role === 'admin',
    rules: [{ required: true, message: '管理员必须填写部门' }],
  },
  {
    field: 'subscribe',
    label: '订阅简报',
    component: 'Switch',
    colProps: { span: 12 },
    defaultValue: true,
  },
  {
    field: 'tags',
    label: '兴趣标签',
    component: 'CheckboxGroup',
    colProps: { span: 24 },
    componentProps: {
      options: [
        { label: '编程', value: 'coding' },
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
      ],
    },
  },
  {
    field: 'province',
    label: '省份 (联动源)',
    component: 'Select',
    colProps: { span: 12 },
    componentProps: {
      options: provinceData,
      onChange: () => {
        // 清空城市
        formData.city = undefined
      },
    },
  },
  {
    field: 'city',
    label: '城市 (联动目标)',
    component: 'Select',
    colProps: { span: 12 },
    // 使用函数式 componentProps 实现联动
    componentProps: ({ model }) => {
      const province = model.province as string
      const options = province ? cityData[province] || [] : []
      return {
        options,
        placeholder: province ? '请选择城市' : '请先选择省份',
      }
    },
  },
  {
    field: 'asyncSelect',
    label: '异步加载选项',
    component: 'Select',
    colProps: { span: 24 },
    componentProps: {
      options: [], // 初始为空
      loading: false,
    },
  },
  {
    field: 'custom',
    label: '自定义插槽',
    slot: 'customSlot',
    colProps: { span: 24 },
  },
])

const handleSubmit = async () => {
  try {
    await dynamicFormRef.value.validate()
    message.success('验证通过！数据已打印在下方')
    console.log('Form Data:', formData)
  } catch (error) {
    message.error('验证失败，请检查表单' + error)
  }
}

const handleReset = () => {
  dynamicFormRef.value.resetFields()
}

const handleSet = () => {
  formData.name = 'Trae User'
  formData.role = 'admin'
  formData.age = 25
  formData.province = 'zhejiang'
  // 注意：如果是联动数据，设置完源数据后，可能需要手动触发或直接设置目标数据
  // 因为 componentProps 是渲染时计算的，数据设置进去后，下次渲染会自动计算出正确的 options
  formData.city = 'hangzhou'
}

onMounted(async () => {
  // 演示异步加载选项
  const asyncSchema = schemas.find((item) => item.field === 'asyncSelect')
  if (asyncSchema) {
    // 设置 loading 状态 (如果是 reactive 对象可以直接修改)
    asyncSchema.componentProps = { loading: true, options: [] }

    try {
      const data = await fetchOptionsApi()
      // 更新 options
      asyncSchema.componentProps = { loading: false, options: data }
    } catch (error) {
      asyncSchema.componentProps = { loading: false, options: [] }
      console.error(error)
    }
  }
})
</script>

<style scoped>
.p-4 {
  padding: 16px;
}
</style>
