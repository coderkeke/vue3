<template>
  <div class="login-container" :style="{ backgroundImage: `url(${loginBg})` }">
    <div class="login-wrapper">
      <div class="login-header">
        <img :src="logoImg" alt="logo" class="logo-img" />
        <span class="logo-text">隐患分析系统</span>
      </div>

      <div class="login-box">
        <h2 class="title">欢迎登录</h2>
        <a-form layout="vertical" :model="formState" @finish="handleSubmit">
          <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model:value="formState.username" size="large" placeholder="用户名">
              <template #prefix>
                <UserOutlined class="icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
              <template #prefix>
                <LockOutlined class="icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              block
              size="large"
              :loading="loading"
              class="submit-btn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <div class="login-footer">Copyright &copy; 2025 ~ 2026 隐患分析系统</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import logoImg from '@/assets/images/logo.jpg'
import loginBg from '@/assets/svg/login-bg.svg'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const formState = reactive({
  username: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await userStore.login(formState)
    message.success('登录成功')
    const { redirect } = route.query
    router.push((redirect as string) || '/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  position: relative;
  overflow: hidden;
}

.login-wrapper {
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 0 16px;
  margin-top: -60px; // Adjust vertical centering visual balance
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  .logo-img {
    height: 44px;
    margin-right: 16px;
  }

  .logo-text {
    font-size: 33px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
}

.login-box {
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 6px 16px -8px rgba(0, 0, 0, 0.08),
    0 9px 28px 0 rgba(0, 0, 0, 0.05),
    0 12px 48px 16px rgba(0, 0, 0, 0.03);
  padding: 40px 32px;

  .title {
    margin-bottom: 32px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 24px;
    text-align: center;
  }

  .icon {
    color: rgba(0, 0, 0, 0.25);
  }

  .submit-btn {
    margin-top: 8px;
  }
}

.login-footer {
  position: absolute;
  bottom: 24px;
  width: 100%;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
