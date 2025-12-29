<template>
  <div class="p-4">
    <a-card title="ECharts 公共组件演示" :bordered="false">
      <a-space direction="vertical" style="width: 100%" size="large">
        <!-- 基础柱状图 -->
        <a-card title="基础柱状图 (Canvas)">
          <BasicChart :options="barOptions" height="300px" />
        </a-card>

        <!-- 基础折线图 (SVG 渲染 + Loading) -->
        <a-card title="基础折线图 (SVG + Loading 演示)">
          <a-space class="mb-4">
            <a-button @click="toggleLoading">切换 Loading</a-button>
            <a-button @click="updateLineData">更新数据</a-button>
          </a-space>
          <BasicChart 
            :options="lineOptions" 
            :loading="loading" 
            renderer="svg" 
            height="300px" 
            @click="handleChartClick"
          />
        </a-card>

        <!-- 空状态演示 -->
        <a-card title="空状态演示">
          <a-button class="mb-4" @click="toggleEmpty">切换数据</a-button>
          <BasicChart :options="emptyOptions" height="300px">
             <template #empty>
               <a-empty description="自定义空状态插槽" />
             </template>
          </BasicChart>
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

// --- 柱状图数据 ---
const barOptions = reactive<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: { alignWithLabel: true },
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220],
    },
  ],
})

// --- 折线图数据 ---
const loading = ref(false)
const lineOptions = ref<ECOption>({
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
})

const toggleLoading = () => {
  loading.value = !loading.value
}

const updateLineData = () => {
  loading.value = true
  setTimeout(() => {
    lineOptions.value = {
      ...lineOptions.value,
      series: [
        {
          data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2000)),
          type: 'line',
          smooth: true,
        },
      ] as any,
    }
    loading.value = false
    message.success('数据已更新')
  }, 1000)
}

const handleChartClick = (params: any) => {
  message.info(`点击了: ${params.name}, 值: ${params.value}`)
}

// --- 空状态数据 ---
const emptyOptions = ref<ECOption | null>(null)

const toggleEmpty = () => {
  if (emptyOptions.value) {
    emptyOptions.value = null
  } else {
    emptyOptions.value = {
      xAxis: { type: 'category', data: ['X', 'Y', 'Z'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [1, 2, 3] }],
    }
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
