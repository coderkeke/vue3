import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, getUserInfoApi, logoutApi, type UserInfo, type LoginParams } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const permissions = ref<string[]>([])
  const userInfo = ref<UserInfo>({} as UserInfo)

  const login = async (params: LoginParams) => {
    // 调用登录接口
    token.value = await loginApi(params)
    // 将 Token 存入 localStorage (实际项目中建议使用 Cookie 或封装的 Storage 工具)
    localStorage.setItem('token', token.value)
  }

  const getInfo = async () => {
    // 调用获取用户信息接口
    const data = await getUserInfoApi()
    permissions.value = data.permissions
    userInfo.value = data.userInfo
    return data
  }

  const logout = async () => {
    // 调用退出登录接口
    await logoutApi()
    token.value = ''
    permissions.value = []
    userInfo.value = {} as UserInfo
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
