---
name: axios-token-baseurl-error
description: 當使用者在 React + Vite 或前端專案中提到 axios、api client、baseURL、token、Authorization、Bearer、interceptor、error handling 或 API 存取層時，優先使用這個 skill。這個 skill 專門規範只封裝 axios 的 baseURL、token 與 error 方法，不封裝 endpoint，endpoint 應直接在 feature 或業務模組內使用。
---

# Axios Token BaseURL Error

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 20,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm add axios",
    "node -e \"const fs=require('fs'),p=require('path');const w=(f,s)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,s)};w('src/shared/api/token.ts','export function getAccessToken(){return localStorage.getItem(\\\"accessToken\\\") || \\\"\\\"}\\n');w('src/shared/types/api.ts','export type ApiErrorPayload = { message?: string; code?: string; details?: unknown }\\nexport class ApiError extends Error { status?: number; code?: string; details?: unknown; constructor(input: { message: string; status?: number; code?: string; details?: unknown }) { super(input.message); this.status = input.status; this.code = input.code; this.details = input.details } }\\n');w('src/shared/api/errors.ts','import axios from \\\"axios\\\";\\nimport { ApiError, type ApiErrorPayload } from \\\"@/shared/types/api\\\";\\nexport function normalizeApiError(error: unknown) { if (error instanceof ApiError) return error; if (axios.isAxiosError<ApiErrorPayload>(error)) { const status = error.response?.status ?? 0; const payload = error.response?.data; return new ApiError({ message: payload?.message ?? \\\"發生未預期錯誤，請稍後再試。\\\", status, code: payload?.code ?? \\\"UNKNOWN_ERROR\\\", details: payload ?? error.message }) } return new ApiError({ message: \\\"發生未預期錯誤，請稍後再試。\\\", details: error }) }\\n');w('src/shared/api/client.ts','import axios, { AxiosHeaders } from \\\"axios\\\";\\nimport { getAccessToken } from \\\"./token\\\";\\nexport const apiClient = axios.create({ baseURL: \\\"/api\\\", headers: { Accept: \\\"application/json\\\", \\\"Content-Type\\\": \\\"application/json\\\" } });\\napiClient.interceptors.request.use((config) => { const headers = AxiosHeaders.from(config.headers); const accessToken = getAccessToken(); if (accessToken) headers.set(\\\"Authorization\\\", \\\"Bearer \\\" + accessToken); config.headers = headers; return config });\\n');\""
  ],
  "verificationCommands": [
    "pnpm build"
  ]
}
```

這個 skill 用來處理前端專案中的 axios 寫法。

目標很明確：

1. 只封裝 `baseURL`
2. 只封裝 `token`
3. 只封裝 `error` 正規化方法
4. 不封裝 endpoint
5. endpoint 直接在 feature 內使用

## 何時使用

遇到以下情況時，直接使用這個 skill：

1. 使用者要安裝或導入 `axios`
2. 使用者要建立 `shared/api/client.ts`
3. 使用者要處理 `Authorization` 或 `Bearer token`
4. 使用者要整理前端 API error handling
5. 使用者要整理 token 注入或登入後的 API headers
6. 使用者提到 `baseURL`、`token`、`interceptor`、`axios error`
7. 使用者要重構前端 API 層，但不希望過度封裝 endpoint

如果使用者明確表示「endpoint 不需要封裝」，就必須遵守，不要另外建立多餘的 request wrapper 或 endpoint service 層。

## 專案預設放置位置

```text
src/
  shared/
    api/
      client.ts
      errors.ts
      token.ts

  features/
    <feature-name>/
      api/
      hooks/
```

## 核心原則

### 1. `client.ts` 只負責 axios client

`src/shared/api/client.ts` 的責任：

1. 建立 axios instance
2. 設定 `baseURL`
3. 設定共用 headers
4. 在 request interceptor 掛上 token

不要在這裡做：

1. endpoint 字串集中管理
2. CRUD helper 工廠
3. feature 專屬 request function
4. 回傳資料 mapper
5. toast
6. 畫面邏輯

### 2. `errors.ts` 只負責 error 正規化

`src/shared/api/errors.ts` 的責任：

1. 判斷是不是 axios error
2. 讀取 `response.status`
3. 轉成專案內統一的 error 物件
4. 提供預設錯誤訊息與錯誤代碼

不要把 loading state、toast 顯示或 retry 流程塞進這裡，除非使用者有明確要求。

### 3. endpoint 不封裝成共用層

這個專案的偏好是：

1. 不建立 `request.ts`
2. 不建立 `baseApi.ts`
3. 不建立 endpoint constants 集中檔
4. 不建立過度抽象的 service wrapper

直接在 feature 內使用：

```ts
apiClient.get('/home/resources')
apiClient.post('/profile/update', payload)
```

endpoint 要靠近使用它的 feature，這樣比較容易維護。

### 4. token 應由獨立來源提供

token 可以來自任何符合專案需求的來源，例如：

- `src/shared/api/token.ts`
- localStorage
- cookie
- state manager
- auth module
- session provider

只要最後能取得 token 字串，axios client 就只負責：

1. 讀 token
2. 組 `Authorization` header

如果當下沒有 token，應避免強塞無效值，改為根據專案需求決定是否略過 `Authorization` header。

## 推薦實作

### `src/shared/api/client.ts`

推薦保持精簡：

```ts
import axios, { AxiosHeaders } from 'axios'
import { getAccessToken } from './token'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers)
  const accessToken = getAccessToken()

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  config.headers = headers

  return config
})
```

如果使用者沒有要求，不要額外加：

1. response interceptor
2. retry
3. refresh token flow
4. 通用 request wrapper

### `src/shared/api/errors.ts`

```ts
import axios from 'axios'
import { ApiError, type ApiErrorPayload } from '../types/api'

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status ?? 0
    const payload = error.response?.data

    return new ApiError({
      message: payload?.message ?? '發生未預期錯誤，請稍後再試。',
      status,
      code: payload?.code ?? 'UNKNOWN_ERROR',
      details: payload ?? error.message,
    })
  }

  return new ApiError({
    message: '發生未預期錯誤，請稍後再試。',
    details: error,
  })
}
```

### feature 內直接打 endpoint

```ts
import { apiClient } from '../../../shared/api/client'
import { normalizeApiError } from '../../../shared/api/errors'

async function fetchHomeData() {
  try {
    const response = await apiClient.get('/home/resources')
    return response.data
  } catch (error) {
    throw normalizeApiError(error)
  }
}
```

這裡是本 skill 的關鍵：

不要再把 `/home/resources` 抽去共用 endpoint registry。

## 與 feature-based 架構的配合方式

### 建議做法

1. `shared/api/client.ts` 放 axios client
2. `shared/api/errors.ts` 放 error normalize
3. `shared/api/token.ts` 放 token 取得方式
4. feature 內的 hook 或 api 檔直接呼叫 `apiClient`

### 例如

```text
src/
  shared/
    api/
      client.ts
      errors.ts
      token.ts

  features/
    home/
      api/
        homeApi.ts
      hooks/
        useHomeContent.ts
```

如果一個 endpoint 只服務某個 feature，就讓它留在該 feature 附近，不要提升到 shared。

## 什麼情況不要過度封裝

如果需求只是：

1. 設定 `baseURL`
2. 掛上 token
3. 統一處理 error

那就不要額外新增：

1. `request.ts`
2. `serviceFactory.ts`
3. `apiEndpoints.ts`
4. `http.ts` + `api.ts` + `service.ts` 三層包裝
5. 過度泛型化的 CRUD helper

這些都會讓簡單需求變得更重。

## 修改時的判斷順序

1. 先看使用者是否明確說「endpoint 不要封裝」
2. 若有，直接遵守
3. 只保留 `client.ts` 與 `errors.ts`
4. endpoint 直接在 feature 使用
5. 只在真的有多個 feature 共用需求時，才考慮提升共用邏輯

## 回覆使用者時應該說明什麼

完成修改後，回覆時應清楚說明：

1. 哪些檔案被新增或修改
2. `axios` 現在只封裝了什麼
3. endpoint 目前是在哪裡直接使用
4. token 來源與 error handling 是否有調整
5. build 與 lint 是否通過

## 回覆範例

可以像這樣回覆：

```md
已改成你要的方式。

1. `src/shared/api/client.ts` 只保留 `baseURL` 與 `token`
2. `src/shared/api/errors.ts` 負責 error 正規化
3. endpoint 沒有再額外封裝，直接在 `src/features/home/hooks/useHomeContent.ts` 使用 `apiClient.get('/home/resources')`
4. `pnpm build` 通過
5. `pnpm lint` 通過
```

## 驗證

完成後預設執行：

```bash
pnpm build
pnpm lint
```

如果使用者正在問「專案怎麼啟動」，一併提供：

```bash
pnpm install
pnpm dev
```
