---
name: coss
description: 當使用者在 React / Vite 專案中提到 coss ui、@coss/button、Base UI、shadcn CLI、components.json、Button、Card、Dialog、Input、Toast、Spinner、shared/components/ui、src/components/ui、feature-local UI、packages/ui 或要把 coss ui 元件整合到既有 UI 架構時，優先使用這個 skill。這個 skill 專門規範如何依使用者指定、既有 aliases 與專案檔案規劃正確安裝、搬運與整合 coss ui 元件。
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
    "node -e \"const cp=require('child_process');const env={...process.env,PNPM_CONFIG_IGNORE_SCRIPTS:'true'};cp.execSync('pnpm add @base-ui/react @fontsource-variable/inter class-variance-authority clsx geist lucide-react react-day-picker tailwind-merge',{stdio:'inherit',env});cp.execSync('pnpm add -D tw-animate-css',{stdio:'inherit',env})\"",
    "node -e \"const fs=require('fs'),p=require('path');const at=String.fromCharCode(64);const slash=s=>String(s||'').replace(/\\\\/g,'/').replace(/\\/+$/,'');const exists=d=>d&&fs.existsSync(d);const read=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return null}};const aliasToPath=a=>{a=slash(a);return a.startsWith(at+'/')?'src/'+a.slice(2):a};const pathToAlias=d=>{d=slash(d);return d.startsWith('src/')?at+'/'+d.slice(4):d};const j=read('components.json')||{[String.fromCharCode(36)+'schema']:'https://ui.shadcn.com/schema.json',style:'new-york',rsc:false,tsx:true,tailwind:{css:exists('src/app/global.css')?'src/app/global.css':'src/index.css',baseColor:'neutral',cssVariables:true},iconLibrary:'lucide',aliases:{}};const a=j.aliases||{};const candidates=['src/shared/components/ui','src/components/ui','components/ui','app/components/ui','packages/ui/src/components/ui','libs/ui/src/components/ui'];let ui=aliasToPath(a.ui||'')||candidates.find(exists)||'src/components/ui';ui=slash(ui);const components=ui.endsWith('/ui')?ui.slice(0,-3):slash(p.dirname(ui));let utils=aliasToPath(a.utils||'')||aliasToPath(a.lib?slash(a.lib)+'/utils':'');utils=slash(utils||(/(^|\\/)shared(\\/|$)/.test(components)?'src/shared/utils/cn':'src/lib/utils'));const lib=slash(aliasToPath(a.lib||''))||slash(utils.replace(/\\/utils(?:\\/cn)?$/,'/lib').replace(/\\/cn$/,''));let hooks=slash(aliasToPath(a.hooks||''))||(/(^|\\/)shared(\\/|$)/.test(components)?'src/shared/hooks':'src/hooks');for(const d of [ui,components,hooks,p.dirname(utils.endsWith('.ts')?utils:utils+'.ts')])fs.mkdirSync(d,{recursive:true});const utilFile=utils.endsWith('.ts')?utils:utils+'.ts';if(!fs.existsSync(utilFile))fs.writeFileSync(utilFile,'import { clsx, type ClassValue } from \\\"clsx\\\";\\nimport { twMerge } from \\\"tailwind-merge\\\";\\n\\nexport function cn(...inputs: ClassValue[]) {\\n  return twMerge(clsx(inputs));\\n}\\n');j.aliases={...a,components:pathToAlias(components),ui:pathToAlias(ui),utils:pathToAlias(utils.replace(/\\.ts$/,'')),lib:pathToAlias(lib),hooks:pathToAlias(hooks)};fs.writeFileSync('components.json',JSON.stringify(j,null,2)+'\\n')\"",
    "node -e \"const fs=require('fs'),cp=require('child_process');const at=String.fromCharCode(64);const spec=at+'coss/style';const env={...process.env,PNPM_CONFIG_IGNORE_SCRIPTS:'true'};const cmd=fs.existsSync('components.json')?'pnpm dlx shadcn@latest add '+spec+' --yes --overwrite':'pnpm dlx shadcn@latest init '+spec+' --yes';cp.execSync(cmd,{stdio:'inherit',env})\"",
    "node -e \"const fs=require('fs'),p=require('path');const at=String.fromCharCode(64);const slash=s=>String(s||'').replace(/\\\\/g,'/').replace(/\\/+$/,'');const read=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return {aliases:{}}}};const aliasToPath=a=>{a=slash(a);return a.startsWith(at+'/')?'src/'+a.slice(2):a};const cfg=read('components.json');const a=cfg.aliases||{};const ui=slash(aliasToPath(a.ui||'src/components/ui'));const hooks=slash(aliasToPath(a.hooks||'src/hooks'));const utils=slash(aliasToPath(a.utils||'src/lib/utils')).replace(/\\.ts$/,'');const mergeDir=(s,d)=>{if(!fs.existsSync(s)||p.resolve(s)===p.resolve(d))return;fs.mkdirSync(d,{recursive:true});for(const e of fs.readdirSync(s,{withFileTypes:true})){const src=p.join(s,e.name),dst=p.join(d,e.name);if(e.isDirectory())mergeDir(src,dst);else{fs.mkdirSync(p.dirname(dst),{recursive:true});fs.copyFileSync(src,dst)}}fs.rmSync(s,{recursive:true,force:true})};const moveFile=(s,d)=>{if(!fs.existsSync(s)||p.resolve(s)===p.resolve(d))return;fs.mkdirSync(p.dirname(d),{recursive:true});fs.copyFileSync(s,d);fs.rmSync(s,{force:true})};const root=at+'/';for(const d of [root+'components/ui',root+'shared/components/ui','components/ui','src/components/ui','src/shared/components/ui'])mergeDir(aliasToPath(d),ui);for(const d of [root+'hooks',root+'shared/hooks','hooks','src/hooks','src/shared/hooks'])mergeDir(aliasToPath(d),hooks);for(const f of [root+'lib/utils.ts',root+'shared/utils/cn.ts','lib/utils.ts','src/lib/utils.ts','src/shared/utils/cn.ts'])moveFile(aliasToPath(f),utils+'.ts');const walk=(d,r=[])=>{if(!fs.existsSync(d))return r;for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())walk(f,r);else if(/\\.(ts|tsx|css|json)$/.test(e.name))r.push(f)}return r};const uiAlias=a.ui||root+'components/ui';const hooksAlias=a.hooks||root+'hooks';const utilsAlias=a.utils||root+'lib/utils';for(const f of walk('src')){let s=fs.readFileSync(f,'utf8');s=s.replaceAll(root+'components/ui/',uiAlias+'/').replaceAll(root+'shared/components/ui/',uiAlias+'/').replaceAll(root+'hooks/',hooksAlias+'/').replaceAll(root+'shared/hooks/',hooksAlias+'/').replaceAll(root+'lib/utils',utilsAlias).replaceAll(root+'shared/utils/cn',utilsAlias).replaceAll(utilsAlias+'.ts',utilsAlias);if(f.endsWith('.css'))s=s.replace(/^@import\\s+[\\\"']geist[\\\"'];\\s*$/gm,'');fs.writeFileSync(f,s)}for(const cfgFile of ['tsconfig.app.json','tsconfig.json']){if(!fs.existsSync(cfgFile))continue;const j=read(cfgFile);j.compilerOptions={...(j.compilerOptions||{}),baseUrl:(j.compilerOptions||{}).baseUrl||'.',ignoreDeprecations:'6.0',paths:{...((j.compilerOptions||{}).paths||{}),[at+'/*']:['./src/*']}};fs.writeFileSync(cfgFile,JSON.stringify(j,null,2)+'\\n')}\"",
    "node -e \"const fs=require('fs'),p=require('path');const at=String.fromCharCode(64);const read=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{return {aliases:{}}}};const aliasToPath=a=>{a=String(a||'').replace(/\\\\/g,'/');return a.startsWith(at+'/')?'src/'+a.slice(2):a};const ui=aliasToPath((read('components.json').aliases||{}).ui||'src/components/ui');if(fs.existsSync(ui)){const out=fs.readdirSync(ui).filter(n=>/\\.(ts|tsx)$/.test(n)&&n!=='index.ts').sort().map(n=>'export * from \\\"./'+n.replace(/\\.(ts|tsx)$/,'')+'\\\";').join('\\n');fs.writeFileSync(p.join(ui,'index.ts'),out+'\\n')}if(fs.existsSync('src/app/AppRouter.tsx'))fs.writeFileSync('src/App.tsx','import { AppRouter } from \\\"./app/AppRouter\\\";\\n\\nexport default function App() {\\n  return <div className=\\\"isolate relative min-h-screen\\\"><AppRouter /></div>;\\n}\\n')\""
  ],
  "verificationCommands": [
    "pnpm build"
  ]
}
```

這個 skill 用來處理 React / Vite 專案中的 `coss ui` 整合與使用方式。

這不是通用的 coss monorepo 維護指南，而是針對不同 React 檔案規劃自動判斷 UI placement 的使用規範。

## 這個 skill 要做什麼

用這個 skill 來：

1. 挑選適合的 coss ui 元件
2. 正確整合 coss ui 到這個專案
3. 依照使用者指定、既有 `components.json` 或專案現有 UI 目錄放置元件
4. 避免直接套用 coss 文件中的預設路徑而破壞現有架構
5. 依照 Base UI 與 Tailwind CSS v4 的要求補齊必要設定

## 何時使用

遇到以下情況時，直接使用這個 skill：

1. 使用者要安裝或導入 `coss ui`
2. 使用者要新增 `Button`、`Card`、`Dialog`、`Input`、`Toast`、`Spinner` 等 coss 元件
3. 使用者提到 `@coss/<component>`
4. 使用者要把 UI 元件整合到 shared、feature、package 或既有 UI 目錄
5. 使用者要從 shadcn / Radix / Base UI 遷移到 coss ui
6. 使用者要處理 coss ui 的 Tailwind token、Base UI isolation、`cn()` utility
7. 使用者要修正 coss 元件的 import 路徑、組合方式或樣式設定

## Placement Resolver

### 1. 不要固定寫死 shared

使用這個 skill 時，先決定 coss UI 的目標落點，再安裝或搬運元件。不要預設所有專案都放 `src/shared/components/ui`。

placement 優先順序：

1. 使用者明確指定的路徑，例如 `src/features/cart/components/ui`、`src/shared/components/ui`、`packages/ui/src/components/ui`
2. 既有 `components.json` 的 `aliases.ui`、`aliases.components`、`aliases.utils`、`aliases.hooks`
3. 專案已存在的 UI 目錄
4. 專案架構推斷出的最小合理落點
5. 無法判斷時，才問使用者一個聚焦問題

常見可接受落點：

```text
src/shared/components/ui/
src/components/ui/
components/ui/
app/components/ui/
src/features/<feature>/components/ui/
packages/ui/src/components/ui/
libs/ui/src/components/ui/
```

### 2. 尊重既有 `components.json`

若專案已有 `components.json`，優先沿用其中 aliases，不要任意改成 shared：

```json
{
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
```

只有在 aliases 缺失或明顯指到不存在/錯誤結構時，才依 resolver 補齊。

### 3. 共用工具跟著 UI placement

若元件需要 `cn()` 等 utility，先看 `components.json.aliases.utils`。沒有設定時，再依專案結構推斷，例如：

```text
src/lib/utils.ts
src/shared/utils/cn.ts
packages/ui/src/utils/cn.ts
```

不要因為 coss 文件範例使用 `@/lib/utils`，就強迫所有專案採用該位置。

### 4. 元件出口由所在 UI 目錄管理

若新增 coss ui 元件，請在 resolver 決定出的 UI 目錄補 `index.ts`：

```text
<resolved-ui-dir>/index.ts
```

讓專案內可以依當前 alias 或相對路徑統一引用。

## 常見 placement 範例

### Shared UI

適合跨多個 feature 重用的 primitive：

```text
src/shared/components/ui/index.ts
```

### App UI

適合一般 Vite app 或沒有 feature 分層的專案：

```text
src/components/ui/index.ts
```

### Feature UI

適合只屬於單一 feature 的組合元件或局部 primitive：

```text
src/features/cart/components/ui/index.ts
```

### Monorepo UI Package

適合 workspace 共用 UI package：

```text
packages/ui/src/components/ui/index.ts
```

## 本 skill 的預設 fallback

只有在沒有使用者指定、沒有 `components.json`、也沒有任何現有 UI 目錄時，Greenfield bootstrap 才使用：

```text
src/components/ui/
src/lib/utils.ts
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
2. 跑 placement resolver，決定 UI、utils、hooks 的目標位置
3. 搬運或安裝元件 source
4. 改成目標專案的 import 路徑
5. 放進 resolver 決定出的 UI 目錄

### 3. 不要硬套文件中的 alias

coss / shadcn 文件常見寫法：

```ts
import { Button } from '@/components/ui/button'
```

不要未檢查就照抄。先看 `components.json.aliases.ui` 或實際 UI 目錄。

可能維持為：

```ts
import { Button } from '@/components/ui/button'
```

也可能改成 shared：

```ts
import { Button } from '../../../shared/components/ui'
```

或在 feature / package 內部：

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

### 5. 全域 token 放在專案既有 CSS entry

coss ui 依賴 Tailwind CSS v4 與 CSS 變數。

相關 token 應集中在專案既有 CSS entry，例如：

```text
src/app/global.css
src/index.css
app/globals.css
```

當你新增新元件時：

1. 先檢查是否需要新的 color token
2. 若需要，再補到既有 CSS entry
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
7. Greenfield bootstrap 必須先明確安裝 coss runtime dependencies，再讓 shadcn 寫 registry files；不要依賴 shadcn 內部 dependency installer 作為唯一安裝步驟
8. Greenfield bootstrap 會先依 placement resolver 建立或修正 `components.json`，再執行 `add @coss/style --yes --overwrite`，讓 shadcn 依 resolved aliases 寫檔
9. 既有專案若已有 `components.json`，必須保留其 aliases 並使用 `add @coss/style --yes --overwrite`；不可再次無條件執行 `init`
10. 若 shadcn 產生與 resolver 不一致的實體資料夾，bootstrap 必須把 UI 檔案收斂到 resolved UI directory
11. `components.json` aliases 必須指向 resolved components/ui/utils/hooks，不可一律覆寫成 shared
12. Machine-readable `opencode-bootstrap-json` command 中不要裸露 `@coss/<name>`；用 runtime 組字串避免 OpenCode reference resolver 把 registry spec 當本機路徑讀取

CLI init 範例：

```bash
pnpm add @base-ui/react @fontsource-variable/inter class-variance-authority clsx geist lucide-react react-day-picker tailwind-merge
pnpm add -D tw-animate-css
pnpm dlx shadcn@latest init @coss/style
```

已初始化或重試 bootstrap 時：

```bash
pnpm dlx shadcn@latest add @coss/style --yes --overwrite
```

若前置設定缺失，先補齊設定，再執行 CLI。不要把同一批套件重裝當成主要修復方式。

### 推薦做法：先決定 placement，再整合

推薦做法不是直接讓 CLI 用預設路徑寫檔，而是：

1. 參考 coss 文件或 registry source
2. 用 placement resolver 決定 UI / utils / hooks 位置
3. 安裝元件需要的依賴
4. 把元件 source 放到 resolved UI directory
5. 修正 import 路徑
6. 更新 resolved UI directory 的 `index.ts`

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

但最終落點仍要整理到 resolver 決定出的 UI 目錄。

### 依賴安裝

視元件而定，常見依賴包括：

```bash
pnpm add @base-ui/react class-variance-authority clsx lucide-react
```

如果官方文件列出其他依賴，應一併安裝。

## 常見工作流程

### 新增 Button / Spinner 這類基礎元件

1. 查元件文件或 registry source
2. 決定 resolved UI directory 與 utils alias
3. 安裝必要依賴
4. 新增檔案到 resolved UI directory
5. 調整 import 路徑到 resolved utils
6. 更新 resolved UI directory 的 `index.ts`

### 新增 Card / Input / Dialog 等元件

1. 確認元件是否依賴其他 coss 元件
2. 把相依元件也一併整理進相同 resolved UI directory
3. 若需要 token 或 root isolation，檢查 `src/app/global.css` 與 `src/app/App.tsx`
4. 若元件會在多個 feature 使用，優先放共用 UI 目錄；若只屬於單一 feature，可放 feature-local UI 目錄

## shadcn / coss Troubleshooting

### `No Tailwind CSS configuration found`

修復方向是補齊 Tailwind v4 專案設定，而不是重新安裝同一批套件。

確認事項：

1. CSS entry 存在，例如 `src/app/global.css` 或 `src/index.css`
2. CSS entry 包含 `@import "tailwindcss";`
3. `vite.config.ts` 使用 `@tailwindcss/vite` plugin

修復後再依 `components.json` 狀態重跑；已存在時用 `add`，缺失時才用 `init`：

```bash
pnpm dlx shadcn@latest add @coss/style --yes --overwrite
pnpm dlx shadcn@latest init @coss/style
```

### `Could not find valid path aliases or package imports`

修復方向是補齊 import alias 設定。

確認事項：

1. `vite.config.ts` 設定 `@` alias 指向 `./src`
2. `tsconfig.json` 或 `tsconfig.app.json` 設定 `baseUrl: "."`
3. `tsconfig.json` 或 `tsconfig.app.json` 設定 `paths: { "@/*": ["./src/*"] }`

修復後再依 `components.json` 狀態重跑；已存在時用 `add`，缺失時才用 `init`：

```bash
pnpm dlx shadcn@latest add @coss/style --yes --overwrite
pnpm dlx shadcn@latest init @coss/style
```

## 不要這樣做

1. 不要在沒有檢查使用者指定、`components.json` 或既有 UI 目錄前，直接把 coss 元件固定放到 shared
2. 不要任意覆寫既有 `@/components/ui/...`、`@/lib/utils` 或 monorepo package aliases
3. 不要只複製單一檔案卻漏掉相依元件
4. 不要移除 CSS entry 裡 coss 需要的 token
5. 不要移除 `App.tsx` 的 `isolate relative` 容器
6. 不要把 `@coss/style` 或其他 `@coss/<name>` registry spec 當成本機檔案路徑讀取
7. 不要在 `opencode-bootstrap-json` command 裡裸露 `@coss/<name>`；用 runtime 組字串

## 元件使用原則

1. 優先使用 resolved UI directory 的 re-export
2. 如果只是畫面按鈕，不要再重寫一顆新的 Button
3. 如果元件需要客製樣式，先在使用端透過 `className` 或 props 擴充
4. 若確定是通用元件變體，再回頭整理共用 UI 目錄；若只屬於單一 feature，維持 feature-local

## 修改時的自我檢查

完成 coss ui 整合後，確認：

1. 元件檔案是否放在 resolved UI directory
2. resolved UI directory 的 `index.ts` 是否有補出口
3. import 路徑是否符合 `components.json` aliases 或專案現有慣例
4. `cn()` 是否來自 resolved utils alias/file
5. `global.css` token 是否仍完整
6. Base UI 的 isolation 設定是否仍存在

## 回覆使用者時應該說明什麼

完成後，回覆時應明確說明：

1. resolver 選到的 UI / utils / hooks 落點
2. 安裝了哪些依賴
3. 哪個 coss 元件已整合進哪個 UI 目錄
4. 是否有更新 `components.json`、CSS entry 或 `App.tsx`
5. build / lint 結果

## 回覆範例

```md
已幫你把 coss ui 整合到專案既有 UI 目錄。

1. 安裝了 `@base-ui/react`、`class-variance-authority`、`clsx`、`lucide-react`
2. Resolver 選到 `src/components/ui` 與 `src/lib/utils.ts`
3. 新增 `src/components/ui/button.tsx`
4. 新增 `src/components/ui/spinner.tsx`
5. 新增 `src/components/ui/index.ts`
6. 更新 `components.json`、CSS entry 與 `App.tsx` 以支援 coss/Base UI
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
