/**
 * =============================================================================
 * 檔名: scripts/generate-aes-env.js
 * 描述: 生成安全的 AES-256 隨機 IV，並寫入 .env 文檔
 *      用於項目加密配置，支持 AES-256-CBC/GCM 等模式
 *      僅更新 AES_SECRET_IV，保留原有 AES_SECRET_KEY 及 .env 檔案其他設定
 *
 * 使用方法:
 * 1. 確保在專案根目錄下存在 scripts/ 目錄，並放置此檔案
 * 2. 在終端機運行：
 *      node scripts/generate-aes-env.js
 * 3. 腳本會在現有 .env 檔案中更新：
 *      AES_SECRET_IV (16字節隨機 IV)
 *      // AES_SECRET_KEY (32字节随机密钥)
 *    AES_SECRET_KEY 及其他變數保持不變。
 * =============================================================================
 */

import fs from 'fs'
import crypto from 'crypto'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
let envContent = ''

// 讀取現有 .env 內容
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8')
} else {
  console.error('.env 檔案不存在，請先建立 .env 檔案')
  process.exit(1)
}

// 生成新的 AES Key 和 IV
const AES_IV = crypto.randomBytes(16).toString('hex') // 32字元 hex
// const AES_KEY = crypto.randomBytes(32).toString('hex') // 64字元 hex

// 替換現有 AES_SECRET_IV，如果不存在則新增
if (/^AES_SECRET_IV=.*$/m.test(envContent)) {
  envContent = envContent.replace(/^AES_SECRET_IV=.*$/m, `AES_SECRET_IV=${AES_IV}`)
} else {
  envContent += `\nAES_SECRET_IV=${AES_IV}`
}

// 替換現有 AES_SECRET_KEY， 如果不存在則新增
// if (/^AES_SECRET_KEY=.*$/m.test(envContent)) {
//   envContent = envContent.replace(/^AES_SECRET_KEY=.*$/m, `AES_SECRET_KEY=${AES_KEY}`);
// } else {
//   envContent += `\nAES_SECRET_KEY=${AES_KEY}`;
// }

// 寫回 .env 檔案
fs.writeFileSync(envPath, envContent, 'utf8')

console.log('.env 檔案已更新 AES_SECRET_IV（AES_SECRET_KEY 及其他設定保持不變）')
console.log(`AES_SECRET_IV=${AES_IV}`)
// console.log(`AES_SECRET_KEY=${AES_KEY}`);
