import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const permissions = ref<string[]>([])
  const userInfo = ref<Record<string, unknown>>({})

  const login = async () => {
    // 模拟登录请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        token.value = 'mock-token-' + Date.now()
        userInfo.value = { name: 'Admin', avatar: '' }
        // 将 Token 存入 localStorage (实际项目中建议使用 Cookie 或封装的 Storage 工具)
        localStorage.setItem('token', token.value)
        resolve()
      }, 500)
    })
  }

  const getInfo = async () => {
    // 模拟获取用户信息和权限
    return new Promise<{ permissions: string[]; userInfo: Record<string, unknown> }>((resolve) => {
      setTimeout(() => {
        const data = {
          permissions: ['dashboard:view', 'system:user:list', 'system:user:add'],
          userInfo: { name: 'Admin', avatar: '' },
        }
        permissions.value = data.permissions
        userInfo.value = data.userInfo
        resolve(data)
      }, 200)
    })
  }

  const logout = () => {
    token.value = ''
    permissions.value = []
    userInfo.value = {}
    localStorage.removeItem('token')
  }

  return {
    token,
    permissions,
    userInfo,
    login,
    getInfo,
    logout,
  }
})
