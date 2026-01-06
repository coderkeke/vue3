import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@http': path.resolve(__dirname, 'src/http'),
    },
  },
  plugins: [
    vue(),
    UnoCSS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/smart-api': {
        target: 'http://192.168.133.40:8080',
        changeOrigin: true,
      },
    },
  },
})
