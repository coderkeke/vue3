import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

export const useMenuStore = defineStore('menu', () => {
  // 模拟从接口获取的菜单数据
  const menuList = ref<MenuItem[]>([
    {
      path: '/dashboard',
      title: '仪表盘',
      icon: 'DashboardOutlined',
      children: [
        { path: '/dashboard/analysis', title: '分析页' },
        { path: '/dashboard/workplace', title: '工作台' },
      ],
    },
    {
      path: '/system',
      title: '系统管理',
      icon: 'SettingOutlined',
      children: [
        { path: '/system/user', title: '用户列表' },
        { path: '/system/role', title: '角色列表' },
      ],
    },
    {
      path: '/nested',
      title: '嵌套菜单',
      icon: 'MenuOutlined',
      children: [
        {
          path: '/nested/menu1',
          title: '菜单1',
          children: [
            {
              path: '/nested/menu1/menu1-1',
              title: '菜单1-1',
              children: [
                { path: '/nested/menu1/menu1-1/menu1-1-1', title: '菜单1-1-1' },
                { path: '/nested/menu1/menu1-1/menu1-1-2', title: '菜单1-1-2' },
              ],
            },
            { path: '/nested/menu1/menu1-2', title: '菜单1-2' },
          ],
        },
        { path: '/nested/menu2', title: '菜单2' },
      ],
    },
    {
      path: '/antd-demo',
      title: '组件演示',
      icon: 'AppstoreOutlined',
    },
  ])

  // 设置菜单列表（用于后续从接口获取后更新）
  const setMenuList = (menus: MenuItem[]) => {
    menuList.value = menus
  }

  return {
    menuList,
    setMenuList,
  }
})
