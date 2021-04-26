import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path'

const baseUrl = {
    development: './',
    beta: './',
    release: './'
}

// https://vitejs.dev/config/  element plus vite的配置
export default ({ mode }) => defineConfig({
    plugins: [
        vue(),
        vitePluginImport([{
            libraryName: 'element-plus',
            libraryDirectory: 'es',
            style(name) {
                return `element-plus/lib/theme-chalk/${name}.css`;
            },
        }])
    ],
    base: baseUrl[mode],
    resolve: {
        //配置标识路径
        alias: {
            '~': path.resolve(__dirname, './'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        //配置反向代理
        proxy: {
            '/api': {
                target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})