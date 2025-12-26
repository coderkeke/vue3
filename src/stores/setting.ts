import { defineStore } from 'pinia'
import { ref } from 'vue'

// 导航模式：侧边栏 | 顶部栏 | 混合模式
export type NavMode = 'side' | 'top' | 'mix'
// 主题模式：深色 | 浅色
export type Theme = 'dark' | 'light'

// 布局尺寸配置接口
export interface LayoutConfig {
  siderWidth: number // 侧边栏宽度
  headerHeight: number // 顶部导航高度
  collapsedWidth: number // 侧边栏折叠后的宽度
}

// 项目全局配置接口
export interface ProjectConfig {
  navMode: NavMode // 导航模式
  primaryColor: string // 主题色
  layout: LayoutConfig // 布局尺寸
  theme: Theme // 主题风格
  fixedHeader: boolean // 是否固定头部
  fixSiderbar: boolean // 是否固定侧边栏
  collapsed: boolean // 侧边栏折叠状态
}

export const useSettingStore = defineStore(
  'setting',
  () => {
    // 项目默认配置
    const projectConfig = ref<ProjectConfig>({
      navMode: 'side',
      primaryColor: '#1890ff',
      layout: {
        siderWidth: 200,
        headerHeight: 64,
        collapsedWidth: 80,
      },
      theme: 'dark',
      fixedHeader: true,
      fixSiderbar: true,
      collapsed: false,
    })

    // 更新部分项目配置
    const setProjectConfig = (config: Partial<ProjectConfig>) => {
      projectConfig.value = { ...projectConfig.value, ...config }
    }

    // 更新布局尺寸配置
    const setLayoutConfig = (config: Partial<LayoutConfig>) => {
      projectConfig.value.layout = { ...projectConfig.value.layout, ...config }
    }

    // 切换侧边栏展开/折叠状态
    const toggleCollapsed = () => {
      projectConfig.value.collapsed = !projectConfig.value.collapsed
    }

    return {
      projectConfig,
      setProjectConfig,
      setLayoutConfig,
      toggleCollapsed,
    }
  },
  {
    // 启用持久化存储，自动保存到 localStorage
    persist: true,
  }
)

