import fs from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, type ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import packageJson from './package.json'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 設定閾值 (KB)
const SIZE_THRESHOLD = 200 * 1024 // 200KB

function getPackageSize(pkgName: string): number {
  try {
    const pkgPath = require.resolve(pkgName)
    const stats = fs.statSync(pkgPath)
    return stats.size
  } catch {
    return 0
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加載 .env 文件
  const env = loadEnv(mode, process.cwd())
  const domain = env.VITE_DOMAIN || 'localhost'
  const certPath = resolve(__dirname, `cert/${domain}.pem`)
  const keyPath = resolve(__dirname, `cert/${domain}-key.pem`)
  const isDev = mode !== 'production'
  const hasHttps = fs.existsSync(certPath) && fs.existsSync(keyPath)

  // 正確配置 https 選項
  const httpsConfig = hasHttps
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      }
    : undefined

  // 只暴露 VITE_ 前缀的环境变量给客户端
  const clientEnv: Record<string, string> = {}
  Object.keys(env).forEach((key) => {
    if (key.startsWith('VITE_')) {
      clientEnv[key] = env[key]
    }
  })

  return {
    define: {
      __APP_NAME__: JSON.stringify(packageJson.name),
      __APP_VERSION__: JSON.stringify(packageJson.version),
      // 僅在開發模式注入 process.env，方便 console.log
      ...(isDev ? { 'process.env': clientEnv } : {})
    },
    plugins: [
      vue(),
      AutoImport({
        // Auto import functions from Vue, Vue-Router, e.g. ref, reactive, toRef, useRoute, useRouter...
        imports: ['vue', 'vue-router'],
        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true, // 生成 ESLint globals
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true // 設置為 readonly
        }
      }),
      Components({
        // Auto register Element Plus components
        // 只用部分組件，importStyle: 'sass' 可以減少 CSS 導入
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5001,
      // open: true,
      open: `https://${domain}:5001`, // 指定打開的域名和端口
      https: httpsConfig,
      hmr: {
        host: domain, // 明確告訴 Vite HMR 連接使用的域名，而不是默認 localhost (避免報錯)
        protocol: hasHttps ? 'wss' : 'ws'
      },
      proxy: {
        /**
         * 代理 /web-v1 前綴的請求 (可配置多個代理)
         * axios 示例：axios.get('/web-v1/user/info')
         * 請求會被 Vite 自動轉發到：https://<env.VITE_BASE_URL>/web-v1/user/info
         * 如果後端 HTTPS 使用自簽證書，可能需要 secure: false
         */
        '/api': {
          target: env.VITE_BASE_URL, // 後端服務地址
          changeOrigin: true // 修改請求頭中的 host 為 target
          // rewrite: path => path.replace(/^\/api/, '') // 去掉前綴
        }
      }
    },
    // 设置scss的api类型为modern-compiler
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
          silenceDeprecations: ['legacy-js-api'], // 不出現 `legacy JS API Deprecation Warning` 提示
          additionalData: `@use "@/styles/element/variables.scss" as *;`
        }
      }
    }
  }
})
