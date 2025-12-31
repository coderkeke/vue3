<template>
  <div class="report-section summary-section">
    <div class="section-header">
      <span class="section-icon"><FileTextOutlined /></span>
      <span class="section-title">报告摘要</span>
    </div>
    <div class="summary-cards">
      <div class="summary-card total">
        <div class="card-icon"><WarningOutlined /></div>
        <div class="card-content">
          <div class="card-label">隐患总数</div>
          <div class="card-value">{{ totalCount }}</div>
          <div class="card-desc">当前筛选范围内的隐患总量</div>
        </div>
      </div>
      <div class="summary-card danger">
        <div class="card-icon"><ThunderboltOutlined /></div>
        <div class="card-content">
          <div class="card-label">重大隐患</div>
          <div class="card-value">{{ majorCount }}</div>
          <div class="card-desc">需重点关注的高风险隐患</div>
        </div>
      </div>
      <div class="summary-card warning">
        <div class="card-icon"><EnvironmentOutlined /></div>
        <div class="card-content">
          <div class="card-label">高发业态</div>
          <div class="card-value text">{{ topBusiness }}</div>
          <div class="card-desc">隐患数量最多的业态类型</div>
        </div>
      </div>
      <div class="summary-card info">
        <div class="card-icon"><AppstoreOutlined /></div>
        <div class="card-content">
          <div class="card-label">高发类别</div>
          <div class="card-value text">{{ topCategory }}</div>
          <div class="card-desc">出现频率最高的隐患类别</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FileTextOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'

defineProps<{
  totalCount: number
  majorCount: number
  topBusiness: string
  topCategory: string
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

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.summary-card {
  padding: 24px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-card.total {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
}
.summary-card.danger {
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
}
.summary-card.warning {
  background: linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%);
}
.summary-card.info {
  background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.total .card-icon {
  color: #1890ff;
}
.danger .card-icon {
  color: #ff4d4f;
}
.warning .card-icon {
  color: #faad14;
}
.info .card-icon {
  color: #722ed1;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.2;
  margin-bottom: 8px;
}

.card-value.text {
  font-size: 20px;
}

.card-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 1200px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
