import { createService } from './index'
import type { UnifiedResponse } from './types'
import type { InternalAxiosRequestConfig } from 'axios'

// --------------------------------------------------------------------------
// 场景 1: 标准后端 (Standard Backend)
// 假设结构: { code: 200, data: {...}, msg: "success" }
// --------------------------------------------------------------------------
export const userApi = createService({
  baseURL: '/api/user', // 对应 nginx location /api/user
  transform: {
    transformResponse: (res: unknown): UnifiedResponse => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = res as any
      // 适配逻辑
      return {
        success: response.code === 200,
        data: response.data,
        message: response.msg || response.message || 'ok',
        code: response.code,
        origin: response
      }
    }
  }
})

// --------------------------------------------------------------------------
// 场景 2: 老系统后端 (Legacy Backend)
// 假设结构: { ret: '0', result: {...}, message: "操作成功" }
// --------------------------------------------------------------------------
export const legacyApi = createService({
  baseURL: '/api/legacy', // 对应 nginx location /api/legacy
  transform: {
    transformResponse: (res: unknown): UnifiedResponse => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = res as any
      // 适配逻辑：注意这里 ret 是字符串 '0'，字段叫 result
      return {
        success: response.ret === '0',
        data: response.result, // 将 result 映射到统一的 data
        message: response.message || 'ok',
        code: response.ret,
        origin: response
      }
    },
    beforeRequest: (config: InternalAxiosRequestConfig) => {
      // 假设老系统需要特殊的 header
      config.headers['X-Legacy-System'] = 'v1.0'
      return config
    }
  }
})

// 默认导出 userApi 方便兼容
export default userApi
