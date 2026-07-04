---
name: coss
description: 當使用者在這個 React + Vite 專案中提到 coss ui、@coss/button、Base UI、shadcn CLI、共享 UI 元件、Button、Card、Dialog、Input、Toast、Spinner、shared/components/ui、shared/utils/cn.ts，或要把 coss ui 元件整合進 shared 時，優先使用這個 skill。這個 skill 專門規範如何在本專案正確使用、安裝、搬運與整合 coss ui 元件。
license: MIT
metadata:
  author: cosscom
---

# coss ui

## OpenCode Greenfield Bootstrap Metadata

```opencode-bootstrap-json
{
  "role": "frontend",
  "order": 30,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm add @base-ui/react class-variance-authority clsx lucide-react",
    "node -e \"const fs=require('fs'),p=require('path');const w=(f,s)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,s)};w('src/shared/utils/cn.ts','import { clsx, type ClassValue } from \\\"clsx\\\";\\nexport function cn(...inputs: ClassValue[]){return clsx(inputs)}\\n');w('src/shared/components/ui/button.tsx','import type { ButtonHTMLAttributes } from \\\"react\\\";\\nimport { cn } from \\\"@/shared/utils/cn\\\";\\nexport function Button({className,...props}: ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn(\\\"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-slate-950 text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50\\\", className)} {...props} />}\\n');w('src/shared/components/ui/index.ts','export * from \\\"./button\\\";\\n');w('src/app/App.tsx','import { AppRouter } from \\\"./AppRouter\\\"; export function App(){return <div className=\\\"isolate relative min-h-screen\\\"><AppRouter /></div>}\\n');\""
  ],
  "verificationCommands": [
    "pnpm build"
  ]
}
```

這個 skill 用來處理本專案中的 `coss ui` 整合與使用方式。

這不是通用的 coss monorepo 維護指南，而是針對這個 `React + Vite + Tailwind CSS + feature-based` 專案的使用規範。

## 這個 skill 要做什麼

用這個 skill 來：

1. 挑選適合的 coss ui 元件
2. 正確整合 coss ui 到這個專案
3. 依照本專案的 shared 結構放置元件
4. 避免直接套用 coss 文件中的預設路徑而破壞現有架構
5. 依照 Base UI 與 Tailwind CSS v4 的要求補齊必要設定

## 何時使用

遇到以下情況時，直接使用這個 skill：

1. 使用者要安裝或導入 `coss ui`
2. 使用者要新增 `Button`、`Card`、`Dialog`、`Input`、`Toast`、`Spinner` 等 coss 元件
3. 使用者提到 `@coss/<component>`
4. 使用者要把 UI 元件整合到 `shared/components/ui`
5. 使用者要從 shadcn / Radix / Base UI 遷移到 coss ui
6. 使用者要處理 coss ui 的 Tailwind token、Base UI isolation、`cn()` utility
7. 使用者要修正 coss 元件的 import 路徑、組合方式或樣式設定

## 本專案的整合原則

### 1. 元件放在 `shared/components/ui`

本專案中，coss ui 元件應放在：

```text
src/shared/components/ui/
```

不要直接沿用文件中常見的：

```text
components/ui/
@/components/ui/
```

本專案已經有自己的 shared 結構，必須對齊現有架構。

### 2. 共用工具放在 `shared/utils`

若元件需要 `cn()` 等 utility，放在：

```text
src/shared/utils/
```

例如：

- `src/shared/utils/cn.ts`

### 3. 元件出口統一由 `index.ts` 管理

若新增 coss ui 元件，請同步更新：

```text
src/shared/components/ui/index.ts
```

讓專案內可以統一使用：

```ts
import { Button, Spinner } from '../../../shared/components/ui'
```

## 本專案目前的 coss ui 相關落點

預設以這些位置為主：

```text
src/
  shared/
    components/
      ui/
        button.tsx
        spinner.tsx
        index.ts
    utils/
      cn.ts

  app/
    global.css
    App.tsx
```

## Source of Truth

需要查官方行為或 API 時，優先看：

1. `https://coss.com/ui/docs`
2. `https://coss.com/ui/docs/get-started`
3. `https://coss.com/ui/docs/styling`
4. `https://coss.com/ui/docs/components/<component>`
5. `https://coss.com/ui/llms.txt`

本 skill 內若有指引與官方文件衝突，以官方文件為準；但在檔案放置位置上，仍必須優先符合本專案結構。

## 核心規則

### 1. 優先使用現有 coss 元件

如果專案已經有該元件，例如：

- `Button`
- `Spinner`

就優先重用，不要重複建立另一份。

### 2. 先對齊 coss API，再對齊專案路徑

流程應該是：

1. 查 coss 官方元件 API
2. 搬運元件 source
3. 改成本專案的 import 路徑
4. 放進 `src/shared/components/ui/`

### 3. 不要硬套文件中的 alias

coss 文件常見寫法：

```ts
import { Button } from '@/components/ui/button'
```

在這個專案中不要照抄。

應改成符合本專案結構的寫法，例如：

```ts
import { Button } from '../../../shared/components/ui'
```

或在 shared 內部：

```ts
import { cn } from '../../utils/cn'
import { Spinner } from './spinner'
```

### 4. Base UI 相關設定要保留

coss ui 建立在 Base UI 之上，因此需要保留：

1. app root 的 `isolate`
2. 外層容器的 `relative`
3. `body` 的 `position: relative`
4. 全域 theme token

如果使用者要新增 Dialog、Popover、Select、Toast 這類 portal 元件，特別注意這些設定不能被移除。

### 5. 全域 token 放在 `src/app/global.css`

coss ui 依賴 Tailwind CSS v4 與 CSS 變數。

本專案中，相關 token 應集中在：

```text
src/app/global.css
```

當你新增新元件時：

1. 先檢查是否需要新的 color token
2. 若需要，再補到 `global.css`
3. 不要把這些 token 分散到 feature 內

## 安裝與整合方式

### shadcn / coss CLI 前置規則

`@coss/style` 是 shadcn registry spec，不是本機檔案路徑。

使用 CLI 時請遵守：

1. 不可使用 Read、Glob 或 `ls` 去讀取 `coss/style` 或 `@coss/style` 當成本機路徑
2. 執行 `pnpm dlx shadcn@latest init @coss/style` 前，必須先確認 React / Vite 專案已有 Tailwind CSS entry
3. 執行 `pnpm dlx shadcn@latest init @coss/style` 前，必須先確認專案已有 import alias
4. Tailwind CSS entry 必須包含 `@import "tailwindcss";`
5. `vite.config.ts` 必須使用 `@tailwindcss/vite`
6. `tsconfig.json` 或 `tsconfig.app.json` 必須設定 `baseUrl` 與 `@/*` paths

CLI init 範例：

```bash
pnpm dlx shadcn@latest init @coss/style
```

若前置設定缺失，先補齊設定，再執行 CLI。不要把同一批套件重裝當成主要修復方式。

### 推薦做法：手動整合到 shared

對這個專案來說，推薦做法不是直接讓 CLI 用預設路徑寫檔，而是：

1. 參考 coss 文件或 registry source
2. 安裝元件需要的依賴
3. 把元件 source 放到 `src/shared/components/ui/`
4. 修正 import 路徑
5. 更新 `index.ts`

### 可用 CLI 取得元件內容，但不要盲目接受預設結構

例如可以用：

```bash
pnpm dlx shadcn@latest view @coss/button
```

或：

```bash
pnpm dlx shadcn@latest view @coss/card
```

用來查看 registry source。

但最終落點仍要整理到本專案的：

```text
src/shared/components/ui/
```

### 依賴安裝

視元件而定，常見依賴包括：

```bash
pnpm add @base-ui/react class-variance-authority clsx lucide-react
```

如果官方文件列出其他依賴，應一併安裝。

## 常見工作流程

### 新增 Button / Spinner 這類基礎元件

1. 查元件文件或 registry source
2. 安裝必要依賴
3. 新增檔案到 `src/shared/components/ui/`
4. 調整 import 路徑到 `src/shared/utils/cn.ts` 等本地工具
5. 更新 `src/shared/components/ui/index.ts`

### 新增 Card / Input / Dialog 等元件

1. 確認元件是否依賴其他 coss 元件
2. 把相依元件也一併整理進 `shared/components/ui`
3. 若需要 token 或 root isolation，檢查 `src/app/global.css` 與 `src/app/App.tsx`
4. 若元件會在多個 feature 使用，就維持放在 `shared/components/ui`

## shadcn / coss Troubleshooting

### `No Tailwind CSS configuration found`

修復方向是補齊 Tailwind v4 專案設定，而不是重新安裝同一批套件。

確認事項：

1. CSS entry 存在，例如 `src/app/global.css` 或 `src/index.css`
2. CSS entry 包含 `@import "tailwindcss";`
3. `vite.config.ts` 使用 `@tailwindcss/vite` plugin

修復後再重跑：

```bash
pnpm dlx shadcn@latest init @coss/style
```

### `Could not find valid path aliases or package imports`

修復方向是補齊 import alias 設定。

確認事項：

1. `vite.config.ts` 設定 `@` alias 指向 `./src`
2. `tsconfig.json` 或 `tsconfig.app.json` 設定 `baseUrl: "."`
3. `tsconfig.json` 或 `tsconfig.app.json` 設定 `paths: { "@/*": ["./src/*"] }`

修復後再重跑：

```bash
pnpm dlx shadcn@latest init @coss/style
```

## 不要這樣做

1. 不要把 coss 元件放到 `src/features/<feature>/components/`，除非它已經被你改寫成完全 feature 專用元件
2. 不要保留 `@/components/ui/...` 這種與本專案不符的路徑
3. 不要只複製單一檔案卻漏掉相依元件
4. 不要移除 `global.css` 裡 coss 需要的 token
5. 不要移除 `App.tsx` 的 `isolate relative` 容器
6. 不要把 `@coss/style` 或其他 `@coss/<name>` registry spec 當成本機檔案路徑讀取

## 元件使用原則

1. 優先使用 `shared/components/ui` 的 re-export
2. 如果只是畫面按鈕，不要再重寫一顆新的 Button
3. 如果元件需要客製樣式，先在使用端透過 `className` 或 props 擴充
4. 若確定是通用元件變體，再回頭整理 shared 元件本身

## 修改時的自我檢查

完成 coss ui 整合後，確認：

1. 元件檔案是否放在 `src/shared/components/ui/`
2. `index.ts` 是否有補出口
3. import 路徑是否不再使用 `@/components/ui/...`
4. `cn()` 是否來自 `src/shared/utils/cn.ts`
5. `global.css` token 是否仍完整
6. Base UI 的 isolation 設定是否仍存在

## 回覆使用者時應該說明什麼

完成後，回覆時應明確說明：

1. 新增或修改了哪些 `shared` 檔案
2. 安裝了哪些依賴
3. 哪個 coss 元件已整合進 `shared/components/ui`
4. 是否有更新 `global.css` 或 `App.tsx`
5. build / lint 結果

## 回覆範例

```md
已幫你把 coss ui 整合到 `shared`。

1. 安裝了 `@base-ui/react`、`class-variance-authority`、`clsx`、`lucide-react`
2. 新增 `src/shared/components/ui/button.tsx`
3. 新增 `src/shared/components/ui/spinner.tsx`
4. 新增 `src/shared/components/ui/index.ts`
5. 新增 `src/shared/utils/cn.ts`
6. 更新 `src/app/global.css` 與 `src/app/App.tsx` 以支援 coss/Base UI
7. `pnpm build` 通過
8. `pnpm lint` 通過
```

## 驗證

完成後預設執行：

```bash
pnpm build
```

若 `package.json` 有 `lint` script，再執行：

```bash
pnpm lint
```

如果使用者同時問專案怎麼啟動，也一併提供：

```bash
pnpm install
pnpm dev
```
