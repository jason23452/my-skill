---
name: react-vite-feature-based
description: 當使用者要修改這個專案的 React + Vite 前端，尤其提到 feature-based、src/features、router、頁面、components、hooks、types、api、assets、shared、Tailwind CSS、UI 調整、資料夾重構或新增前端功能時，優先使用這個 skill。這個 skill 專門對齊本專案的 feature-based 結構與開發規範。
---

# React Vite Feature-Based

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 10,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create vite . --template react-ts --no-interactive",
    "node -e \"const fs=require('fs'),p=require('path');const w=(f,s)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,s)};const stripJsonc=(s)=>s.replace(/\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*$/gm,'');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));pkg.scripts={...(pkg.scripts||{}),dev:'vite --host 0.0.0.0',build:'tsc -b && vite build',preview:'vite preview --host 0.0.0.0'};pkg.devDependencies={...(pkg.devDependencies||{}),'@tailwindcss/vite':'latest',tailwindcss:'latest'};fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));w('vite.config.ts','import { defineConfig } from \\\"vite\\\";\\nimport react from \\\"@vitejs/plugin-react\\\";\\nimport tailwindcss from \\\"@tailwindcss/vite\\\";\\nimport { fileURLToPath, URL } from \\\"node:url\\\";\\n\\nexport default defineConfig({\\n  plugins: [react(), tailwindcss()],\\n  resolve: { alias: { \\\"@\\\": fileURLToPath(new URL(\\\"./src\\\", import.meta.url)) } },\\n});\\n');const tsconfigApp=JSON.parse(stripJsonc(fs.readFileSync('tsconfig.app.json','utf8')));tsconfigApp.compilerOptions={...(tsconfigApp.compilerOptions||{}),ignoreDeprecations:'6.0',paths:{...(tsconfigApp.compilerOptions?.paths||{}),'@/*':['./src/*']}};fs.writeFileSync('tsconfig.app.json',JSON.stringify(tsconfigApp,null,2));w('src/index.css','@import \\\"tailwindcss\\\";\\n');w('src/features/home/router/HomePage.tsx','export function HomePage() {\\n  return <main className=\\\"min-h-screen p-8\\\"><h1 className=\\\"text-3xl font-bold\\\">Greenfield App</h1></main>;\\n}\\n');w('src/app/AppRouter.tsx','import { HomePage } from \\\"@/features/home/router/HomePage\\\";\\n\\nexport function AppRouter() {\\n  return <HomePage />;\\n}\\n');w('src/App.tsx','import { AppRouter } from \\\"./app/AppRouter\\\";\\n\\nexport default function App() {\\n  return <AppRouter />;\\n}\\n');for(const d of ['src/features/home/components','src/features/home/hooks','src/features/home/types','src/features/home/api','src/features/home/assets','src/shared/components','src/shared/hooks','src/shared/types','src/shared/api','src/shared/assets']){fs.mkdirSync(d,{recursive:true});w(p.join(d,'.gitkeep'),'')}\" && pnpm install --no-frozen-lockfile"
    ,"node -e \"const fs=require('fs');const cfg='tsconfig.app.json';if(fs.existsSync(cfg)){const j=JSON.parse(fs.readFileSync(cfg,'utf8'));j.compilerOptions={...(j.compilerOptions||{}),ignoreDeprecations:'6.0',baseUrl:(j.compilerOptions||{}).baseUrl||'.',paths:{...((j.compilerOptions||{}).paths||{}),'@/*':['./src/*']}};fs.writeFileSync(cfg,JSON.stringify(j,null,2))}\""
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 127.0.0.1 --port $PORT",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 30,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "node -e \"const fs=require('fs'),p=require('path');const w=(f,s)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,s)};w('vite.config.ts','import { defineConfig } from \\\"vite\\\";\\nimport react from \\\"@vitejs/plugin-react\\\";\\nimport tailwindcss from \\\"@tailwindcss/vite\\\";\\nimport { fileURLToPath, URL } from \\\"node:url\\\";\\n\\nexport default defineConfig({\\n  plugins: [react(), tailwindcss()],\\n  resolve: { alias: { \\\"@\\\": fileURLToPath(new URL(\\\"./src\\\", import.meta.url)) } },\\n  server: {\\n    proxy: {\\n      \\\"/api\\\": {\\n        target: process.env.VITE_BACKEND_ORIGIN || \\\"http://localhost:8000\\\",\\n        changeOrigin: true,\\n      },\\n    },\\n  },\\n});\\n');w('src/features/home/router/HomePage.tsx','import { useEffect, useState } from \\\"react\\\";\\n\\ntype HealthState = { status: \\\"checking\\\" | \\\"ok\\\" | \\\"error\\\"; message: string }\\n\\nexport function HomePage() {\\n  const [health, setHealth] = useState<HealthState>({ status: \\\"checking\\\", message: \\\"Checking backend /api/health...\\\" })\\n\\n  useEffect(() => {\\n    let alive = true\\n    fetch(\\\"/api/health\\\")\\n      .then(async (response) => {\\n        if (!response.ok) throw new Error(\\\"HTTP \\\" + response.status)\\n        return response.json() as Promise<{ status?: string; service?: string }>\\n      })\\n      .then((data) => {\\n        if (alive) setHealth({ status: \\\"ok\\\", message: (data.service ?? \\\"backend\\\") + \\\": \\\" + (data.status ?? \\\"ok\\\") })\\n      })\\n      .catch((error) => {\\n        if (alive) setHealth({ status: \\\"error\\\", message: error instanceof Error ? error.message : \\\"Backend health check failed\\\" })\\n      })\\n    return () => { alive = false }\\n  }, [])\\n\\n  return (\\n    <main className=\\\"min-h-screen bg-slate-950 px-6 py-10 text-slate-100\\\">\\n      <section className=\\\"mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30\\\">\\n        <p className=\\\"text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300\\\">Greenfield App</p>\\n        <h1 className=\\\"text-4xl font-bold tracking-tight\\\">Frontend and backend are wired first.</h1>\\n        <div className=\\\"rounded-2xl border border-slate-700 bg-slate-950 p-5\\\">\\n          <p className=\\\"text-sm text-slate-400\\\">Backend health</p>\\n          <p className={health.status === \\\"ok\\\" ? \\\"mt-2 text-lg font-semibold text-emerald-300\\\" : health.status === \\\"error\\\" ? \\\"mt-2 text-lg font-semibold text-rose-300\\\" : \\\"mt-2 text-lg font-semibold text-amber-300\\\"}>{health.message}</p>\\n        </div>\\n      </section>\\n    </main>\\n  )\\n}\\n');\""
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 127.0.0.1 --port $PORT",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```

Greenfield 前端預設必須先完成最小 API 串接：`vite.config.ts` 要有 `/api` proxy，首頁要呼叫 `/api/health` 並顯示 backend 連線狀態。不要等功能實作後才補串接。

以這個專案目前的架構與規範進行前端開發。這不是通用 React 風格指南，而是針對本專案的實作規範。

## 專案結構

預設結構如下：

```text
src/
  app/
    App.tsx
    AppRouter.tsx
    global.css

  features/
    <feature-name>/
      router/
      components/
      hooks/
      types/
      api/
      assets/

  shared/
    components/
    hooks/
    types/
    api/
    assets/

  main.tsx
```

## 工作方式

開始修改前先做這些事：

1. 先閱讀 `src/app/`、相關的 `src/features/<feature-name>/` 與 `src/shared/`
2. 確認需求屬於哪一個 feature
3. 用最小正確修改完成工作，不要先做過度抽象

## Greenfield Bootstrap 規則

建立新的 React / Vite / Tailwind 專案時，必須先完成 Tailwind v4 與 import alias 前置設定，再執行任何 shadcn / coss CLI。

必要設定：

1. 建立或保留 CSS entry，例如 `src/app/global.css` 或 `src/index.css`
2. CSS entry 必須包含 Tailwind v4 匯入
3. `vite.config.ts` 必須使用 `@tailwindcss/vite` plugin
4. `vite.config.ts` 必須設定 `@` alias 指向 `./src`
5. `tsconfig.json` 或 `tsconfig.app.json` 必須設定 `baseUrl: "."` 與 `paths: { "@/*": ["./src/*"] }`

CSS entry 範例：

```css
@import "tailwindcss";
```

`vite.config.ts` 範例：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

`tsconfig` 範例：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

若專案使用 feature-based 結構，建議入口使用 `src/app/global.css`。若既有專案已使用 `src/index.css`，不要強制搬移，只需確保該 CSS entry 有 `@import "tailwindcss";`。

### coss ui 官方 CLI 規則

依照 `https://coss.com/ui/docs/get-started`，不要手動安裝 `@base-ui/react`、`@fontsource-variable/inter`、`class-variance-authority`、`clsx`、`geist`、`lucide-react`、`react-day-picker`、`tailwind-merge` 這一串套件作為主要 bootstrap 流程。coss 官方說明是透過 shadcn CLI 安裝 registry spec，CLI 會建立檔案並安裝需要的依賴。

官方新專案完整 preset 是：

```bash
pnpm dlx shadcn@latest init @coss/style
```

但 `@coss/style` 會安裝所有 UI components、neutral color system、sidebar variables、base styles，以及 Inter / Geist Mono fonts，並偏向會配置 `layout.tsx` 的完整 setup。Vite Greenfield bootstrap 若只是需要 coss UI primitives 與共用資料夾落點，不要預設跑完整 preset；交給 `coss` skill 的 metadata 使用 faster path。

既有專案加入所有 UI primitives 時，使用：

```bash
pnpm dlx shadcn@latest add @coss/ui
```

既有專案需要完整 theme、colors、sidebar variables 與 fonts 時，使用：

```bash
pnpm dlx shadcn@latest add @coss/style
```

只需要 UI primitives 與 neutral colors 時，使用：

```bash
pnpm dlx shadcn@latest add @coss/ui @coss/colors-neutral
```

Vite Greenfield 預設使用 `@coss/ui @coss/colors-neutral`，只有使用者明確要求完整 theme、fonts、sidebar variables，或 coss metadata 設定 `COSS_BOOTSTRAP_MODE=full-style` 時，才使用 `@coss/style`。

`@coss/style`、`@coss/ui`、`@coss/colors-neutral` 是 shadcn registry spec，不是本機檔案路徑；不要用 Read、Glob、`ls` 或任何檔案工具去讀 `coss/style`、`coss/ui`、`@coss/style` 這類路徑。

## 分層規則

### `app/`

只放應用程式層級內容：

- `App.tsx`
- `AppRouter.tsx`
- `global.css`

不要把 feature 專屬頁面或區塊元件放進 `app/`。

### `features/<feature-name>/router/`

放該 feature 的頁面入口與路由相關元件。

例：

- `HomePage.tsx`
- `ProfilePage.tsx`

### `features/<feature-name>/components/`

放該 feature 專用元件。

如果元件只被該 feature 使用，就留在這裡，不要提早搬到 `shared/components/`。

### `features/<feature-name>/hooks/`

放該 feature 專用 hooks。

### `features/<feature-name>/types/`

放該 feature 的資料型別。

### `features/<feature-name>/api/`

放該 feature 的 API 組裝層。

這裡的責任是：

1. 組裝 request function
2. 處理 query、params、body 等請求參數
3. 整理 response mapper 或資料轉換
4. 提供 service 或呼叫入口給 feature 使用
5. 放 DTO 或 API 相關型別

不要把畫面 state、事件處理或 JSX 邏輯放進這裡。

### `features/<feature-name>/assets/`

放該 feature 專用圖片與靜態資源。

### `shared/`

只有跨 feature 共用的內容才放進這裡。

## 樣式規則

本專案使用 Tailwind CSS 為主要樣式方式。

請遵守以下規則：

1. 優先直接在 JSX 使用 Tailwind class
2. 不要為一般元件新增獨立 `.css` 檔
3. `src/app/global.css` 只保留 Tailwind 匯入、全域變數與必要基礎樣式
4. 若 class 需要動態合併或覆蓋，使用 `tailwind-merge`

範例：

```ts
import { twMerge } from 'tailwind-merge'

const className = twMerge(
  'rounded-md px-4 py-2 text-sm',
  active && 'bg-violet-500 text-white',
  disabled && 'pointer-events-none opacity-50'
)
```

## 資產規則

找圖片時先看最近的 feature：

1. 單一 feature 使用的圖片，放進該 feature 的 `assets/`
2. 多個 feature 共用的圖片，才放進 `shared/assets/`

## 命名規則

1. feature 資料夾使用小寫或 kebab-case
2. 元件使用 `PascalCase.tsx`
3. hook 使用 `useXxx.ts`
4. 頁面使用 `XxxPage.tsx`

## 何時提升到 shared

只有在下列情況才放進 `shared/`：

1. 該元件、hook、type、api 或 asset 已被多個 feature 使用
2. 已有明確複用需求
3. 提升後可以降低重複，而不是只是提早抽象

## 修改準則

進行前端修改時：

1. 優先維持目前專案結構
2. 優先最小改動
3. 若需求只影響單一 feature，就不要擴散到其他目錄
4. 若搬動檔案，務必同步更新 import
5. 若新增頁面，從 `router/` 開始組裝，再從 `components/` 拆區塊

## 驗證

完成後預設執行：

```bash
pnpm build
```

若 `package.json` 有 `lint` script，再執行：

```bash
pnpm lint
```

如果失敗，先修正再回報。

## 專案啟動方式

當使用者詢問如何啟動這個專案時，直接提供以下資訊：

1. 在專案根目錄 `frontend-vite-react/` 執行 `pnpm install`
2. 執行 `pnpm dev`
3. 在瀏覽器開啟 `http://localhost:5173`

若使用者還需要其他常用指令，一併提供：

- `pnpm build`
- `pnpm lint`
- `pnpm preview`

## 回覆方式

對使用者回覆時：

1. 使用中文
2. 直接說明變更內容與檔案路徑
3. 若有驗證，明確回報 `pnpm build` 與 `pnpm lint` 結果

## 典型任務範例

### 範例 1：新增功能頁

若使用者要新增 `profile` 頁面：

1. 建立 `src/features/profile/router/ProfilePage.tsx`
2. 在 `src/features/profile/components/` 建立該頁面需要的元件
3. 在 `src/app/AppRouter.tsx` 掛上對應路由

### 範例 2：新增專用圖片

若圖片只給 `home` 使用：

1. 放到 `src/features/home/assets/`
2. 從該 feature 元件直接引用

### 範例 3：共用按鈕

若按鈕會在多個 feature 使用：

1. 建立於 `src/shared/components/`
2. 讓 feature 再引用它
