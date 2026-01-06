# Project Development Rules

## 1. Vue Component Specification
- **Template Attribute Order**: Follow `vue/attributes-order` standard:
  1. **Definition** (e.g. `is`)
  2. **List Rendering** (e.g. `v-for`)
  3. **Conditionals** (e.g. `v-if`, `v-else-if`, `v-else`, `v-show`, `v-cloak`)
  4. **Render Modifiers** (e.g. `v-pre`, `v-once`)
  5. **Global Awareness** (e.g. `id`)
  6. **Unique Attributes** (e.g. `ref`, `key`)
  7. **Two-Way Binding** (e.g. `v-model`)
  8. **Other Directives** (e.g. `v-custom-directive`)
  9. **Events** (e.g. `@click`, `v-on="event"`)
  10. **Content** (e.g. `v-html`, `v-text`)
- **Attribute Naming**: Must use **kebab-case** in templates (e.g., `<MyComponent my-prop="val" />`).
- **Component Naming**: Use **PascalCase** for component file names and `name` options.

## 2. TypeScript & Code Quality
- **Strict Typing**: **Explicitly forbid `any`**. Use specific interfaces, `unknown`, or Generics.
- **Comments**: **Mandatory Chinese comments** for:
  - Complex business logic
  - Interface/Type definitions
  - Component props and events
  - API service methods

## 3. UI & Styling
- **CSS Preprocessor**: Use **Less** for styling.
- **Form Development**: **MANDATORY** usage of `src/components/DynamicForm`.
  - Do **NOT** use `a-form` directly in views.
  - Define forms using `schemas` configuration.

## 4. API & Data Interaction
- **API Definition**: centralized in `src/api` modules.
- **Response Handling**: Use `UnifiedResponse` and proper type interfaces for response data.
