import { smartApi } from '@/http/request'

// 用户登录参数接口
export interface LoginParams {
  username: string
  password: string
  mobile?: string
  captcha?: string
}

// 用户信息接口
export interface UserInfo {
  name: string
  avatar: string
  roles?: string[]
}

// 登录接口
export const loginApi = async (params: LoginParams) => {
  const res = await smartApi.post<{ token: string }>('/auth/login', params)
  return res.data.token
}

// 获取用户信息接口
export const getUserInfoApi = () => {
  return new Promise<{ permissions: string[]; userInfo: UserInfo }>((resolve) => {
    setTimeout(() => {
      const data = {
        permissions: ['dashboard:view', 'system:user:list', 'system:user:add'],
        userInfo: { name: 'Admin', avatar: '' },
      }
      resolve(data)
    }, 200)
  })
}

// 退出登录接口
export const logoutApi = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })
}
