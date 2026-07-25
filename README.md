# Cedric's Web Development Space

Individual programming exercises, practical implementation of ideas.

## 項目部署

1. 安裝 `[Node.js 22](<https://nodejs.org/en>)`

   ```shell
   export NVM_DIR=/opt/nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | NVM_DIR=$NVM_DIR bash

   #以下程式碼從使用者的.bashrc移動到/etc/bashrc
   export NVM_DIR="/opt/nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

   nvm install 22 # 安裝 Node.js 22
   node -v
   nvm use 22.18.0 # 使用安裝的 Node.js 版本，以安裝的 node 版本號為准（替換：22.18.0）
   ```

   > 注意：使用 nvm 安裝新的 node.js 版本時，Terminal 終端會 **臨時啓用新安裝的版本**。
   >
   > **默認還是之前的版本**（可以新開一個 Terminal，執行 `node -v` 檢查）
   >
   > 所以需要執行 `nvm use 22.18.0`（注意將 `22.18.0` 替換為實際新安裝的版本號），將其設置為默認

2. 全局安裝 `yarn`

   ```sh
   npm install yarn -g
   ```

3. 在命令行中切換到項目開發目錄，運行如下命令安裝項目所需的 packages

   ```sh
   yarn
   ```

4. 配置完成。

## 本地運行項目

運行在不同環境時對應的後端 API 接口不同，API 接口對應當前環境的 `VITE_BASE_URL` 字段。

例如：運行測試環境時，對應的API接口為 `.env.test` 文檔的 `VITE_BASE_URL` 字段 (`https://test.api.cedric.com`)

```sh
yarn dev          #運行開發環境

yarn dev --mode next     # 運行 next 環境
```

## 本地部署 https

項目中可能會有部分外部 API 需要在 https 協議下才能成功調用，所以本地部署 https 變得必須。

1. 配置 hosts 文檔

   - **Windows** 路徑： `C:\Windows\System32\drivers\etc\hosts`
   - **macOS** 路徑：`/etc/hosts`

   在 hosts 文檔內添加以下配置（域名自定）：

   ```ini
   # local sites domain
   127.0.0.1      www.cedric.com
   ```

2. **安裝 `mkcert`**

   ```shell
   # macOS
   brew install mkcert
   brew install nss # 如果使用 Firefox
   ```

   windows 環境先安裝套件管理工具 `Scoop`，在 PowerShell 依次執行以下兩則命令就能安裝：

   ```shell
   Set-ExecutionPolicy RemoteSigned -scope CurrentUser
   iwr -useb get.scoop.sh | iex
   ```

   然後依次執行以下命令，用 `scoop` 安裝 `mkcert`:

   ```shell
   scoop bucket add extras
   scoop install mkcert
   ```

3. **生成本地 CA 並信任它**

   ```shell
   mkcert -install
   ```

   ```ini
   # 生成成功的訊息
   Created a new local CA 💥
   The local CA is now installed in the system trust store! ⚡️
   Note: Firefox support is not available on your platform. ℹ️
   ```

4. **測試**

   ```shell
   mkcert localhost 127.0.0.1 ::1

   # 測試域名
   mkcert www.cedric.com
   ```

   第一條命令會生成兩個文檔：

   - `localhost+2.pem` （證書）
   - `localhost+2-key.pem` (私匙)

   它們的名稱可以自定義修改。

5. **添加 `.env.local` 文檔**

   在本地開發目錄 `DevRoom` 下新建 `.env.local` 文檔，並在文檔中配置本地 Domain：

   ```ini
   # LOCAL DOMAIN
   VITE_DOMAIN=www.cedric.com
   ```

6. **生成證書**

   在項目中運行以下命令，會在項目根目錄中生成 `/cert` 目錄，並在該目錄中自動生成 `${domain}.pem`、`${domain}-key.pem`兩個證書文檔：

   ```shell
   yarn cert
   ```

   > 到此，https 配置完成，運行項目即可在本地開啓 https 訪問本地的 domain

7. **關閉 https**

   如果想關閉 https 協議，只需要在 **`vite.config.js`** 中**移除或注釋掉** **`server.https`** 這一項即可

   ```js
   // vite.config.js
   server: {
      ...
      // https: {
      //   key: fs.readFileSync(keyPath),
      //  cert: fs.readFileSync(certPath)
      // },
      ...
    },
   ```

## 本地 Nginx 部署 https

1. **生成自簽名 SSL 證書（本地測試用）**

   使用 Git Bash 自帶的 OpenSSL 依次執行以下命令：

   ```shell
   # 假設在目錄 E:/wwwroot 下
   mkdir -p ~/nginx_certs
   cd ~/nginx_certs

   # 生成私钥
   openssl genrsa -out server.key 2048

   # 生成证书签名请求（CSR）
   openssl req -new -key server.key -out server.csr

   # 生成自签名证书，有效期365天
   openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
   ```

2. **配置 Nginx HTTPS 站點**

   編輯你的 Nginx 配置文件，一般路徑是 `/nginx-x.xx.x/conf/nginx.conf`：

   ```ini
   server {
      # 配置端口
      listen               8001 ssl;
      # 本地 domain
      server_name          www.cedric.com;

      # 證書文件
      ssl_certificate      E:/wwwroot/nginx_certs/server.crt;
      ssl_certificate_key  E:/wwwroot/nginx_certs/server.key;

      ssl_protocols        TLSv1.2 TLSv1.3;
      ssl_ciphers          HIGH:!aNULL:!MD5;

      # 站點路徑
      root E:/wwwroot/worky-emp-web;
      index index.html index.htm;

      location / {
         try_files $uri $uri/ /index.html;
      }
   }
   ```

   > **注意**根據你的設置，替換配置中的：端口號、本地 domain、證書和站點路徑。

## 打包發佈

```sh
# 發佈目錄為與開發目錄（`/DevRoom`）同級的 `/Web`
yarn build          # 發佈正式（production）環境

yarn build --mode next     # 發佈 next 環境
```

## 新增環境

如果需要新增其它環境，在開發目錄下創建對應的 `.env` 文檔，如：`.env.next-staging`，對應的 **「運行」** 和 **「發佈」** 命令為：

```sh
# 運行
yarn dev --mode next-staging

# 發佈
yarn build --mode next-staging
```

## 服務器配置

由於我們的應用程式是一個單頁應用，如果沒有適當的伺服器配置，使用者在瀏覽器中直接存取 `https://example.com/user/id`，就會得到一個 404 錯誤。這就尷尬了。

不用擔心：要解決這個問題，我們需要在伺服器上新增一個簡單的回退路由。如果 URL 不符合任何靜態資源，它應提供與應用程式中的 `index.html` 相同的頁面。漂亮依舊!

**官方文檔：** <https://router.vuejs.org/zh/guide/essentials/history-mode.html#Apache>

### nginx

```nginx
location / {
  index  index.html;
  try_files $uri $uri/ /index.html;
}
```

---

## Introduction

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
