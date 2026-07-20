---
name: nuxt4-creater
description: Nuxt 4 通用專案建立、啟動、驗證與維護。首次建立新專案時直接 scaffold Tailwind CSS v4 與 section composition 架構：共用 components 組成 page-specific content sections，多個 content sections 組成 route pages。當需要建立或初始化 Nuxt 4 專案、配置 Tailwind CSS、建立 app/server/shared 目錄架構、加入 pages、app/content、components、composables、plugins、stores、server routes，或處理路由、SEO/meta、runtime config、Nuxt plugin warnings、模組與部署前驗證時使用。
---

# Nuxt 4 通用建立與維護

## 核心原則

保持此 skill 通用。不要假設專案名稱、絕對路徑、品牌內容、固定頁面清單、語系、API schema 或既有路由名稱。

開始前先讀目前專案狀態：

- `package.json`
- lockfile
- `nuxt.config.*`
- `app/`、`server/`、`shared/`、`content/`
- 現有 scripts、CSS 入口、components 設定與 UI library

既有專案優先跟隨當地模式；新專案第一次使用此 skill 時，直接建立此 skill 的預設架構。只有在使用者要求時才把既有 Nuxt 3/root-level 結構遷移到 Nuxt 4 `app/` 結構。

## Package Manager

依 lockfile 使用既有 package manager，不要混用 lockfile：

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
pnpm add -D tailwindcss @tailwindcss/vite
node <skill-dir>/scripts/bootstrap-01-tailwind-v4.cjs
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
    "pnpm add -D tailwindcss @tailwindcss/vite",
    "if test -f .opencode/skills/nuxt4-creater/scripts/bootstrap-01-tailwind-v4.cjs; then node .opencode/skills/nuxt4-creater/scripts/bootstrap-01-tailwind-v4.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/bootstrap-01-tailwind-v4.cjs; fi",
    "if test -f .opencode/skills/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; then node .opencode/skills/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/bootstrap-02-section-architecture.cjs; fi"
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm exec nuxt dev --host 127.0.0.1 --port $PORT --no-fork",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```

## 首次專案架構建立

新 Nuxt 4 專案第一次使用此 skill 時，直接執行 bundled architecture bootstrap，不要只停在建立空 Nuxt app。此 bootstrap 會建立 section composition 所需的基礎架構：

```powershell
node <skill-dir>/scripts/bootstrap-02-section-architecture.cjs
```

它會建立或補齊：

- `app/app.vue`
- `app/pages/index.vue`
- `app/content/home/HomeHero.vue`
- `app/content/home/HomeFeature.vue`
- `app/content/home/HomeContact.vue`
- `app/components/app/AppLayout.vue`
- `app/components/app/AppHeader.vue`
- `app/components/app/AppFooter.vue`
- `app/components/ui/BaseContainer.vue`
- `app/components/ui/BaseSection.vue`
- `app/components/ui/BaseCard.vue`
- `app/components/ui/BaseButton.vue`
- `app/components/seo/SeoJsonLd.vue`
- `app/composables/`、`app/plugins/`、`app/stores/`、`app/types/`、`app/utils/`
- `server/api/`、`server/routes/`、`server/utils/`
- `shared/types/`、`shared/utils/`

此 script 是 first-use scaffold：它會建立缺少的檔案，並只替換明確可辨識的 Nuxt welcome/default files。對已有自訂內容的既有專案，不要把它當成重構工具硬跑；先讀現況，再手動套用相同架構規則。

## Nuxt 4 目錄結構

新專案採用 Nuxt 4 `app/` 結構與下列分工：

- `app/app.vue`：應用入口，通常放 `<NuxtLayout>`、`<NuxtPage>` 與 route announcer
- `app/pages/`：route pages，只做路由層組裝
- `app/layouts/`：頁面 layout
- `app/components/app/`：全站框架元件，例如 layout、header、footer
- `app/components/ui/`：跨頁共用 UI primitives，例如 button、card、container、section
- `app/components/seo/`：SEO 與 structured data 輔助元件
- `app/components/<domain>/`：跨頁共用的 domain display components
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

不要把 `server/` 放進 `app/`。明確區分 `app/content/` 與根目錄 `content/`：前者是 Vue content section components，後者是 Nuxt Content module 的資料來源。

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
  <AppLayout>
    <HomeHero />
    <HomeFeature />
    <HomeContact />
  </AppLayout>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Page title',
  description: 'Page description'
})
</script>
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
- route page 不直接塞大量 HTML 或 Tailwind markup；先抽成 content section
- UI primitive 不應知道路由、API schema、品牌文案或頁面順序

## Tailwind CSS

新 Nuxt 4 專案預設配置 Tailwind CSS v4。既有專案先檢查是否已使用 Tailwind、其他 CSS framework 或 design system：

- 已使用 `@tailwindcss/vite`：只補缺漏的 CSS 入口或 config
- 已使用 `@nuxtjs/tailwindcss` 或 Tailwind v3 config：除非使用者要求升級，否則沿用既有設定
- 已使用其他 UI/CSS framework：不要強行加入 Tailwind，先確認需求

新專案安裝 Tailwind v4：

```powershell
pnpm add -D tailwindcss @tailwindcss/vite
```

建立或更新 `app/assets/css/main.css`：

```css
@import "tailwindcss";
```

更新 `nuxt.config.ts` 時只加入缺少的部分，保留既有 `modules`、`components`、`runtimeConfig`、`vite.optimizeDeps` 與其他 plugins：

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  }
})
```

可使用 bundled script 自動補 Tailwind v4 基本設定：

```powershell
node <skill-dir>/scripts/bootstrap-01-tailwind-v4.cjs
```

Tailwind 使用規則：

- 重複排版樣式收斂到 `app/components/ui/`
- content section 可以使用 utility classes；page 檔保持組裝層
- 新 Tailwind v4 專案使用 `@import "tailwindcss";`
- 不在新專案使用 Tailwind v3 的 `@tailwind base/components/utilities`
- 只有需要舊式 JS config、外掛或特殊 content scanning 時才新增 `tailwind.config.*`

## 路由、SEO 與資料

新增頁面時先檢查現有路由慣例。如果專案已有 centralized route config、navigation config、sitemap config 或 SEO helper，必須同步更新；若沒有，不要為單一頁面硬加大型抽象。

Nuxt pages 命名慣例：

- `app/pages/index.vue` 對應 `/`
- `app/pages/about.vue` 對應 `/about`
- `app/pages/blog/[slug].vue` 對應 `/blog/:slug`
- `app/pages/docs/[...slug].vue` 對應 catch-all route

頁面 SEO 優先使用 `useSeoMeta`、`useHead` 或專案既有 SEO helper。新增 route meta 時保持 title、description、canonical、Open Graph 與 JSON-LD 的資料來源一致。

資料請求優先使用 Nuxt 原生能力與專案既有封裝，例如 `$fetch`、`useFetch`、`useAsyncData`、plugin 注入的 API client 或 store action。不要在多個頁面重複硬寫 endpoint、locale、auth header 或 error handling。

環境變數與 API base URL 優先放在 `runtimeConfig`：

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || ''
    }
  }
})
```

Client 可讀資料放在 `runtimeConfig.public`；server-only secret 不要放到 public。

## Nuxt Plugin Warnings

Nuxt plugins 應放在 `app/plugins/`，且 app 自訂 plugin 檔必須 default export `defineNuxtPlugin(...)`。只修專案自己的 plugin 檔，不要改 `node_modules`。

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
2. 不要在 `node_modules` 裡加 `export default defineNuxtPlugin(() => {})`，也不要為了消除這個 internal warning 新增空 plugin。
3. 確認 `app/app.vue` 或 layout/page tree 有使用 `<NuxtPage />`，因為此 internal plugin 只在 pages integration 啟用時出現。
4. 若 build 成功，只記錄為 Nuxt 版本 warning，繼續交付。
5. 若團隊要求乾淨輸出，先查目前 Nuxt release/issue 狀態；升級到包含 nuxt/nuxt#35676 修正的版本。若尚未釋出且必須立刻消除 warning，可依專案政策暫時 pin 到未觸發此 regression 的 Nuxt 版本，並重新安裝依賴。

只有當 warning path 指向 `app/plugins/`、專案自訂 module、或第三方 module 產生的 plugin 時，才依 Nuxt plugin 規則補 default export 或調整 module 設定。

## 模組與驗證

新增 Nuxt modules 前先檢查 `nuxt.config.*` 與 package manager。安裝後同步更新 config，並執行可用驗證。

Tailwind CSS 是新專案預設樣式層。Nuxt UI、Pinia、i18n、Nuxt Content、image、robots、sitemap 等其他 modules 只按需求加入，不要在使用者未要求或專案未使用時預設安裝。

需要啟動 dev server 時使用可用 port，優先檢查 `http://127.0.0.1:<port>`。完成後回報實際 URL 與已執行的驗證命令。

## 維護既有專案

對既有 Nuxt 專案工作時：

- 使用現有 component naming、auto-import、alias 與資料夾分層
- 保留現有 TypeScript、ESLint、Prettier、Tailwind、UI library 與測試設定
- 新增內容型頁面時採用 page 組裝 content sections 的模式
- 新增共用樣式或結構時優先抽到 `app/components/ui/`
- 避免把單一專案的路由名稱、語系、API schema、品牌內容或絕對路徑寫回此 skill
