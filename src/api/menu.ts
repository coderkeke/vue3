import type { BackendRoute } from '@/utils/route-generator'

// 模拟后端返回的路由数据
const mockAsyncRoutes: BackendRoute[] = [
  {
    path: '/demo',
    name: 'DemoRoot',
    component: 'Layout',
    redirect: '/demo/form',
    meta: { title: '组件演示', icon: 'AppstoreOutlined' },
    children: [
      {
        path: 'form',
        name: 'DemoForm',
        component: 'demo/FormDemo',
        meta: { title: '动态表单' },
      },
      {
        path: 'table',
        name: 'DemoTable',
        component: 'demo/TableDemo',
        meta: { title: '查询表格' },
      },
      {
        path: 'chart',
        name: 'DemoChart',
        component: 'demo/ChartDemo',
        meta: { title: '图表演示' },
      },
    ],
  },
  {
    path: '/analysis',
    name: 'AnalysisRoot',
    component: 'Layout',
    redirect: '/analysis/hidden-danger',
    meta: { title: '隐患分析', icon: 'BarChartOutlined' },
    children: [
      {
        path: 'hidden-danger',
        name: 'AnalysisHiddenDanger',
        component: 'analysis/hidden-danger/index',
        meta: { title: '隐患分析' },
      },
      {
        path: 'entry',
        name: 'AnalysisHiddenDangerEntry',
        component: 'analysis/hidden-danger-entry/index',
        meta: { title: '隐患录入' },
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'DashboardRoot',
    component: 'Layout',
    redirect: '/dashboard/analysis',
    meta: { title: '仪表盘', icon: 'DashboardOutlined' },
    children: [
      {
        path: 'analysis',
        name: 'DashboardAnalysis',
        component: 'dashboard/AnalysisBoard',
        meta: { title: '分析页' },
      },
      {
        path: 'workplace',
        name: 'DashboardWorkplace',
        component: 'dashboard/WorkplaceBoard',
        meta: { title: '工作台' },
      },
    ],
  },
  {
    path: '/system',
    name: 'SystemRoot',
    component: 'Layout',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'SettingOutlined' },
    children: [
      {
        path: 'user',
        name: 'SystemUserList',
        component: 'system/UserList',
        meta: { title: '用户列表' },
      },
      {
        path: 'role',
        name: 'SystemRoleList',
        component: 'system/RoleList',
        meta: { title: '角色列表' },
      },
    ],
  },
  {
    path: '/nested',
    name: 'NestedRoot',
    component: 'Layout',
    redirect: '/nested/menu1/menu1-1/menu1-1-1',
    meta: { title: '嵌套菜单', icon: 'MenuOutlined' },
    children: [
      {
        path: 'menu1',
        name: 'NestedMenu1',
        meta: { title: '菜单1' },
        component: 'nested/menu1/index', // 使用带内容的父级组件
        children: [
          {
            path: 'menu1-1',
            name: 'NestedMenu1_1',
            meta: { title: '菜单1-1' },
            component: 'BlankLayout', // 使用 BlankLayout 以便渲染子路由
            children: [
              {
                path: 'menu1-1-1',
                name: 'NestedMenu1_1_1',
                component: 'nested/menu1/menu1-1/Menu1-1-1',
                meta: { title: '菜单1-1-1',hidden: false },
              },
              {
                path: 'menu1-1-2',
                name: 'NestedMenu1_1_2',
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

export const getAsyncRoutes = () => {
  return new Promise<BackendRoute[]>((resolve) => {
    setTimeout(() => {
      resolve(mockAsyncRoutes)
    }, 100)
  })
}
