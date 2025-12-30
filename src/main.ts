import { createApp } from 'vue'
import 'virtual:uno.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'normalize.css/normalize.css'
import './style.css'
import './styles/index.less'
import App from './App.vue'
import router from './router'
import { setupAuthDirective } from './directives/auth'
import './router/guard/permission' // 引入路由守卫

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
setupAuthDirective(app)

app.mount('#app')
