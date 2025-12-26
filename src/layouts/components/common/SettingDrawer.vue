<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from '@/stores/setting'
import type { NavMode, Theme } from '@/stores/setting'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'close'): void
}>()

const settingStore = useSettingStore()

const visible = computed({
  get: () => props.open,
  set: (val) => {
    emit('update:open', val)
    if (!val) emit('close')
  },
})

// 导航模式选项
const navModeOptions = [
  { label: '侧边栏导航', value: 'side' },
  { label: '顶部栏导航', value: 'top' },
  { label: '混合模式', value: 'mix' },
]

// 主题选项
const themeOptions = [
  { label: '深色主题', value: 'dark' },
  { label: '浅色主题', value: 'light' },
]

const handleThemeChange = (val: Theme) => {
  settingStore.setProjectConfig({ theme: val })
}

const handleNavModeChange = (val: NavMode) => {
  settingStore.setProjectConfig({ navMode: val })
}

const handleSiderWidthChange = (val: number | null) => {
  if (val) settingStore.setLayoutConfig({ siderWidth: val })
}

const handleHeaderHeightChange = (val: number | null) => {
  if (val) settingStore.setLayoutConfig({ headerHeight: val })
}

const handleFixedHeaderChange = (checked: boolean | string | number) => {
  settingStore.setProjectConfig({ fixedHeader: !!checked })
}

const handleFixSiderbarChange = (checked: boolean | string | number) => {
  settingStore.setProjectConfig({ fixSiderbar: !!checked })
}
</script>

<template>
  <a-drawer
    v-model:open="visible"
    title="项目配置"
    placement="right"
    width="300px"
  >
    <div class="setting-drawer-content">
      <a-divider>主题设置</a-divider>
      <div class="setting-item">
        <span>主题风格</span>
        <a-radio-group
          :value="settingStore.projectConfig.theme"
          :options="themeOptions"
          option-type="button"
          button-style="solid"
          @update:value="handleThemeChange"
        />
      </div>
      <div class="setting-item">
        <span>主色调</span>
        <div class="color-picker-mock" :style="{ background: settingStore.projectConfig.primaryColor }"></div>
      </div>

      <a-divider>导航设置</a-divider>
      <div class="setting-item">
        <span>导航模式</span>
        <a-select
          :value="settingStore.projectConfig.navMode"
          :options="navModeOptions"
          style="width: 120px"
          @update:value="handleNavModeChange"
        />
      </div>

      <a-divider>布局设置</a-divider>
      <div class="setting-item">
        <span>侧边栏宽度</span>
        <a-input-number
          :value="settingStore.projectConfig.layout.siderWidth"
          :min="150"
          :max="400"
          style="width: 100px"
          @update:value="handleSiderWidthChange"
        />
      </div>
      <div class="setting-item">
        <span>顶部栏高度</span>
        <a-input-number
          :value="settingStore.projectConfig.layout.headerHeight"
          :min="48"
          :max="100"
          style="width: 100px"
          @update:value="handleHeaderHeightChange"
        />
      </div>

      <a-divider>界面功能</a-divider>
      <div class="setting-item">
        <span>固定头部</span>
        <a-switch
          :checked="settingStore.projectConfig.fixedHeader"
          @update:checked="handleFixedHeaderChange"
        />
      </div>
      <div class="setting-item">
        <span>固定侧边栏</span>
        <a-switch
          :checked="settingStore.projectConfig.fixSiderbar"
          @update:checked="handleFixSiderbarChange"
        />
      </div>
    </div>
  </a-drawer>
</template>

<style scoped lang="less">
.setting-drawer-content {
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }

  .color-picker-mock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    cursor: pointer;
    border: 1px solid #ddd;
  }
}
</style>
