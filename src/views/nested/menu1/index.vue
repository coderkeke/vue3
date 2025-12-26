<template>
  <div class="nested-menu-layout">
    <a-alert
      message="父级菜单内容区"
      description="这是一个带有内容的父级菜单组件。下面的区域将渲染子路由的内容。"
      type="info"
      show-icon
      class="mb-4"
    />
    
    <!-- 子路由渲染出口 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NestedMenu1Index'
})
// 这里可以添加父级菜单特有的逻辑
</script>

<style scoped>
.nested-menu-layout {
  padding: 16px;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
}
</style>
