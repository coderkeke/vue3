<template>
  <div class="report-section">
    <div class="section-header">
      <span class="section-icon"><LineChartOutlined /></span>
      <span class="section-title">隐患趋势分析</span>
    </div>
    <div class="chart-item single-chart">
      <h4>近30天隐患发现趋势</h4>
      <div class="chart-wrapper">
        <BasicChart :options="trendLineOption" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChartOutlined } from '@ant-design/icons-vue'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

defineProps<{
  trendLineOption: ECOption | null
}>()
</script>

<style scoped>
.report-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-icon {
  font-size: 24px;
  color: #1890ff;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.chart-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-item h4 {
  margin-bottom: 16px;
  font-weight: 600;
  color: #262626;
  text-align: center;
  font-size: 16px;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
}
</style>
