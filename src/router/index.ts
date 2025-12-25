import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/antd',
      name: 'antd',
      component: () => import('../views/AntdDemo.vue'),
    },
  ],
})

export default router
