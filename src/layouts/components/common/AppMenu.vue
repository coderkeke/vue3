<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import SubMenu from './SubMenu.vue'

defineOptions({
  name: 'AppMenu',
})

const props = defineProps<{
  mode?: 'vertical' | 'vertical-right' | 'horizontal' | 'inline'
  theme?: 'light' | 'dark'
}>()

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

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
      keys.push(currentPath + '_sub')
    })
    // 合并新的 openKeys，避免重复
    // 如果是水平模式（horizontal），通常不需要自动展开 openKeys，因为它们是悬浮触发的
    // 但在某些场景下如果希望保持选中项的高亮路径，可以保留。
    // 不过为了修复“混合模式下头部菜单自动弹出”的问题，我们在 horizontal 模式下不强制设置 openKeys
    if (props.mode !== 'horizontal') {
      openKeys.value = [...new Set([...openKeys.value, ...keys])]
    }
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
    <template v-for="item in permissionStore.routes" :key="item.path">
      <template v-if="!item.meta?.hidden">
        <SubMenu :item="item" />
      </template>
    </template>
  </a-menu>
</template>

<style scoped lang="less">
.app-menu {
  border-right: none;
}
</style>
