// src/utils/http/types.ts

import type { InternalAxiosRequestConfig } from 'axios'

// 前端项目统一期望得到的响应结构
export interface UnifiedResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  code: number | string
  origin?: unknown // 保留原始响应以便调试
}

// 转换器配置接口
export interface HttpTransform {
  // 请求前的转换（如：添加特定 Header，转换参数格式）
  beforeRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  
  // 响应数据的标准化转换（核心逻辑：异构 -> 同构）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformResponse?: (rawResponse: any) => UnifiedResponse
  
  // 错误处理
  errorHandler?: (error: unknown) => void
}

// 扩展的配置接口
export interface CreateServiceOptions {
  baseURL: string
  timeout?: number
  transform?: HttpTransform
}
