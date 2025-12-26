import type { App, Directive } from 'vue'
import { useUserStore } from '@/stores/user'

const auth: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const { value } = binding
    const permissions = userStore.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = permissions.some((role) => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }
    } else if (value && typeof value === 'string') {
      const hasPermission = permissions.includes(value)
      if (!hasPermission) {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need roles! Like v-auth="['system:user:add','system:user:edit']" or v-auth="'system:user:add'"`)
    }
  },
}

export function setupAuthDirective(app: App) {
  app.directive('auth', auth)
}
