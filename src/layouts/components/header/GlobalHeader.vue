<script setup lang="ts">
import { computed } from 'vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useSettingStore } from '@/stores/setting'
import AppMenu from '../common/AppMenu.vue'
import AppLogo from '../common/AppLogo.vue'

// 接收侧边栏折叠状态
defineProps<{
  collapsed: boolean
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'open-setting'): void
}>()

// 从 Store 获取配置
const settingStore = useSettingStore()
const headerHeight = computed(() => settingStore.projectConfig.layout.headerHeight)
const navMode = computed(() => settingStore.projectConfig.navMode)
const theme = computed(() => settingStore.projectConfig.theme)

const headerStyle = computed(() => {
  const isTop = navMode.value === 'top'
  const isMix = navMode.value === 'mix'
  const isDark = theme.value === 'dark'
  // 顶部导航模式或混合模式下，如果是深色主题，则头部背景为深色
  const isHeaderDark = (isTop || isMix) && isDark

  const bg = isHeaderDark ? '#001529' : '#fff'
  const color = isHeaderDark ? '#fff' : 'rgba(0, 0, 0, 0.85)'

  return {
    background: bg,
    color: color,
    padding: 0,
    height: `${headerHeight.value}px`,
    lineHeight: `${headerHeight.value}px`,
    width: '100%',
    zIndex: 19,
  }
})
</script>

<template>
  <a-layout-header class="global-header" :style="headerStyle">
    <!-- 侧边栏模式下的折叠按钮 -->
    <div v-if="navMode === 'side'" class="header-trigger" @click="emit('toggle')">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>

    <!-- 顶部导航模式或混合模式下的 Logo -->
    <div v-if="navMode === 'top' || navMode === 'mix'" class="header-logo">
      <AppLogo :show-title="true" :theme="theme" />
    </div>

    <!-- 混合模式下的折叠按钮 (位于 Logo 右侧) -->
    <div v-if="navMode === 'mix'" class="header-trigger" @click="emit('toggle')">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>

    <!-- 顶部导航模式或混合模式下的菜单 -->
    <div class="header-menu">
      <AppMenu v-if="navMode === 'top' || navMode === 'mix'" :theme="theme" mode="horizontal" />
    </div>

    <div class="header-right">
      <div class="action-item" @click="emit('open-setting')">
        <setting-outlined />
      </div>
    </div>
  </a-layout-header>
</template>

<style scoped lang="less">
.global-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding-right: 16px; // 确保右侧有内边距
}

.header-trigger {
  display: inline-block;
  font-size: 18px;
  height: 100%;
  padding: 0 24px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #1890ff;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  // margin-right: 16px; // 移除 margin，避免与折叠按钮间距过大
}

.header-menu {
  flex: 1;
  height: 100%;
  min-width: 0;

  :deep(.ant-menu) {
    background: transparent;
    border-bottom: none;
    line-height: inherit;
    height: 100%;
  }
}

.header-right {
  display: flex;
  height: 100%;

  .action-item {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
