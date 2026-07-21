---
name: nuxt4-creater
description: Nuxt 4 通用專案建立、啟動、驗證與維護。首次建立新專案時 scaffold Nuxt app 與 section composition 架構：共用 components 組成 page-specific content sections，多個 content sections 組成 route pages。當需要建立或初始化 Nuxt 4 專案、建立 app/server/shared 目錄架構、加入 pages、app/content、components、composables、plugins、store、server routes，或處理路由、SEO/meta、runtime config、Nuxt plugin warnings、模組與部署前驗證時使用。
---

# Nuxt 4 通用建立與維護

## 核心原則

保持此 skill 通用。專案名稱、絕對路徑、品牌內容、固定頁面清單、語系、API schema 與既有路由名稱都以使用者輸入與 repo evidence 為準。

開始前先讀目前專案狀態：

- `package.json`
- lockfile
- `nuxt.config.*`
- `app/`、`server/`、`shared/`、`content/`
- 現有 scripts、CSS 入口、components 設定與 UI library

既有專案優先跟隨當地模式；新專案第一次使用此 skill 時，直接建立此 skill 的預設架構。只有在使用者要求時才把既有 Nuxt 3/root-level 結構遷移到 Nuxt 4 `app/` 結構。

## Package Manager

依 lockfile 使用既有 package manager；每次只採用一個由 lockfile 決定的 package manager：

- `pnpm-lock.yaml`：`pnpm`
- `package-lock.json`：`npm`
- `yarn.lock`：`yarn`
- `bun.lock` 或 `bun.lockb`：`bun`

新專案若使用者未指定 package manager，使用 `pnpm`。

常用命令依 package manager 對應：

| 動作 | pnpm | npm | yarn | bun |
| --- | --- | --- | --- | --- |
| 安裝依賴 | `pnpm install` | `npm install` | `yarn install` | `bun install` |
| 新增 dev dependency | `pnpm add -D <pkg>` | `npm install -D <pkg>` | `yarn add -D <pkg>` | `bun add -d <pkg>` |
| 執行 script | `pnpm <script>` | `npm run <script>` | `yarn <script>` | `bun run <script>` |

修改後只執行 `package.json` 內存在的驗證 script。優先順序是 `typecheck`、`lint`、`test`、`build`；若沒有其他驗證 script，至少執行 build。

## 建立新專案

互動式建立：

```powershell
pnpm create nuxt@latest <project-name>
```

非互動初始化空目錄時明確指定 package manager、git 初始化與 module prompt。只有在目標目錄是刻意用來初始化的空目錄，或使用者明確要求覆寫時，才使用 `--force`。

```powershell
pnpm create nuxt@latest . --template v4 --packageManager pnpm --gitInit false --no-install --no-modules --force
pnpm install --frozen-lockfile=false
node <skill-dir>/scripts/bootstrap-02-section-architecture.cjs
```

Bundled bootstrap metadata 是 pnpm 範例。若使用 npm、yarn 或 bun，保留相同步驟但改成對應 package manager 命令：

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "framework",
  "framework": "nuxt4",
  "order": 0,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create nuxt@latest . --template v4 --packageManager pnpm --gitInit false --no-install --no-modules --force",
    "if test -f .opencode/skills/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; then node .opencode/skills/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; fi",
    "pnpm install --frozen-lockfile=false",
    "if test -f .opencode/skills/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; then node .opencode/skills/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; fi"
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "if test -f .opencode/skills/nuxt4-creater/scripts/runtime-smoke-sandbox.cjs; then node .opencode/skills/nuxt4-creater/scripts/runtime-smoke-sandbox.cjs --cwd \"$PWD\" --port $PORT; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/runtime-smoke-sandbox.cjs --cwd \"$PWD\" --port $PORT; fi",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/api/health"
}
```

Runtime smoke in OpenCode Project Flow must use `scripts/runtime-smoke-sandbox.cjs`.
Do not run `pnpm exec nuxt dev` directly from `/workspace` for Nuxt smoke checks; Docker bind mounts can make Nuxt/Vite dev readiness hang even when the same app works from `/tmp`.

## 首次專案架構建立

新 Nuxt 4 專案第一次使用此 skill 時，直接執行 bundled architecture bootstrap，並同步建立 section composition 所需的基礎架構：

```powershell
node <skill-dir>/scripts/bootstrap-02-section-architecture.cjs
```

它會建立或補齊：

- `app/app.vue`
- `app/layouts/default.vue`
- `app/pages/index.vue`
- `app/content/home/HomeHero.vue`
- `app/content/home/HomeFeature.vue`
- `app/content/home/HomeContact.vue`
- `app/components/app/AppHeader.vue`
- `app/components/app/AppFooter.vue`
- `app/components/ui/BaseContainer.vue`
- `app/components/ui/BaseSection.vue`
- `app/components/ui/BaseCard.vue`
- `app/components/ui/BaseButton.vue`
- `app/components/seo/SeoJsonLd.vue`
- `app/constants/site.ts`
- `server/api/health.get.ts`
- `app/composables/`、`app/plugins/`、`app/store/`、`app/types/`、`app/utils/`
- `server/api/`、`server/routes/`、`server/utils/`
- `shared/types/`、`shared/utils/`

此 script 是 first-use scaffold：它會建立缺少的檔案，並只替換明確可辨識的 Nuxt welcome/default files。對已有自訂內容的既有專案，先讀現況，再手動套用相同架構規則。

## Nuxt 4 目錄結構

新專案採用 Nuxt 4 `app/` 結構與下列分工：

- `app/app.vue`：應用入口，通常放 `<NuxtLayout>`、`<NuxtPage>` 與 route announcer
- `app/pages/`：route pages，只做路由層組裝
- `app/layouts/`：頁面 layout
- `app/components/app/`：全站框架元件，例如 header、footer；頁面 layout 放在 `app/layouts/`
- `app/components/ui/`：跨頁共用 UI primitives，例如 button、card、container、section
- `app/components/seo/`：SEO 與 structured data 輔助元件
- `app/components/<domain>/`：跨頁共用的 domain display components
- `app/constants/`：集中管理站台固定參數，例如站名、導覽、SEO 預設值與 starter content
- `app/content/<page>/`：頁面專屬 content section components
- `app/composables/`：auto-imported composables
- `app/plugins/`：Nuxt plugins
- `app/middleware/`：route middleware
- `app/assets/`：會進入 build pipeline 的樣式與資產
- `app/utils/`：app 端工具函式
- `server/api/`：`/api/*` server endpoints
- `server/routes/`：非 `/api` prefix 的 server routes
- `server/utils/`：Nitro server 端工具函式
- `shared/types/` 與 `shared/utils/`：前後端共用型別與工具
- `public/`：原樣公開的靜態檔案
- `content/`：只有在使用 Nuxt Content module 儲存 Markdown 或 collections 時才建立

`server/` 保留在專案根目錄。明確區分 `app/content/` 與根目錄 `content/`：前者是 Vue content section components，後者是 Nuxt Content module 的資料來源。

## Section Composition 架構

此 skill 的通用頁面架構是三層組裝：

- `components`：可跨頁重用的 UI、layout、SEO 或 domain components，不綁定單一路由文案或頁面順序。
- `app/content/<page>`：頁面專屬 sections。每個檔案代表頁面上一個可排序區塊，例如 hero、features、story、pricing、contact CTA。
- `app/pages`：route layer。page 檔負責 SEO/meta、layout 選擇、route-level data fetching 與 sections 排列。

新專案建議啟用 `components` 與 `content` auto-import，讓 page 能直接組裝 sections：

```ts
export default defineNuxtConfig({
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/content', pathPrefix: false }
  ]
})
```

若既有專案已有不同 auto-import 或命名規則，先跟隨既有規則。

Page 範例：

```vue
<template>
  <HomeHero />
  <HomeFeature />
  <HomeContact />
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Page title',
  description: 'Page description'
})
</script>
```

`app/app.vue` 應啟用官方 layout wrapper：

```vue
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Content section 範例：

```vue
<template>
  <BaseSection>
    <BaseCard>
      <h2>Feature title</h2>
      <p>Feature summary.</p>
    </BaseCard>
  </BaseSection>
</template>
```

命名與提升規則：

- content section 使用 `<PageName><SectionName>.vue`，例如 `HomeHero.vue`、`AboutStory.vue`、`ContactForm.vue`
- page-specific section 留在 `app/content/<page>/`
- 兩個以上頁面共用的 section 或展示元件，提升到 `app/components/<domain>/` 或 `app/components/ui/`
- route page 保持組裝層；大量 markup 先抽成 content section
- UI primitive 保持 route、API schema、品牌文案與頁面順序無關

## Starter CSS

Nuxt framework scaffold 使用 `app/assets/css/main.css` 作為最小 base CSS。這個 CSS 只支援預設 app shell、container、section、card、button 與首頁 starter components。

更新 `nuxt.config.ts` 時只加入缺少的 Nuxt framework 設定，保留既有 `modules`、`components`、`runtimeConfig`、`vite` 與其他 plugins。

新增 UI library、CSS framework、design system 或 app-specific theme 時，使用對應 skill 或專案既有模式管理。

## 路由、SEO 與資料

新增頁面時先檢查現有路由慣例。如果專案已有 centralized route config、navigation config、sitemap config 或 SEO helper，必須同步更新；單一頁面需求維持局部更新。

Nuxt pages 命名慣例：

- `app/pages/index.vue` 對應 `/`
- `app/pages/about.vue` 對應 `/about`
- `app/pages/blog/[slug].vue` 對應 `/blog/:slug`
- `app/pages/docs/[...slug].vue` 對應 catch-all route

頁面 SEO 優先使用 `useSeoMeta`、`useHead` 或專案既有 SEO helper。新增 route meta 時保持 title、description、canonical、Open Graph 與 JSON-LD 的資料來源一致。

資料請求優先跟隨 Nuxt 官方 data fetching primitives：`useFetch` 用於直覺的 setup/route data，`useAsyncData` 用於包自訂 query function。API transport、endpoint helpers 與 business wrappers 由 API layer 管理。

環境變數優先放在 `runtimeConfig`：

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || ''
    }
  }
})
```

Client 可讀資料放在 `runtimeConfig.public`；server-only secret 保留在 `runtimeConfig` 的 server-only 欄位。

頁面資料抓取用這個直覺判斷：如果只是呼叫一個 URL，且資料會直接出現在頁面上，用 `useFetch`：

```ts
const { data, error, status } = await useFetch<User[]>('/api/users', {
  query: { page: 1 },
})
```

如果資料來源已經包成業務命名 function，讓頁面用 `useAsyncData` 呼叫該 wrapper，資料流會比較清楚：

```ts
const { data, error, status } = await useAsyncData('users', () => getUsers({ page: 1 }))
```

## Nuxt Plugin Warnings

Nuxt plugins 應放在 `app/plugins/`，且 app 自訂 plugin 檔必須 default export `defineNuxtPlugin(...)`。更新範圍維持在專案自己的 plugin 檔。

自訂 plugin 正確格式：

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {}
  }
})
```

若看到下列 warning：

```text
[NUXT_B2005] Plugin .../node_modules/nuxt/dist/pages/runtime/plugins/check-if-page-unused.js has no default export and will be ignored at build time.
```

按這個順序處理：

1. 先看 warning path。若 path 是 `node_modules/nuxt/dist/pages/runtime/plugins/check-if-page-unused.js`，這是 Nuxt 4.5.0 已知 internal plugin default-export detection false positive，不是專案 `app/plugins/` 寫錯。
2. 維持 `node_modules` 原樣，並保留 app plugin 清單只包含專案實際需要的 plugin。
3. 確認 `app/app.vue` 或 layout/page tree 有使用 `<NuxtPage />`，因為此 internal plugin 只在 pages integration 啟用時出現。
4. 若 build 成功，只記錄為 Nuxt 版本 warning，繼續交付。
5. 若團隊要求乾淨輸出，先查目前 Nuxt release/issue 狀態；升級到包含 nuxt/nuxt#35676 修正的版本。若尚未釋出且必須立刻消除 warning，可依專案政策暫時 pin 到未觸發此 regression 的 Nuxt 版本，並重新安裝依賴。

只有當 warning path 指向 `app/plugins/`、專案自訂 module、或第三方 module 產生的 plugin 時，才依 Nuxt plugin 規則補 default export 或調整 module 設定。

## 模組與驗證

新增 Nuxt modules 前先檢查 `nuxt.config.*` 與 package manager。安裝後同步更新 config，並執行可用驗證。

Nuxt modules 只按需求加入；新增 module 時同步更新 `nuxt.config.*` 與 package manager，並執行可用驗證。

需要啟動 dev server 時使用可用 port，優先檢查 `http://127.0.0.1:<port>`。完成後回報實際 URL 與已執行的驗證命令。

## 維護既有專案

對既有 Nuxt 專案工作時：

- 使用現有 component naming、auto-import、alias 與資料夾分層
- 保留現有 TypeScript、ESLint、Prettier、styling、UI library 與測試設定
- 新增內容型頁面時採用 page 組裝 content sections 的模式
- 新增共用樣式或結構時優先抽到 `app/components/ui/`
- 保持此 skill 的路由名稱、語系、API schema、品牌內容與絕對路徑都來自當前專案
