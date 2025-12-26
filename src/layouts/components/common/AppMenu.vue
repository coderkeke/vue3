<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu'
import SubMenu from './SubMenu.vue'

defineProps<{
  mode?: 'vertical' | 'vertical-right' | 'horizontal' | 'inline'
  theme?: 'light' | 'dark'
}>()

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()

const selectedKeys = computed(() => [route.path])
const openKeys = ref<string[]>([])

// 简单的路由匹配逻辑，确保展开当前选中的菜单
watch(
  () => route.path,
  (newPath) => {
    // 这里简单实现：将路径拆分，逐步累加作为 openKeys
    // 例如 /dashboard/analysis -> ['/dashboard', '/dashboard/analysis']
    const parts = newPath.split('/').filter(Boolean)
    const keys: string[] = []
    let currentPath = ''
    parts.forEach((part) => {
      currentPath += `/${part}`
      keys.push(currentPath)
    })
    // 合并新的 openKeys，避免重复
    openKeys.value = [...new Set([...openKeys.value, ...keys])]
  },
  { immediate: true },
)

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<template>
  <a-menu
    v-model:open-keys="openKeys"
    :selected-keys="selectedKeys"
    :theme="theme"
    :mode="mode"
    class="app-menu"
    @click="handleMenuClick"
  >
    <template v-for="item in menuStore.menuList" :key="item.path">
      <SubMenu :item="item" />
    </template>
  </a-menu>
</template>

<style scoped lang="less">
.app-menu {
  border-right: none;
}
</style>
