// scripts/generate-cert.js
import { mkdirSync, existsSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

// 等效於 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 讀取 .env.local 或 .env 中的 VITE_DOMAIN
function loadDomainFromEnvFiles() {
  const envFiles = ['.env.local', '.env']
  for (const file of envFiles) {
    const fullPath = path.resolve(__dirname, '..', file)
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf-8')
      const match = content.match(/VITE_DOMAIN\s*=\s*(.+)/)
      if (match) return match[1].trim()
    }
  }
  return null
}

const domain = process.env.DOMAIN || loadDomainFromEnvFiles()

if (!domain) {
  console.error('❌ 請指定環境變量 DOMAIN，例如：DOMAIN=www.dev.worky.com.tw npm run cert')
  process.exit(1)
}

const certDir = path.resolve(__dirname, '../cert')
if (!existsSync(certDir)) {
  mkdirSync(certDir)
}

const certPath = path.join(certDir, `${domain}.pem`)
const keyPath = path.join(certDir, `${domain}-key.pem`)

console.log(`📜 為域名 ${domain} 生成本地證書...`)

try {
  execSync(`mkcert -install`)
  execSync(`mkcert -key-file "${keyPath}" -cert-file "${certPath}" "${domain}"`)
  console.log('✅ 本地證書生成成功：')
  console.log(`  - 證書: ${certPath}`)
  console.log(`  - 私匙: ${keyPath}`)
} catch (err) {
  console.error('❌ 生成證書失敗:', err.message)
}
