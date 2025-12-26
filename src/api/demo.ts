import { userApi, legacyApi } from '@/http/request'

// 定义接口类型
export interface UserInfo {
  name: string
  avatar: string
  source: string
}

export interface OrderItem {
  id: number
  name: string
  price: number
}

// 获取用户信息 (标准后端)
export const getUserInfo = () => {
  return userApi.get<UserInfo>('/info')
}

// 获取老系统订单列表 (Legacy后端)
export const getLegacyOrders = () => {
  return legacyApi.get<OrderItem[]>('/orders')
}

// 测试老系统错误 (Legacy后端)
// 使用 unknown 替代 any，表示不关心具体返回结构或结构未知
export const getLegacyError = () => {
  return legacyApi.get<unknown>('/error')
}
