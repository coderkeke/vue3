import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/UserLogin.vue'), // 假设有一个 Login.vue，如果没有需要稍后创建
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundPage.vue'), // 假设有一个 404.vue
    meta: { title: '404',hidden: true },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/ForbiddenPage.vue'), // 假设有一个 403.vue
    meta: { title: '403', hidden: true },
  },
  // 临时通配符路由，防止初始化时报 No match found 警告
  // 动态路由加载完成后会被覆盖
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundRedirect',
    component: () => import('@/layouts/BlankLayout.vue'),
    meta: { hidden: true },
  },
]
