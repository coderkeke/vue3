import {
  Input,
  InputNumber,
  Select,
  TreeSelect,
  Radio,
  Checkbox,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
  Rate,
  Slider,
} from 'ant-design-vue';
import type { Component } from 'vue';
import type { ComponentType } from './types';

const componentMap = new Map<ComponentType, Component>();

// Input
componentMap.set('Input', Input);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Password', Input.Password);
componentMap.set('TextArea', Input.TextArea);

// Select
componentMap.set('Select', Select);
componentMap.set('TreeSelect', TreeSelect);
// componentMap.set('ApiSelect', ApiSelect); // Need implementation

// Checkbox / Radio / Switch
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('Switch', Switch);

// Date
componentMap.set('DatePicker', DatePicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('TimePicker', TimePicker);

// Other
componentMap.set('Upload', Upload);
componentMap.set('Rate', Rate);
componentMap.set('Slider', Slider);

export { componentMap };
