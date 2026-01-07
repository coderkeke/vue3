export type ComponentType =
  | 'Input'
  | 'InputNumber'
  | 'Password'
  | 'TextArea'
  | 'Select'
  | 'TreeSelect'
  | 'ApiSelect'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Switch'
  | 'DatePicker'
  | 'RangePicker'
  | 'TimePicker'
  | 'Upload'
  | 'Rate'
  | 'Slider'
  | 'AutoComplete';

import type { Rule } from 'ant-design-vue/es/form';

export interface FormSchema {
  // 字段名 (field name, key in model)
  field: string;
  // 标签名 (label text)
  label?: string;
  // 组件类型 (Component Type: Input, Select, etc.)
  component?: ComponentType;
  // 组件参数 (Props for the component, e.g., placeholder, disabled)
  // 支持函数动态返回 (Supports dynamic props via function)
  componentProps?: Record<string, unknown> | ((opt: { model: Record<string, unknown>; field: string }) => Record<string, unknown>);
  // 组件事件 (Events for the component, e.g., onChange, onBlur)
  componentEvents?: Record<string, unknown>;
  // Form Item Props (Props for a-form-item, e.g., label, help, extra)
  formItemProps?: Record<string, unknown>;
  // Col Props (Grid configuration, e.g., span, offset)
  colProps?: {
    span?: number;
    offset?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    [key: string]: unknown;
  };
  // 校验规则 (Validation rules from Ant Design Vue)
  rules?: Rule[];
  // 默认值 (Default value)
  defaultValue?: unknown;
  // 自定义 Slot 名称 (Custom slot name)
  slot?: string;
  // 动态显示控制 (Dynamic visibility control)
  show?: boolean | ((opt: { model: Record<string, unknown>; field: string }) => boolean);
  // 动态禁用控制 (Dynamic disabled state control)
  dynamicDisabled?: boolean | ((opt: { model: Record<string, unknown>; field: string }) => boolean);
}

export interface DynamicFormProps {
  // 表单 Schema 定义 (Form schema definitions)
  schemas: FormSchema[];
  // 表单数据对象 (Form data model)
  model?: Record<string, unknown>;
  // 表单布局 (Form layout: horizontal, vertical, inline)
  layout?: 'horizontal' | 'vertical' | 'inline';
  // 标签布局配置 (Label layout configuration)
  labelCol?: Record<string, unknown>;
  // 控件布局配置 (Wrapper layout configuration)
  wrapperCol?: Record<string, unknown>;
  // 行布局配置 (Row configuration, e.g., gutter)
  rowProps?: Record<string, unknown>;
}
