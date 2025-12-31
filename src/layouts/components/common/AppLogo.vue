<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting'
import logo from '@/assets/images/logo.jpg'

defineProps<{
  collapsed?: boolean
  showTitle?: boolean
  theme?: 'dark' | 'light'
}>()

const settingStore = useSettingStore()
const headerHeight = computed(() => settingStore.projectConfig.layout.headerHeight)
</script>

<template>
  <div class="logo" :class="theme" :style="{ height: `${headerHeight}px` }">
    <img :src="logo" alt="logo" />
    <h1 v-if="showTitle && !collapsed">隐患分析系统</h1>
  </div>
</template>

<style scoped lang="less">
.logo {
  padding: 0 24px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  overflow: hidden;

  img {
    height: 32px;
    width: 32px;
  }

  h1 {
    margin: 0 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
    transition: color 0.3s;
  }

  &.light {
    h1 {
      color: #001529;
    }
  }

  &.dark {
    h1 {
      color: white;
    }
  }
}
</style>
