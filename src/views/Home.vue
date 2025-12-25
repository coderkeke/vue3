<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <a-layout>
      <a-layout-header class="header">
        <h1 class="title">Vue3 PC端 Demo</h1>
      </a-layout-header>
      <a-layout-content class="content">
        <a-card title="功能演示" style="width: 100%">
          <a-list bordered>
            <a-list-item class="list-item" @click="navTo('/antd')">
              <a-list-item-meta title="Ant Design Vue 演示" description="查看 Ant Design Vue 组件示例" />
              <template #actions>
                <a-button type="link">查看</a-button>
              </template>
            </a-list-item>
          </a-list>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
.home-container {
  min-height: 100vh;
  background-color: #f0f2f5;

  .header {
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    
    .title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      line-height: 64px;
    }
  }

  .content {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .list-item {
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #fafafa;
    }
  }
}
</style>
