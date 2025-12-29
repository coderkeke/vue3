<template>
  <a-form
    ref="formRef"
    :model="model"
    :layout="layout"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row v-bind="rowProps" :gutter="[16, 16]">
      <template v-for="item in schemas" :key="item.field">
        <a-col v-if="getShow(item)" v-bind="getColProps(item)">
          <a-form-item
            v-bind="item.formItemProps"
            :label="item.label"
            :name="item.field"
            :rules="item.rules"
          >
            <!-- Slot Mode -->
            <template v-if="item.slot">
              <slot :name="item.slot" :model="model" :field="item.field"></slot>
            </template>

            <!-- Component Mode -->
            <component
              :is="getComponent(item.component)"
              v-else-if="item.component"
              v-bind="getBindValues(item)"
              v-on="getComponentEvents(item)"
            />
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { componentMap } from './componentMap'
import type { FormSchema, ComponentType } from './types'

interface Props {
  model: Record<string, unknown>
  schemas: FormSchema[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: Record<string, unknown>
  wrapperCol?: Record<string, unknown>
  rowProps?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  labelCol: () => ({ span: 6 }),
  wrapperCol: () => ({ span: 18 }),
  rowProps: () => ({}),
})

// Form Instance
const formRef = ref<FormInstance>()

// Get Value Prop Name (checked for Switch/Checkbox, value for others)
const getValuePropName = (type: ComponentType) => {
  if (['Switch', 'Checkbox'].includes(type)) {
    return 'checked'
  }
  if (type === 'Upload') {
    return 'fileList'
  }
  return 'value'
}

// Get Component
const getComponent = (type: ComponentType) => {
  return componentMap.get(type) || null
}

// Get Show (Visibility)
const getShow = (item: FormSchema) => {
  if (item.show === undefined) return true
  if (typeof item.show === 'boolean') return item.show
  if (typeof item.show === 'function') {
    return item.show({ model: props.model, field: item.field })
  }
  return true
}

// Get Disabled
const getDisabled = (item: FormSchema) => {
  if (item.dynamicDisabled === undefined) return false
  if (typeof item.dynamicDisabled === 'boolean') return item.dynamicDisabled
  if (typeof item.dynamicDisabled === 'function') {
    return item.dynamicDisabled({ model: props.model, field: item.field })
  }
  return false
}

// Get Col Props
const getColProps = (item: FormSchema) => {
  return item.colProps || { span: 24 }
}

// Update Model Value
const updateModelValue = (field: string, value: unknown) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.model[field] = value
}
// Get Bind Props (Values & Events)
const getBindValues = (item: FormSchema) => {
  const { component, field } = item
  if (!component) return {}

  const valuePropName = getValuePropName(component)

  // 基础 Props
  const bindProps: Record<string, unknown> = {
    ...getComponentProps(item),
    disabled: getDisabled(item),
  }

  // 绑定值。
  bindProps[valuePropName] = props.model[field]

  // 绑定事件 (onUpdate:value / onUpdate:checked / etc.)
  // Vue 3 supports 'onEventName' in v-bind object
  bindProps[`onUpdate:${valuePropName}`] = (val: unknown) => {
    updateModelValue(field, val)
  }

  return bindProps
}

// Get Component Events
const getComponentEvents = (item: FormSchema) => {
  return item.componentEvents || {}
}

const getComponentProps = (item: FormSchema) => {
  const { componentProps } = item
  if (!componentProps) return {}
  if (typeof componentProps === 'function') {
    return componentProps({ model: props.model, field: item.field })
  }
  return componentProps
}

// Expose Methods
const validate = () => {
  return formRef.value?.validate()
}

const resetFields = () => {
  return formRef.value?.resetFields()
}

const clearValidate = (name?: string | string[]) => {
  return formRef.value?.clearValidate(name)
}

const getFieldsValue = () => {
  return formRef.value?.getFieldsValue()
}

defineExpose({
  validate,
  resetFields,
  clearValidate,
  getFieldsValue,
  formRef,
})
</script>
