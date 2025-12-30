import type { BackendRoute } from '@/utils/route-generator'

// 模拟后端返回的路由数据
const mockAsyncRoutes: BackendRoute[] = [
  {
    path: '/analysis',
    name: 'AnalysisRoot',
    component: 'Layout',
    redirect: '/analysis/hidden-danger',
    meta: { title: '隐患', icon: 'BarChartOutlined' },
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
]

export const getAsyncRoutes = () => {
  return new Promise<BackendRoute[]>((resolve) => {
    setTimeout(() => {
      resolve(mockAsyncRoutes)
    }, 100)
  })
}
