<script setup lang="ts">
import * as Icons from '@ant-design/icons-vue'

const props = defineProps<{
  item: any
}>()

const renderIcon = (icon: string | undefined) => {
  if (!icon) return null
  const IconComp = (Icons as any)[icon]
  return IconComp ? IconComp : null
}
</script>

<script lang="ts">
export default {
  name: 'SubMenu',
}
</script>

<template>
  <a-sub-menu :key="item.path" v-if="item.children && item.children.length > 0">
    <template #title>
      <span>
        <component v-if="item.icon" :is="renderIcon(item.icon)" />
        <span>{{ item.title }}</span>
      </span>
    </template>
    <template v-for="child in item.children" :key="child.path">
      <sub-menu :item="child" />
    </template>
  </a-sub-menu>
  <a-menu-item :key="item.path" v-else>
    <component v-if="item.icon" :is="renderIcon(item.icon)" />
    <span>{{ item.title }}</span>
  </a-menu-item>
</template>
