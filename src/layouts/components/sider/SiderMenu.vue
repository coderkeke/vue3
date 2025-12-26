<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting'
import AppMenu from '../common/AppMenu.vue'
import AppLogo from '../common/AppLogo.vue'

// 接收父组件传递的 collapsed 状态
defineProps<{
  collapsed: boolean
}>()

const settingStore = useSettingStore()

// 从全局配置获取主题和宽度设置
const theme = computed(() => settingStore.projectConfig.theme)
const width = computed(() => settingStore.projectConfig.layout.siderWidth)
const collapsedWidth = computed(() => settingStore.projectConfig.layout.collapsedWidth)
const navMode = computed(() => settingStore.projectConfig.navMode)
const fixSiderbar = computed(() => settingStore.projectConfig.fixSiderbar)

const siderStyle = computed(() => {
  const isFixed = fixSiderbar.value

  if (isFixed) {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 10,
      // 在混合模式下，如果侧边栏包含 Logo，则不需要 padding-top
      // 因为侧边栏是全高的
      paddingTop: 0,
    }
  }
  return {}
})
</script>

<template>
  <!-- 占位符：当固定侧边栏时，由于 position: fixed 会脱离文档流，需要一个占位元素来撑开宽度 -->
  <div
    v-if="fixSiderbar && navMode !== 'top'"
    :style="{
      width: `${collapsed ? collapsedWidth : width}px`,
      overflow: 'hidden',
      flex: `0 0 ${collapsed ? collapsedWidth : width}px`,
      maxWidth: `${collapsed ? collapsedWidth : width}px`,
      minWidth: `${collapsed ? collapsedWidth : width}px`,
      transition: 'all 0.2s',
    }"
  ></div>

  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    :theme="theme"
    :width="width"
    :collapsed-width="collapsedWidth"
    class="sider-menu"
    :style="siderStyle"
  >
    <!-- 在侧边栏模式和混合模式下显示 Logo -->
    <AppLogo v-if="navMode !== 'top'" :collapsed="collapsed" :show-title="true" :theme="theme" />
    <AppMenu :theme="theme" mode="inline" />
  </a-layout-sider>
</template>

<style scoped lang="less">
.sider-menu {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}
</style>
