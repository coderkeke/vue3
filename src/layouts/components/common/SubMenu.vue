<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from '@ant-design/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
  basePath?: string
}>()

const resolvePath = (routePath: string) => {
  if (routePath.startsWith('/') || routePath.startsWith('http')) {
    return routePath
  }
  if (!props.basePath) {
    return routePath
  }
  return `${props.basePath.replace(/\/$/, '')}/${routePath}`
}

const fullPath = computed(() => resolvePath(props.item.path))

const renderIcon = (icon: string | undefined) => {
  if (!icon) return null
  const IconComp = (Icons as Record<string, unknown>)[icon]
  return IconComp ? IconComp : null
}
</script>

<script lang="ts">
export default {
  name: 'SubMenu',
}
</script>

<template>
  <a-sub-menu v-if="item.children && item.children.length > 0" :key="fullPath + '_sub'">
    <template #title>
      <span>
        <component :is="renderIcon(item.meta?.icon as string)" v-if="item.meta?.icon" />
        <span>{{ item.meta?.title }}</span>
      </span>
    </template>
    <template v-for="child in item.children" :key="child.path">
      <template v-if="!child.meta?.hidden">
        <sub-menu :item="child" :base-path="fullPath" />
      </template>
    </template>
  </a-sub-menu>
  <a-menu-item v-else :key="fullPath">
    <component :is="renderIcon(item.meta?.icon as string)" v-if="item.meta?.icon" />
    <span>{{ item.meta?.title }}</span>
  </a-menu-item>
</template>
