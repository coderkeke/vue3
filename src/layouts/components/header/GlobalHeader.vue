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
const fixedHeader = computed(() => settingStore.projectConfig.fixedHeader)
const width = computed(() => settingStore.projectConfig.layout.siderWidth)
const collapsedWidth = computed(() => settingStore.projectConfig.layout.collapsedWidth)

const isSideOrMix = computed(() => navMode.value === 'side' || navMode.value === 'mix')

import type { CSSProperties } from 'vue'

const headerStyle = computed(() => {
  const isTop = navMode.value === 'top'
  const isMix = navMode.value === 'mix'
  const isDark = theme.value === 'dark'
  // 顶部导航模式或混合模式下，如果是深色主题，则头部背景为深色
  const isHeaderDark = (isTop || isMix) && isDark

  const bg = isHeaderDark ? '#001529' : '#fff'
  const color = isHeaderDark ? '#fff' : 'rgba(0, 0, 0, 0.85)'

  const style: CSSProperties = {
    background: bg,
    color: color,
    padding: 0,
    height: `${headerHeight.value}px`,
    lineHeight: `${headerHeight.value}px`,
    width: '100%',
    zIndex: 19,
  }

  // 固定头部处理
  if (fixedHeader.value) {
    style.position = 'fixed'
    style.top = 0
    style.right = 0
    style.zIndex = 19

    // 如果是侧边栏模式或混合模式，头部宽度需要减去侧边栏宽度
    if (isSideOrMix.value) {
      style.width = `calc(100% - ${settingStore.projectConfig.collapsed ? collapsedWidth.value : width.value}px)`
      style.transition = 'width 0.2s'
    } else {
      style.width = '100%'
    }
  }

  return style
})
</script>

<template>
  <!-- 占位符：固定头部时需要占位 -->
  <div v-if="fixedHeader" class="header-placeholder" :style="{ height: `${headerHeight}px` }"></div>

  <a-layout-header class="global-header" :style="headerStyle">
    <!-- 侧边栏模式下的折叠按钮 -->
    <div v-if="isSideOrMix" class="header-trigger" @click="emit('toggle')">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>

    <!-- 顶部导航模式或混合模式下的 Logo -->
    <div v-if="navMode === 'top'" class="header-logo">
      <AppLogo :show-title="true" :theme="theme" />
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
.header-placeholder {
  width: 100%;
  transition:
    background 0.3s,
    width 0.2s;
  flex-shrink: 0; // 防止在 flex 容器中被压缩
}

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
