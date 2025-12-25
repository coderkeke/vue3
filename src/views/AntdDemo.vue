<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'
import { storeToRefs } from 'pinia'
import request from '../utils/request'
import { message } from 'ant-design-vue'

// Pinia Store
const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
const { increment } = counterStore

// Ant Design Vue State
const dateValue = ref(null)
const switchChecked = ref(true)
const sliderValue = ref(30)

// Mock API Test
const userInfo = ref(null)
const loading = ref(false)

const fetchUserInfo = async () => {
  loading.value = true
  try {
    const res = await request.get('/user/info')
    userInfo.value = res.data
    message.success('获取 Mock 数据成功')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="antd-container">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="Ant Design Vue & Pinia"
      sub-title="演示页面"
      @back="$router.back()"
    />

    <div class="content">
      <a-row :gutter="16">
        <a-col :span="12">
          <!-- Pinia Demo Section -->
          <a-card title="Pinia 状态管理" class="card-section">
            <p>Count: {{ count }}</p>
            <p>Double: {{ doubleCount }}</p>
            <a-button type="primary" @click="increment">Pinia Increment</a-button>
          </a-card>

          <!-- Mock API Demo Section -->
          <a-card title="Mock API 测试" class="card-section">
            <a-button type="primary" :loading="loading" @click="fetchUserInfo"
              >获取 Mock 用户信息</a-button
            >
            <div v-if="userInfo" style="margin-top: 16px">
              <p>Name: {{ userInfo.name }}</p>
              <p>Roles: {{ userInfo.roles.join(', ') }}</p>
              <a-avatar :src="userInfo.avatar" />
            </div>
          </a-card>
        </a-col>

        <a-col :span="12">
          <!-- Ant Design Vue Components Section -->
          <a-card title="Ant Design Vue 组件" class="card-section">
            <div class="component-row">
              <label>Button:</label>
              <a-space>
                <a-button type="primary">Primary</a-button>
                <a-button>Default</a-button>
              </a-space>
            </div>

            <div class="component-row">
              <label>Switch:</label>
              <div class="control-wrapper">
                <a-switch v-model:checked="switchChecked" />
              </div>
            </div>

            <div class="component-row">
              <label>DatePicker:</label>
              <div class="control-wrapper">
                <a-date-picker v-model:value="dateValue" style="width: 100%" />
              </div>
            </div>

            <div class="component-row">
              <label>Slider:</label>
              <div class="control-wrapper">
                <a-slider v-model:value="sliderValue" />
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped lang="less">
.antd-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-section {
  margin-bottom: 16px;
}

.component-row {
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
