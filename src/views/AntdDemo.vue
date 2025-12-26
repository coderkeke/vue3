<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useCounterStore } from '../stores/counter'
import { storeToRefs } from 'pinia'
import {
  getUserInfo,
  getLegacyOrders,
  getLegacyError,
  type UserInfo,
  type OrderItem,
} from '@/api/demo'
import { message } from 'ant-design-vue'
import { useRequest } from '@/hooks/useRequest'

// Pinia Store
const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
const { increment } = counterStore

// Ant Design Vue State
const dateValue = ref(null)
const switchChecked = ref(true)
const sliderValue = ref(30)

// ----------------------------------------------------------------------------
// 使用 useRequest Hook 简化逻辑
// ----------------------------------------------------------------------------

// 1. 获取用户信息 (自动管理 loading 和 data)
const {
  loading: userInfoLoading,
  data: userInfo,
  run: fetchUserInfo,
} = useRequest<UserInfo>(getUserInfo, {
  manual: true,
  onSuccess: (data) => {
    message.success(`标准接口调用成功: ${data.name}`)
  },
})

// 2. 获取老系统订单
const {
  loading: legacyLoading,
  data: legacyOrders,
  run: fetchLegacyData,
} = useRequest<OrderItem[]>(getLegacyOrders, {
  manual: true,
  initialData: [], // 设置初始值为空数组
  onSuccess: () => {
    message.success('老系统接口调用成功')
  },
})

// 3. 测试错误
const { run: testLegacyError } = useRequest(getLegacyError, {
  manual: true,
  onError: (e) => {
    console.log('Caught error in hook:', e)
    // 拦截器已经报过错了，这里不需要重复 message.error
  },
})

// 合并 loading 状态给按钮使用 (可选)
// 也可以分别绑定，这里为了简单直接复用原有的 loading 变量名逻辑，但要注意它是 Ref
// 为了演示，我们在 template 里分别使用 userInfoLoading 和 legacyLoading
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
            <a-space direction="vertical" style="width: 100%">
              <a-space>
                <a-button type="primary" :loading="userInfoLoading" @click="fetchUserInfo">
                  获取标准数据
                </a-button>
                <a-button :loading="legacyLoading" @click="fetchLegacyData">
                  获取老系统数据
                </a-button>
                <a-button danger @click="testLegacyError"> 测试错误处理</a-button>
              </a-space>

              <div v-if="userInfo" class="info-box">
                <h4>标准后端数据 (UserCenter):</h4>
                <p>Name: {{ userInfo.name }}</p>
                <p>Source: {{ userInfo.source }}</p>
                <a-avatar :src="userInfo.avatar" />
              </div>

              <div v-if="legacyOrders && legacyOrders.length" class="info-box">
                <h4>老系统数据 (Legacy):</h4>
                <ul>
                  <li v-for="order in legacyOrders" :key="order.id">
                    {{ order.name }} - ${{ order.price }}
                  </li>
                </ul>
              </div>
            </a-space>
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
