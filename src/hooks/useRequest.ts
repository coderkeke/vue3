import { ref, type Ref } from 'vue'

interface UseRequestOptions<T> {
  // 是否立即执行
  manual?: boolean
  // 初始数据
  initialData?: T
  // 成功回调
  onSuccess?: (data: T) => void
  // 失败回调
  onError?: (error: unknown) => void
}

interface UseRequestResult<T, Args extends unknown[]> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<unknown>
  run: (...args: Args) => Promise<void>
}

/**
 * 简单的请求 Hook，用于管理 loading 和 data 状态
 * @param apiFn 返回 Promise 的 API 函数
 * @param options 配置项
 */
export function useRequest<T, Args extends unknown[] = unknown[]>(
  apiFn: (...args: Args) => Promise<unknown>, // 使用 Promise<unknown> 兼容不同返回结构
  options: UseRequestOptions<T> = {}
): UseRequestResult<T, Args> {
  const { manual = false, initialData = null, onSuccess, onError } = options

  const loading = ref(false)
  const data = ref<T | null>(initialData) as Ref<T | null>
  const error = ref<unknown>(null)

  const run = async (...args: Args) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFn(...args)
      
      // 兼容逻辑：
      // 1. 如果是 UnifiedResponse 结构 (有 .data 且 .success 等)，取 .data
      // 2. 否则直接认为 res 就是数据
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validData = (res as any)?.data !== undefined ? (res as any).data : res
      
      data.value = validData
      if (onSuccess) {
        onSuccess(validData)
      }
    } catch (err) {
      error.value = err
      if (onError) {
        onError(err)
      }
      console.error('Request Failed:', err)
    } finally {
      loading.value = false
    }
  }

  if (!manual) {
    // 如果不是手动模式，且没有参数，可以自动执行
    // 但由于 Args 类型未知，TS 可能会抱怨。这里强制转换一下或者仅在无参时安全调用
    // 简单起见，仅当手动模式关闭时尝试调用。
    // 注意：如果 apiFn 需要参数但 manual=false，这里调用可能会出错，这是业务层需要保证的
    (run as unknown as () => Promise<void>)()
  }

  return {
    loading,
    data,
    error,
    run
  }
}
