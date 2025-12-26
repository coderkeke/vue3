<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, type RouteRecordRaw } from 'vue-router'
import SiderMenu from './components/sider/SiderMenu.vue'
import GlobalHeader from './components/header/GlobalHeader.vue'
import GlobalFooter from './components/common/GlobalFooter.vue'
import SettingDrawer from './components/common/SettingDrawer.vue'
import { useSettingStore } from '@/stores/setting'
import { usePermissionStore } from '@/stores/permission'

// 使用全局配置 Store
const settingStore = useSettingStore()
const permissionStore = usePermissionStore()
const route = useRoute()

// 从 Store 获取侧边栏折叠状态
const collapsed = computed(() => settingStore.projectConfig.collapsed)
// 从 Store 获取导航模式
const navMode = computed(() => settingStore.projectConfig.navMode)

// 混合模式下的菜单逻辑
const activeTopMenuPath = ref('')

const allRoutes = computed(() => permissionStore.routes)

const headerMenus = computed(() => {
  if (navMode.value === 'mix') {
    // 混合模式下，头部只显示一级菜单，且不渲染子菜单（防止出现下拉）
    return allRoutes.value.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...rest } = item
      return {
        ...rest,
        // 移除 children，使其成为叶子节点
        children: undefined,
      } as RouteRecordRaw
    })
  }
  return allRoutes.value
})

const sideMenus = computed(() => {
  if (navMode.value === 'mix') {
    const activeRoute = allRoutes.value.find((r) => r.path === activeTopMenuPath.value)
    return activeRoute?.children || []
  }
  return allRoutes.value
})

// 监听路由变化，更新激活的顶部菜单
watch(
  [() => route.path, allRoutes],
  ([newPath, routes]) => {
    if (navMode.value === 'mix') {
      // 找到当前路径所属的一级菜单
      const active = routes.find((r) => {
        return newPath === r.path || newPath.startsWith(r.path + '/')
      })
      if (active) {
        activeTopMenuPath.value = active.path
      }
    }
  },
  { immediate: true },
)

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
    <SiderMenu
      v-if="navMode !== 'top'"
      :collapsed="collapsed"
      :menu-list="sideMenus"
      :base-path="activeTopMenuPath"
    />

    <a-layout class="layout-content-wrapper">
      <div class="layout-scroll-container">
        <!-- Header -->
        <GlobalHeader
          :collapsed="collapsed"
          :menu-list="headerMenus"
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
