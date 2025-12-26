<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons-vue'

defineProps<{
  mode?: 'vertical' | 'vertical-right' | 'horizontal' | 'inline'
  theme?: 'light' | 'dark'
}>()

const router = useRouter()
const route = useRoute()

const selectedKeys = computed(() => [route.path])

const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<template>
  <a-menu
    :selected-keys="selectedKeys"
    :theme="theme"
    :mode="mode"
    class="app-menu"
    @click="handleMenuClick"
  >
    <a-menu-item key="/">
      <home-outlined />
      <span>首页</span>
    </a-menu-item>
    <a-menu-item key="/antd-demo">
      <appstore-outlined />
      <span>组件演示</span>
    </a-menu-item>
  </a-menu>
</template>

<style scoped lang="less">
.app-menu {
  border-right: none;
}
</style>
