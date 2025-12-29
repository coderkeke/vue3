# DynamicForm 组件实施计划

我将为您构建一个基于配置驱动的动态表单组件，完全契合 Ant Design Vue 4.x 的生态。

## 1. 核心文件结构
将在 `src/components/DynamicForm` 目录下创建以下文件：
- `types.ts`: 定义 Schema 接口、组件类型枚举等。
- `componentMap.ts`: 建立字符串（如 'Input'）到 Ant Design Vue 组件的映射关系。
- `DynamicForm.vue`: 核心组件，负责渲染逻辑、布局、校验和事件处理。
- `index.ts`: 统一导出。

## 2. 详细实现细节

### A. 类型定义 (types.ts)
定义 `FormSchema` 接口，包含：
- `field`: 字段名
- `label`: 标签名
- `component`: 组件类型（Input, Select, DatePicker 等）
- `componentProps`: 组件参数（支持动态计算）
- `rules`: 校验规则
- `colProps`: 栅格布局配置（默认 span=24）
- `slot`: 自定义插槽名称
- `show`: 动态显隐控制函数

### B. 组件映射 (componentMap.ts)
预注册常用的 Ant Design Vue 表单组件，确保可以通过字符串引用：
- Input, InputNumber, Password, TextArea
- Select, TreeSelect, RadioGroup, CheckboxGroup, Switch
- DatePicker, RangePicker, TimePicker
- Upload

### C. 核心组件 (DynamicForm.vue)
- **模板结构**：`<a-form>` -> `<a-row>` -> `v-for (Schema)` -> `<a-col>` -> `<a-form-item>` -> `<component :is>`
- **Props**:
    - `schemas`: 表单定义数组
    - `model`: 表单数据对象 (v-model)
    - `labelCol`, `wrapperCol`: 布局配置
- **Slots**: 动态生成插槽，将 `model` 和 `field` 传递给父组件。
- **Expose**: 暴露 `validate`, `resetFields`, `clearValidate` 等原生 Form 方法。

## 3. 验证计划
我将在 `src/views/demo/FormDemo.vue` (或类似路径) 创建一个演示页面，包含：
1.  基础表单渲染
2.  栅格布局演示（一行多列）
3.  表单校验演示
4.  自定义插槽演示
5.  动态显隐联动演示

## 下一步操作
确认计划后，我将按顺序创建上述文件并实现代码。