<template>
  <div class="p-4">
    <a-card title="ECharts 公共组件演示" :bordered="false">
      <a-space direction="vertical" style="width: 100%" size="large">
        <!-- Dataset 模式演示 -->
        <a-card title="Dataset 模式演示 (模拟后端接口)">
          <a-space class="mb-4">
            <a-button type="primary" :loading="datasetLoading" @click="fetchDatasetData"
              >加载数据</a-button
            >
          </a-space>
          <BasicChart :options="datasetOptions" :loading="datasetLoading" height="300px" />
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { BasicChart } from '@/components/Chart'
import { getChartData } from '@/api/demo/chart'
import type { ECOption } from '@/utils/echarts'

// --- Dataset 模式数据 ---
const datasetLoading = ref(false)
const datasetOptions = ref<ECOption>({
  tooltip: { trigger: 'axis' },
  legend: {},
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  dataset: {
    source: [],
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [
    { type: 'bar', encode: { x: 'date', y: 'sales' }, name: '销售额' },
    { type: 'line', encode: { x: 'date', y: 'profit' }, name: '利润' },
  ],
})

const fetchDatasetData = async () => {
  datasetLoading.value = true
  try {
    const data = await getChartData()
    datasetOptions.value = {
      ...datasetOptions.value,
      dataset: {
        source: data,
      },
    } as ECOption
    message.success('数据加载成功')
  } catch {
    message.error('数据加载失败')
  } finally {
    datasetLoading.value = false
  }
}
</script>

<style scoped>
.p-4 {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
