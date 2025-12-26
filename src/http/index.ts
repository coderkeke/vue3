import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import type { CreateServiceOptions, UnifiedResponse } from './types.ts'

export class HttpService {
  private instance: AxiosInstance
  private options: CreateServiceOptions

  constructor(options: CreateServiceOptions) {
    this.options = options
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 10000,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    const { transform } = this.options

    // 1. 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        // 执行自定义的请求前置处理
        if (transform?.beforeRequest) {
          return transform.beforeRequest(config)
        }
        // 默认处理：例如添加 Token
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 2. 响应拦截
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 如果配置了数据标准化转换函数，则使用它
        if (transform?.transformResponse) {
          try {
            const unifiedData = transform.transformResponse(response.data)
            // 可以在这里统一判断业务成功与否
            if (!unifiedData.success) {
              message.error(unifiedData.message || '业务处理失败')
              // 可以选择 reject，让业务层 catch
              return Promise.reject(unifiedData)
            }
            // 返回标准化后的数据，或者直接返回 data 字段（取决于项目习惯）
            // 这里我们返回整个 UnifiedResponse 以便业务层获取完整信息
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return unifiedData as any
          } catch (e) {
            message.error('数据解析失败')
            return Promise.reject(e)
          }
        }
        
        // 默认行为：如果不传转换器，原样返回
        return response.data
      },
      (error) => {
        // 执行自定义错误处理
        if (transform?.errorHandler) {
          transform.errorHandler(error)
        } else {
          // 默认错误处理
          this.handleDefaultError(error)
        }
        return Promise.reject(error)
      }
    )
  }

  private handleDefaultError(error: unknown) {
    let msg = ''
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      switch (status) {
        case 400: msg = '请求错误(400)'; break
        case 401: msg = '未授权，请重新登录(401)'; break
        case 403: msg = '拒绝访问(403)'; break
        case 404: msg = '请求出错(404)'; break
        case 500: msg = '服务器错误(500)'; break
        default: msg = `连接出错(${status})!`; break
      }
    } else {
       msg = error instanceof Error ? error.message : '未知错误'
    }
    
    message.error(msg)
  }

  // 封装常用方法
  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<UnifiedResponse<T>> {
    return this.instance.get(url, config)
  }

  public post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<UnifiedResponse<T>> {
    return this.instance.post(url, data, config)
  }
  
  public put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<UnifiedResponse<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<UnifiedResponse<T>> {
    return this.instance.delete(url, config)
  }
}

// 工厂函数
export function createService(options: CreateServiceOptions) {
  return new HttpService(options)
}
