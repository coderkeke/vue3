<script setup lang="ts">
defineOptions({
  name: 'HomePage',
})
import { useRouter } from 'vue-router'

const router = useRouter()

const navTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <a-card title="功能演示" style="width: 100%">
      <a-list bordered>
        <a-list-item class="list-item" @click="navTo('/antd-demo')">
          <a-list-item-meta
            title="Ant Design Vue 演示"
            description="查看 Ant Design Vue 组件示例"
          />
          <template #actions>
            <a-button type="link">查看</a-button>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<style scoped lang="less">
.home-container {
  .list-item {
    cursor: pointer;
    transition: background-color 0.3s;
    height: 1200px;

    &:hover {
      background-color: #fafafa;
    }
  }
}
</style>
