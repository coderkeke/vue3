<template>
  <div class="report-header">
    <div class="header-content">
      <h1 class="title">隐患数据分析报告</h1>
      <p class="subtitle">全面 · 深入 · 智能 · 实时</p>
      <div class="report-meta">
        <span class="meta-item"> <CalendarOutlined /> 报告生成日期：{{ currentDate }} </span>
        <span class="meta-item"> <UserOutlined /> 生成用户：{{ currentUser }} </span>
      </div>
    </div>
    <div class="header-actions export-ignore">
      <a-button type="primary" :loading="exportLoading" @click="onExport">
        <template #icon><DownloadOutlined /></template>
        导出报告
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons-vue'

defineProps<{
  currentDate: string
  currentUser: string
  exportLoading: boolean
  onExport: () => void
}>()
</script>

<style scoped>
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.title {
  color: #fff;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 16px;
  font-size: 16px;
}

.report-meta {
  display: flex;
  gap: 24px;
  color: rgba(255, 255, 255, 0.9);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
</style>
