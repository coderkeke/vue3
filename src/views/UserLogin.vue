<template>
  <div class="login-container">
    <a-card title="系统登录" class="login-card">
      <DynamicForm
        ref="dynamicFormRef"
        v-model:model="formState"
        :schemas="schemas"
        layout="vertical"
      >
        <template #action>
          <a-button type="primary" block :loading="loading" size="large" @click="handleSubmit">
            登录
          </a-button>
        </template>
      </DynamicForm>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { DynamicForm, type FormSchema } from '@/components/DynamicForm'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const dynamicFormRef = ref()

const formState = reactive({
  username: '',
  password: '',
})

const schemas: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    rules: [{ required: true, message: '请输入用户名' }],
    componentProps: {
      placeholder: '请输入用户名',
      allowClear: true,
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'Password',
    rules: [{ required: true, message: '请输入密码' }],
    componentProps: {
      placeholder: '请输入密码',
      allowClear: true,
    },
  },
  {
    field: 'action',
    label: ' ',
    slot: 'action',
    colProps: { span: 24 },
  },
]

const handleSubmit = async () => {
  try {
    await dynamicFormRef.value.validate()
    loading.value = true
    await userStore.login(formState)
    message.success('登录成功')
    const { redirect } = route.query
    router.push((redirect as string) || '/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}
.login-card {
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
