import { createService } from './index'
import type { UnifiedResponse } from './types'

// --------------------------------------------------------------------------
// 场景 1: 标准后端 (Standard Backend)
// 假设结构: { code: 200, data: {...}, msg: "success" }
// --------------------------------------------------------------------------
export const userApi = createService({
  baseURL: '/api/user', // 对应 nginx location /api/user
  transform: {
    transformResponse: (res: any): UnifiedResponse => {
      // 适配逻辑
      return {
        success: res.code === 200,
        data: res.data,
        message: res.msg || res.message || 'ok',
        code: res.code,
        origin: res
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
    transformResponse: (res: any): UnifiedResponse => {
      // 适配逻辑：注意这里 ret 是字符串 '0'，字段叫 result
      return {
        success: res.ret === '0',
        data: res.result, // 将 result 映射到统一的 data
        message: res.message || 'ok',
        code: res.ret,
        origin: res
      }
    },
    beforeRequest: (config) => {
      // 假设老系统需要特殊的 header
      config.headers['X-Legacy-System'] = 'v1.0'
      return config
    }
  }
})

// 默认导出 userApi 方便兼容
export default userApi
