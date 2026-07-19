---
name: nuxt4-creater
description: Nuxt 4 專案建立、啟動與架構導覽。當需要建立 Nuxt 4 新專案、啟動本機開發環境、驗證建置、理解 app/pages、app/content、components、constants、plugins、stores 等目錄分工，或在此專案新增頁面與維護路由 SEO 時使用。
---

# Nuxt4-creater 專案導覽

## 基本原則

操作既有 `fuyu_website` 時，在專案根目錄 `C:\Users\Bojii\Desktop\fuyu_website` 執行命令。建立新專案時，在預期的父目錄或空的目標 repo 根目錄執行 scaffold command。

只使用 `pnpm` 與既有的 `pnpm-lock.yaml`。不要使用 npm、yarn 或 bun 產生其他 lockfile。

修改程式後至少執行 `pnpm build` 驗證。此專案目前沒有 `lint`、`test` 或 `typecheck` script。

## 啟動與驗證

建立新的 Nuxt 4 專案時，互動式終端可依 Nuxt 官方安裝文件使用：

```powershell
pnpm create nuxt@latest <project-name>
```

如果 bootstrap 已經在空的目標 repo 根目錄執行，必須使用 metadata 裡的非互動 command 直接初始化目前目錄。create-nuxt 在 non-interactive terminal 需要明確指定 `--template`、`--packageManager`、`--gitInit`，而既有空 repo 目錄也需要 `--force`。

進入專案目錄後再執行後續指令：

```powershell
Set-Location -LiteralPath <project-name>
```

安裝依賴：

```powershell
pnpm install
```

啟動本機開發環境：

```powershell
pnpm dev
```

生產建置驗證：

```powershell
pnpm build
```

靜態輸出：

```powershell
pnpm generate
```

預覽建置結果：

```powershell
pnpm preview
```

Bootstrap metadata：

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 0,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create nuxt@latest . --template v4 --packageManager pnpm --gitInit false --no-install --force",
    "if test -f .opencode/skills/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; then node .opencode/skills/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt4-creater/scripts/bootstrap-00-pnpm-allow-builds.cjs; fi",
    "pnpm install"
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 0.0.0.0 --port 3000",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:3000"
}
```

API base URL 由 `runtimeConfig.public.apiBase` 讀取，環境變數名稱是 `NUXT_PUBLIC_API_BASE`。

## 專案架構

入口檔是 `app/app.vue`，只負責渲染 `<NuxtPage />` 與路由公告。

路由頁面放在 `app/pages/`，由 Nuxt 自動生成：

- `index.vue`：首頁
- `about.vue`：關於頁
- `contact.vue`：聯絡頁
- `404.vue`：可直接訪問的 404 頁

頁面專屬內容元件放在 `app/content/<page>/`，不要直接當成路由使用。例如首頁內容放在 `app/content/home/`，關於頁內容放在 `app/content/about/`。

全站與共用元件依用途分層：

- `app/components/app/`：全站框架，例如 `AppLayout`、`AppHeader`、`AppFooter`
- `app/components/ui/`：可重用基礎 UI，例如 `BaseButton`、`BaseCard`、`BaseContainer`、`BaseSection`
- `app/components/seo/`：SEO 輔助元件，例如 `SeoJsonLd`

固定參數與型別分開管理：

- `app/constants/`：路由、語系、query key 等固定設定
- `app/types/`：共用 TypeScript 型別
- `app/stores/`：Pinia store
- `app/plugins/`：Nuxt plugin
- `app/assets/css/main.css`：Tailwind CSS v4 入口，使用 `@import "tailwindcss";`

`nuxt.config.ts` 已將 `~/components` 與 `~/content` 設成 component auto-import，且 `pathPrefix: false`。直接使用 `HomeHero`、`AboutHero`、`BaseButton` 這類元件名稱，不需要在名稱前加目錄前綴。

## 路由與 SEO

新增頁面時，同步更新 `app/constants/routes.ts` 的 `ROUTES` 與 `appRoutes`。

Header 導覽由 `navRoutes` 產生，不要在 Header 內硬寫路徑。

頁面 SEO 沿用既有模式：

```ts
const route = getRouteConfig('home')

useSeoMeta({
  title: route.title,
  description: route.description
})
```

`/404` 是一般可訪問頁面，route config 名稱是 `notFound` 且 `nav: false`。

真正的 Nuxt error handling 在 `app/error.vue`。處理 404 時保留 Nuxt error status，不要 redirect 到首頁；返回首頁時使用 `clearError({ redirect: ROUTES.home })`。

## i18n 與 API 約定

預設語系是 `zh-tw`，支援語系是 `zh-tw` 與 `en`，設定集中在 `app/constants/i18n.ts`。

呼叫 API 時使用 Nuxt plugin 提供的 `$api`。語系 query 由專案既有機制處理；需要單次覆蓋語系時，使用 request config 的 `locale`。
