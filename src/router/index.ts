import { createRouter, createWebHistory, RouterView } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/BasicLayout.vue'),
      redirect: '/dashboard/analysis',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: '仪表盘' },
          redirect: '/dashboard/analysis',
          component: RouterView,
          children: [
            {
              path: 'analysis',
              name: 'Analysis',
              component: () => import('../views/dashboard/Analysis.vue'),
              meta: { title: '分析页' },
            },
            {
              path: 'workplace',
              name: 'Workplace',
              component: () => import('../views/dashboard/Workplace.vue'),
              meta: { title: '工作台' },
            },
          ],
        },
        {
          path: 'system',
          name: 'System',
          meta: { title: '系统管理' },
          redirect: '/system/user',
          component: RouterView,
          children: [
            {
              path: 'user',
              name: 'UserList',
              component: () => import('../views/system/UserList.vue'),
              meta: { title: '用户列表' },
            },
            {
              path: 'role',
              name: 'RoleList',
              component: () => import('../views/system/RoleList.vue'),
              meta: { title: '角色列表' },
            },
          ],
        },
        {
          path: 'nested',
          name: 'Nested',
          meta: { title: '嵌套菜单' },
          redirect: '/nested/menu1/menu1-1/menu1-1-1',
          component: RouterView,
          children: [
            {
              path: 'menu1',
              name: 'Menu1',
              meta: { title: '菜单1' },
              component: RouterView,
              children: [
                {
                  path: 'menu1-1',
                  name: 'Menu1-1',
                  meta: { title: '菜单1-1' },
                  component: RouterView,
                  children: [
                    {
                      path: 'menu1-1-1',
                      name: 'Menu1-1-1',
                      component: () => import('../views/nested/menu1/menu1-1/Menu1-1-1.vue'),
                      meta: { title: '菜单1-1-1' },
                    },
                    {
                      path: 'menu1-1-2',
                      name: 'Menu1-1-2',
                      component: () => import('../views/nested/menu1/menu1-1/Menu1-1-2.vue'),
                      meta: { title: '菜单1-1-2' },
                    },
                  ],
                },
                {
                  path: 'menu1-2',
                  name: 'Menu1-2',
                  component: () => import('../views/nested/menu1/Menu1-2.vue'),
                  meta: { title: '菜单1-2' },
                },
              ],
            },
            {
              path: 'menu2',
              name: 'Menu2',
              component: () => import('../views/nested/Menu2.vue'),
              meta: { title: '菜单2' },
            },
          ],
        },
        {
          path: 'antd-demo',
          name: 'AntdDemo',
          component: () => import('../views/AntdDemo.vue'),
          meta: { title: '组件演示' },
        },
      ],
    },
  ],
})

export default router
