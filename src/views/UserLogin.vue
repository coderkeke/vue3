<template>
  <div class="login-container">
    <a-card title="登录" style="width: 300px; margin: 100px auto">
      <a-button type="primary" block @click="handleLogin">登录</a-button>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  await userStore.login({ username: 'admin', password: '123' })
  router.push('/')
}
</script>
