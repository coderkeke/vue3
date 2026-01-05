export const HIDDEN_DANGER_COLORS = {
  // 隐患级别
  '重大隐患': '#ee6666', // 红色 - 最高级别
  '较大隐患': '#fac858', // 橙色 - 次高级别
  '一般隐患': '#5470c6', // 蓝色 - 普通级别
  '较小隐患': '#91cc75', // 绿色 - 较低级别

  // 默认颜色
  'default': '#7dd1f2'
}

export const getHiddenDangerColor = (level: string): string => {
  return HIDDEN_DANGER_COLORS[level as keyof typeof HIDDEN_DANGER_COLORS] || HIDDEN_DANGER_COLORS.default
}

export const HIDDEN_DANGER_ORDER = ['重大隐患', '较大隐患', '一般隐患', '较小隐患']
