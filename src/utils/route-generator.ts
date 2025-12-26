import type { RouteRecordRaw } from 'vue-router'

// 引入 BasicLayout
const BasicLayout = () => import('@/layouts/BasicLayout.vue')
const BlankLayout = () => import('@/layouts/BlankLayout.vue')

// Vite 的 Glob 导入，用于构建组件映射表
const modules = import.meta.glob('../views/**/*.vue')

export interface BackendRoute {
  path: string
  name?: string
  component: string | (() => Promise<unknown>)
  redirect?: string
  meta?: {
    title?: string
    icon?: string
    hidden?: boolean
    [key: string]: unknown
  }
  children?: BackendRoute[]
}

/**
 * 将后端返回的路由树转换为 Vue Router 需要的 RouteRecordRaw 格式
 * @param routes 后端返回的路由数组
 */
export const generateRoutes = (routes: BackendRoute[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }

    // 1. 处理 Layout 组件
    if (tmp.component === 'Layout') {
      tmp.component = BasicLayout
    } else if (tmp.component === 'BlankLayout') {
      tmp.component = BlankLayout
    } else if (typeof tmp.component === 'string') {
      // 2. 处理普通组件映射
      // 假设后端返回的是 "dashboard/Analysis"，我们需要映射到 "../views/dashboard/Analysis.vue"
      const componentPath = `../views/${tmp.component}.vue`
      if (modules[componentPath]) {
        tmp.component = modules[componentPath]
      } else {
        // 如果找不到组件，可以给一个默认的 404 组件或者空组件，防止报错
        console.warn(`Component not found: ${componentPath}`)
        tmp.component = () => import('@/views/error/NotFoundPage.vue')
      }
    }

    // 3. 递归处理子路由
    const routeRecord = tmp as unknown as RouteRecordRaw
    if (tmp.children) {
      routeRecord.children = generateRoutes(tmp.children)
    }

    res.push(routeRecord)
  })

  return res
}
