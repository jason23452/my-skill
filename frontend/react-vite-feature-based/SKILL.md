---
name: react-vite-feature-based
description: React + Vite feature-based frontend scaffold and maintenance skill. Use when creating or updating React/Vite projects with src/app, src/features, src/shared, routing, pages, components, hooks, types, assets, and feature-oriented refactors.
---

# React Vite Feature-Based

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "category": "framework",
  "framework": "react-vite",
  "order": 10,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create vite . --template react-ts --no-interactive",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-01-02.cjs; fi",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-03.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-03.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-01-03.cjs; fi",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-00-pnpm-allow-builds.cjs; fi",
    "pnpm install --frozen-lockfile=false"
  ],
  "verificationCommands": [
    "pnpm build"
  ],
  "runtimeSmokeCommand": "pnpm dev --host 127.0.0.1 --port $PORT --strictPort",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```

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
      assets/

  shared/
    components/
    hooks/
    types/
    assets/

  main.tsx
```

## 工作方式

開始修改前先做這些事：

1. 先閱讀 `src/app/`、相關的 `src/features/<feature-name>/` 與 `src/shared/`
2. 確認需求屬於哪一個 feature
3. 用最小正確修改完成工作，不要先做過度抽象

## Greenfield Bootstrap 規則

建立新的 React / Vite 專案時，完成 Vite React scaffold、import alias、TypeScript paths 與 feature-based folder layout。

必要設定：

1. 建立或保留 CSS entry，例如 `src/app/global.css` 或 `src/index.css`
2. `vite.config.ts` 必須設定 `@` alias 指向 `./src`
3. `tsconfig.json` 或 `tsconfig.app.json` 必須設定 `baseUrl: "."` 與 `paths: { "@/*": ["./src/*"] }`

CSS entry 範例：

```css
:root {
  color: #0f172a;
  background: #f8fafc;
}
```

`vite.config.ts` 範例：

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
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

若專案使用 feature-based 結構，建議入口使用 `src/app/global.css`。若既有專案已使用 `src/index.css`，沿用既有 CSS entry。

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

### `features/<feature-name>/assets/`

放該 feature 專用圖片與靜態資源。

### `shared/`

只有跨 feature 共用的內容才放進這裡。

## 樣式規則

Framework scaffold 只提供最小 CSS entry 與 starter class。新增 styling library、UI kit、design system 或 class merge utility 時，使用對應 skill 或專案既有模式管理。

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
