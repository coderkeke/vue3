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
    <!-- 情况1：侧边栏模式 (Sider 在左，Header 在右) -->
    <template v-if="navMode === 'side'">
      <SiderMenu :collapsed="collapsed" />
      <a-layout class="layout-content-wrapper">
        <GlobalHeader
          :collapsed="collapsed"
          @toggle="toggleCollapsed"
          @open-setting="openSettingDrawer"
        />
        <div class="layout-scroll-container">
          <a-layout-content
            :style="{
              margin: '24px 16px',
              padding: '24px',
              background: '#fff',
              minHeight: '280px',
            }"
          >
            <router-view />
          </a-layout-content>
          <GlobalFooter />
        </div>
      </a-layout>
    </template>

    <!-- 情况2：顶部导航模式 (Header 在上，无 Sider) -->
    <!-- 情况3：混合模式 (Header 在上，Sider 在下) -->
    <template v-else>
      <GlobalHeader
        :collapsed="collapsed"
        @toggle="toggleCollapsed"
        @open-setting="openSettingDrawer"
      />
      <a-layout class="layout-content-wrapper" :class="{ 'mix-layout': navMode === 'mix' }">
        <SiderMenu v-if="navMode === 'mix'" :collapsed="collapsed" />
        <div class="layout-scroll-container">
          <a-layout-content
            :style="{
              margin: '24px 16px',
              padding: '24px',
              background: '#fff',
              minHeight: '280px',
            }"
          >
            <router-view />
          </a-layout-content>
          <GlobalFooter />
        </div>
      </a-layout>
    </template>

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

  &.mix-layout {
    flex-direction: row; // 混合模式下，Sider 和 内容区左右排列
  }
}

.layout-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
