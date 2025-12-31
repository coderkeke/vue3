<template>
  <div class="report-section">
    <div class="section-header">
      <span class="section-icon"><PieChartOutlined /></span>
      <span class="section-title">隐患总体概况</span>
    </div>
    <div class="charts-container">
      <div class="chart-row single">
        <div class="chart-item">
          <h4>隐患类别词云</h4>
          <div class="chart-wrapper">
            <BasicChart :options="wordCloudOption" height="100%" />
          </div>
        </div>
      </div>

      <div class="chart-row" style="margin-top: 20px">
        <div class="chart-item">
          <h4>隐患级别分布</h4>
          <div class="chart-wrapper">
            <BasicChart :options="levelPieOption" height="100%" />
          </div>
        </div>
        <div class="chart-item">
          <h4>隐患来源分布</h4>
          <div class="chart-wrapper">
            <BasicChart :options="sourceBarOption" height="100%" />
          </div>
        </div>
      </div>

      <div class="chart-row single" style="margin-top: 20px">
        <div class="chart-item">
          <h4>业务属性占比</h4>
          <div class="chart-wrapper">
            <BasicChart :options="propertyPieOption" height="100%" />
          </div>
        </div>
      </div>

      <div class="chart-row single" style="margin-top: 20px">
        <div class="chart-item">
          <h4>各业态隐患分布</h4>
          <div class="chart-wrapper">
            <BasicChart :options="businessBarOption" height="100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PieChartOutlined } from '@ant-design/icons-vue'
import { BasicChart } from '@/components/Chart'
import type { ECOption } from '@/utils/echarts'

defineProps<{
  levelPieOption: ECOption | null
  sourceBarOption: ECOption | null
  wordCloudOption: ECOption | any // eslint-disable-line @typescript-eslint/no-explicit-any
  propertyPieOption: ECOption | null
  businessBarOption: ECOption | null
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

.charts-container {
  display: flex;
  flex-direction: column;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-row.single {
  grid-template-columns: 1fr;
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
