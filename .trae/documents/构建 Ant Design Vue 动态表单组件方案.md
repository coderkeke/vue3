# 构建 Ant Design Vue 4.x 动态表单组件 (SchemaForm) 方案

我将为您构建一个基于配置驱动的通用表单组件 `SchemaForm`，支持动态渲染、表单联动、插槽扩展和 TS 类型提示。

## 1. 核心设计思路
- **数据驱动**：通过 `schema` 数组定义表单结构（类似 `columns`）。
- **双向绑定**：组件内部通过 `v-model:model` 与外部数据同步。
- **动态联动**：支持函数式配置 `ifShow` 和 `componentProps`，实现字段间的联动控制。
- **插槽扩展**：支持自定义插槽，应对复杂业务场景。

## 2. 文件结构规划
我们将创建 `src/components/SchemaForm` 目录，包含以下文件：
- `types.ts`: 定义表单配置的 TypeScript 类型接口。
- `SchemaForm.vue`: 核心表单组件实现。
- `SchemaFormItem.vue`: (可选) 单个表单项封装，保持代码整洁。
- `hooks/useForm.ts`: (可选) 提供便捷的表单操作 Hook。

本次我们将重点实现核心的 `SchemaForm.vue` 和 `types.ts`。

## 3. 详细实现方案

### 3.1 类型定义 (`types.ts`)
定义核心接口 `FormSchema`，包含：
- `field`: 字段名
- `component`: 组件类型 ('Input', 'Select', 'DatePicker' 等)
- `label`: 标签文本
- `componentProps`: 组件参数（支持对象或函数，用于联动）
- `rules`: 校验规则
- `ifShow`: 动态显示控制（函数或布尔值）
- `slot`: 自定义插槽名称

### 3.2 组件实现 (`SchemaForm.vue`)
- **Props**:
    - `schema`: 表单配置数组
    - `model`: 表单数据对象
    - `layout`, `labelCol`, `wrapperCol`: 布局配置
- **Features**:
    - 自动映射 Ant Design Vue 组件。
    - 处理 `v-model` 绑定（区分 `value` 和 `checked`）。
    - 实现 `Grid` 栅格布局。
    - 暴露 `validate`, `resetFields` 等原生 Form 方法。
- **Events**:
    - `submit`: 提交事件
    - `reset`: 重置事件

### 3.3 演示页面 (`views/demo/form/DynamicForm.vue`)
创建一个完整的演示页面，展示：
- 基础表单渲染
- 表单校验
- **动态联动**：例如 "选择不同角色显示不同输入框"。
- **插槽使用**：自定义渲染某个字段。

## 4. 执行步骤
1.  **创建目录和文件**：新建 `src/components/SchemaForm` 及相关文件。
2.  **编写类型定义**：在 `types.ts` 中定义严谨的 TS 类型。
3.  **实现核心组件**：编写 `SchemaForm.vue`，处理组件映射和动态逻辑。
4.  **创建演示路由**：在路由中注册演示页面。
5.  **编写演示代码**：在 `src/views/demo/form/DynamicForm.vue` 中展示完整用法。

请确认是否开始执行此方案？
