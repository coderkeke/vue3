<template>
  <div class="report-section detail-list">
    <div class="section-header">
      <span class="section-icon"><TableOutlined /></span>
      <span class="section-title">重点关注隐患清单 (重大隐患)</span>
    </div>
    <div class="table-wrapper">
      <a-table
        :data-source="majorTableData"
        :columns="columns"
        :pagination="false"
        size="small"
        row-key="id"
        :scroll="{ x: 1000 }"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === '隐患级别'">
            <a-tag :color="getLevelColor(text)">{{ text }}</a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TableOutlined } from '@ant-design/icons-vue'
import type { ReportItem } from '../composables/useReportData'

defineProps<{
  majorTableData: ReportItem[]
}>()

const getLevelColor = (level: string) => {
  if (level === '重大隐患') return 'red'
  if (level === '较大隐患') return 'orange'
  if (level === '一般隐患') return 'blue'
  return 'default'
}

const columns = [
  { title: '隐患名称', dataIndex: '隐患名称', key: '隐患名称', width: 200, ellipsis: true },
  { title: '隐患级别', dataIndex: '隐患级别', key: '隐患级别', width: 100 },
  { title: '发现时间', dataIndex: '发现时间', key: '发现时间', width: 120 },
  {
    title: '整改责任单位',
    dataIndex: '整改责任单位',
    key: '整改责任单位',
    width: 150,
    ellipsis: true,
  },
  { title: '隐患总类别', dataIndex: '隐患总类别', key: '隐患总类别', width: 120, ellipsis: true },
  { title: '具体要求', dataIndex: '具体要求', key: '具体要求', ellipsis: true },
]
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

.detail-list {
  page-break-before: always;
}
</style>
