import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes } from '@/router/constantRoutes'
import { generateRoutes } from '@/utils/route-generator'

// 模拟后端返回的路由数据
const mockAsyncRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'Layout',
    redirect: '/dashboard/analysis',
    meta: { title: '仪表盘', icon: 'DashboardOutlined' },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        component: 'dashboard/AnalysisBoard',
        meta: { title: '分析页' },
      },
      {
        path: 'workplace',
        name: 'Workplace',
        component: 'dashboard/WorkplaceBoard',
        meta: { title: '工作台' },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'SettingOutlined' },
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: 'system/UserList',
        meta: { title: '用户列表' },
      },
      {
        path: 'role',
        name: 'RoleList',
        component: 'system/RoleList',
        meta: { title: '角色列表' },
      },
    ],
  },
  {
    path: '/nested',
    name: 'Nested',
    component: 'Layout',
    redirect: '/nested/menu1/menu1-1/menu1-1-1',
    meta: { title: '嵌套菜单', icon: 'MenuOutlined' },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        meta: { title: '菜单1' },
        component: 'nested/menu1/index', // 使用带内容的父级组件
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            meta: { title: '菜单1-1' },
            component: 'BlankLayout', // 使用 BlankLayout 以便渲染子路由
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu1-1-1',
                component: 'nested/menu1/menu1-1/Menu1-1-1',
                meta: { title: '菜单1-1-1',hidden: false },
              },
              {
                path: 'menu1-1-2',
                name: 'Menu1-1-2',
                component: 'nested/menu1/menu1-1/Menu1-1-2',
                meta: { title: '菜单1-1-2' },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  const addRoutes = ref<RouteRecordRaw[]>([])

  const generateRoutesAction = async (): Promise<RouteRecordRaw[]> => {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      // 模拟从接口获取路由数据
      setTimeout(() => {
        // 在这里可以根据 userStore 中的 roles 进行过滤，或者直接使用后端返回的已过滤路由
        const accessedRoutes = generateRoutes(mockAsyncRoutes)

        // 动态计算根路径重定向
        // 找到第一个可访问的路由作为首页
        const findFirstPath = (routes: RouteRecordRaw[], basePath = ''): string | null => {
          for (const route of routes) {
            // 跳过隐藏路由
            if (route.meta?.hidden) {
              continue
            }

            // 处理路径拼接
            const routePath = route.path.startsWith('/') 
              ? route.path 
              : `${basePath.replace(/\/$/, '')}/${route.path}`

            // 如果有子路由，递归查找
            if (route.children && route.children.length > 0) {
              const childPath = findFirstPath(route.children, routePath)
              if (childPath) return childPath
            } else if (!route.redirect) {
              // 找到第一个非重定向的叶子节点
              return routePath
            }
          }
          return null
        }
        
        const firstPath = findFirstPath(accessedRoutes)
        
        // 如果计算失败，兜底跳转到 /dashboard/analysis
        const redirectPath = firstPath || '/dashboard/analysis'
        
        // 确保根路径重定向覆盖默认行为
        accessedRoutes.unshift({
          path: '/',
          redirect: redirectPath,
          meta: { hidden: true },
        })

        // 动态添加 404 路由到最后
         accessedRoutes.push({
             path: '/:pathMatch(.*)*',
             redirect: '/exception/404',
             name: 'NotFoundRedirect',
             meta: { hidden: true },
          })

         addRoutes.value = accessedRoutes
        routes.value = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      }, 100)
    })
  }

  return {
    routes,
    addRoutes,
    generateRoutesAction,
  } as {
    routes: Ref<RouteRecordRaw[]>
    addRoutes: Ref<RouteRecordRaw[]>
    generateRoutesAction: () => Promise<RouteRecordRaw[]>
  }
})
