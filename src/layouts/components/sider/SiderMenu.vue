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
</script>

<template>
  <a-layout-sider
    :collapsed="collapsed"
    :trigger="null"
    collapsible
    :theme="theme"
    :width="width"
    :collapsed-width="collapsedWidth"
    class="sider-menu"
  >
    <!-- 仅在侧边栏模式下显示 Logo -->
    <AppLogo
      v-if="navMode === 'side'"
      :collapsed="collapsed"
      :show-title="true"
      :theme="theme"
    />
    <AppMenu :theme="theme" mode="inline" />
  </a-layout-sider>
</template>

<style scoped lang="less">
.sider-menu {
  z-index: 10;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}
</style>
