<script setup lang="ts">
import { computed, ref } from 'vue'
import SiderMenu from './components/sider/SiderMenu.vue'
import GlobalHeader from './components/header/GlobalHeader.vue'
import GlobalFooter from './components/common/GlobalFooter.vue'
import SettingDrawer from './components/common/SettingDrawer.vue'
import { useSettingStore } from '@/stores/setting'

// 使用全局配置 Store
const settingStore = useSettingStore()
// 从 Store 获取侧边栏折叠状态
const collapsed = computed(() => settingStore.projectConfig.collapsed)
// 从 Store 获取导航模式
const navMode = computed(() => settingStore.projectConfig.navMode)

// 设置抽屉的显示状态
const settingDrawerOpen = ref(false)

// 切换侧边栏状态的方法
const toggleCollapsed = () => {
  settingStore.toggleCollapsed()
}

// 打开设置抽屉
const openSettingDrawer = () => {
  settingDrawerOpen.value = true
}
</script>

<template>
  <a-layout class="layout-container">
    <!-- 侧边栏 (Side) 和 混合模式 (Mix) 下显示侧边栏 -->
    <!-- 顶部模式 (Top) 下隐藏侧边栏 -->
    <SiderMenu v-if="navMode !== 'top'" :collapsed="collapsed" />

    <a-layout class="layout-content-wrapper">
      <div class="layout-scroll-container">
        <!-- Header -->
        <GlobalHeader
          :collapsed="collapsed"
          @toggle="toggleCollapsed"
          @open-setting="openSettingDrawer"
        />

        <!-- Content -->
        <div class="layout-body">
          <a-layout-content
            :style="{
              padding: '24px',
              background: '#fff',
              minHeight: '280px',
              marginBottom: '24px',
            }"
          >
            <router-view />
          </a-layout-content>
          <GlobalFooter />
        </div>
      </div>
    </a-layout>

    <!-- 全局配置抽屉 -->
    <SettingDrawer v-model:open="settingDrawerOpen" />
  </a-layout>
</template>

<style scoped lang="less">
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.layout-content-wrapper {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5; // 确保背景色为灰色
}

.layout-body {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  padding: 24px 16px; // 增加内边距
}
</style>
