import router from '@/router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404', '/403'] // 白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  // 简单的 Token 判断 (实际应从 userStore 或 localStorage 获取)
  const hasToken = localStorage.getItem('token')

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是否已获取过权限信息 (这里简化判断，实际可判断 roles 长度)
      const hasPermissions = userStore.permissions && userStore.permissions.length > 0
      
      if (hasPermissions) {
        next()
      } else {
        try {
          // 1. 获取用户信息和权限
          await userStore.getInfo()
          
          // 2. 生成动态路由
          const accessRoutes = await permissionStore.generateRoutesAction()
          
          // 移除 constantRoutes 中定义的临时通配符路由，防止它拦截所有路径（因为它在路由表最前面）
          if (router.hasRoute('NotFoundRedirect')) {
            router.removeRoute('NotFoundRedirect')
          }

          // 3. 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          
          // 4. 确保路由添加完成，replace: true 替换当前历史记录
          // 使用 path 属性重定向，避免保留旧的 name (如 NotFoundRedirect)
          next({ path: to.path, query: to.query, replace: true })
        } catch {
          // 出错需重置 Token 并跳转登录页
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
