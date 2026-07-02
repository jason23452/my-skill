# Skill Update Prompt: coss/shadcn Tailwind Prerequisites

請修改 `react-vite-feature-based` 與 `coss` skills，讓 Greenfield React/Vite 專案在執行 coss/shadcn CLI 前具備必要前置設定，並避免把 registry spec 誤判成本機路徑。

## 修改 `react-vite-feature-based` skill

請在 skill 中新增或更新 Greenfield bootstrap 規則：

- React/Vite/Tailwind Greenfield 專案必須在執行任何 shadcn/coss init 前完成 Tailwind v4 與 import alias 前置設定。
- 必須建立或保留 CSS entry，例如 `src/app/global.css` 或 `src/index.css`，且其中包含 `@import "tailwindcss";`。
- `vite.config.ts` 必須使用 `@tailwindcss/vite` plugin。
- `vite.config.ts` 必須設定 `@` alias 指向 `./src`。
- `tsconfig.json` 或 `tsconfig.app.json` 必須設定 `baseUrl: "."` 與 `paths: { "@/*": ["./src/*"] }`。
- 若專案使用 feature-based 結構，建議入口使用 `src/app/global.css`，但若既有專案已使用 `src/index.css`，不要強制搬移；只需確保該 CSS entry 有 Tailwind import。
- 驗證時至少執行 `pnpm build`，若有 lint script 再執行 `pnpm lint`。

建議加入範例：

```css
@import "tailwindcss";
```

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

## 修改 `coss` skill

請在 skill 中新增或更新 shadcn/coss CLI 規則：

- `@coss/style` 是 shadcn registry spec，不是本機檔案路徑。
- 不可使用 Read/Glob/ls 去讀取 `coss/style` 或 `@coss/style` 當成本機路徑。
- 執行 `pnpm dlx shadcn@latest init @coss/style` 前，必須先確認 React/Vite 專案已有 Tailwind CSS entry 與 import alias。
- 若 shadcn 回報 `No Tailwind CSS configuration found`，修復方向是補 CSS entry、`@tailwindcss/vite` plugin，而不是重新安裝同一批套件。
- 若 shadcn 回報 `Could not find valid path aliases or package imports`，修復方向是補 `tsconfig` paths 或 package imports。
- 修復後再重跑 `pnpm dlx shadcn@latest init @coss/style`。

建議加入 troubleshooting：

```text
No Tailwind CSS configuration found
```

處理方式：確認 CSS entry 存在且包含 `@import "tailwindcss";`，並確認 `vite.config.ts` 使用 `@tailwindcss/vite`。

```text
Could not find valid path aliases or package imports
```

處理方式：確認 `tsconfig.json` 或 `tsconfig.app.json` 設定 `baseUrl` 與 `@/*` paths。
