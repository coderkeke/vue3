<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useResizeObserver, useDebounceFn } from '@vueuse/core'
import echarts from '@/utils/echarts'
import type { ECOption } from '@/utils/echarts'
import type { EChartsType } from 'echarts/core'

const props = withDefaults(
  defineProps<{
    options: ECOption | null
    width?: string
    height?: string
    loading?: boolean
    theme?: string | object | null
    renderer?: 'canvas' | 'svg'
    resize?: boolean
    updateOptions?: {
      notMerge?: boolean
      lazyUpdate?: boolean
      silent?: boolean
      replaceMerge?: string | string[]
    }
  }>(),
  {
    width: '100%',
    height: '300px',
    loading: false,
    theme: null,
    renderer: 'canvas',
    resize: true,
    updateOptions: () => ({ notMerge: true }),
  },
)

const emit = defineEmits<{
  (e: 'init', instance: EChartsType): void
  (e: 'click', params: unknown): void
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: EChartsType | null = null

// 判断是否为空状态
const isEmpty = computed(() => {
  if (!props.options) return true
  // 这里可以根据实际情况增强判断逻辑，例如检查 series 长度
  if (Array.isArray(props.options.series) && props.options.series.length === 0) return true
  if (Object.keys(props.options).length === 0) return true
  return false
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  if (isEmpty.value) return

  // 销毁旧实例，防止重复初始化
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, props.theme, {
    renderer: props.renderer,
  })

  // 绑定事件
  chartInstance.on('click', (params) => {
    emit('click', params)
  })

  // 设置配置项
  if (props.options) {
    chartInstance.setOption(props.options)
  }

  emit('init', chartInstance)
}

// 渲染图表（包括空状态处理）
const render = () => {
  if (isEmpty.value) {
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    return
  }

  if (!chartInstance) {
    initChart()
  } else {
    // 动态切换主题或渲染器需要重新初始化，这里简单处理，若非深度变化通常直接 setOption 即可
    // 如果 options 变化，调用 setOption
    if (props.options) {
      chartInstance.setOption(props.options, props.updateOptions)
    }
  }
}

// 监听 options 变化
watch(
  () => props.options,
  () => {
    render()
  },
  { deep: true },
)

// 响应式 Resize
const handleResize = useDebounceFn(() => {
  if (chartInstance && props.resize) {
    chartInstance.resize({
      animation: {
        duration: 300,
        easing: 'cubicOut',
      },
    })
  }
}, 100)

if (props.resize) {
  useResizeObserver(chartRef, handleResize)
}

// 手动 Resize 方法
const resizeFn = () => {
  handleResize()
}

// 手动 setOption 方法
const setOption = (option: ECOption, opts?: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartInstance?.setOption(option, opts as any)
}

// 获取实例
const getInstance = () => {
  return chartInstance
}

onMounted(() => {
  nextTick(() => {
    render()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({
  getInstance,
  resize: resizeFn,
  setOption,
})
</script>

<template>
  <div class="chart-container" :style="{ width, height }">
    <!-- 加载中 -->
    <div v-if="loading" class="chart-loading">
      <slot name="loading">
        <a-spin size="large" />
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-if="isEmpty" class="chart-empty">
      <slot name="empty">
        <a-empty description="暂无数据" />
      </slot>
    </div>

    <!-- 图表容器 -->
    <div ref="chartRef" class="chart-inner" :style="{ width: '100%', height: '100%' }"></div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  overflow: hidden;
}

.chart-inner {
  width: 100%;
  height: 100%;
}

.chart-loading,
.chart-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}
</style>
