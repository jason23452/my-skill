---
name: opencode-bootstrap-json
description: 建立或檢查 opencode-bootstrap-json metadata。當使用者要求 scaffold commands、verification commands、runtime smoke checks、health URLs、project roles、setup order、framework/add-on/bootstrap metadata 或修正 skill bootstrap 邊界時使用。
---

# OpenCode Bootstrap JSON

使用這個 skill 產生精簡、可執行、邊界清楚的 `opencode-bootstrap-json` fenced block。這個規範 skill 的 body 使用說明與範例，其他 executable project skill 才放可執行 bootstrap block。

## 邊界規則

- Framework skill 的 metadata 聚焦 scaffold framework 與該 framework 的基本結構。
- UI kit skill 的 metadata 只安裝與設定自己的 UI kit，以及它的直接依賴。
- API client skill 的 metadata 只建立 transport client、generic methods、token hook 與 error normalization。
- Testing、database、Docker、Compose、README、planning、review、pattern index 等能力各自由自己的 add-on skill metadata 表達。
- Testing add-on 使用 `category:"testing"` 與跨框架 `frameworks`，並在使用者選用或要求 testing 時執行。
- `role:"any"` 適合真正跨 repo 的流程與 docs-only README rule skill，例如 `readme-i18n-greenfield` 搭配 `category:"readme-docs"`。
- Add-on skill 要用明確 `category`、`frameworks`、`requiresPrimarySkills` 或 `requiresUiKitSkills` 表達依賴。
- Docs-only metadata 可以使用空的 `scaffoldCommand` 與 `verificationCommands`，讓 Greenfield `assignedSkills` 能載入純文件規則。
- 可執行 bootstrap skill 保持可執行的 `scaffoldCommand`，並用 bundled script launcher 承載多步驟邏輯。
- Framework scaffold skill owns expensive project-wide verification such as `pnpm build`, `npm run build`, `yarn build`, `bun run build`, `uv run python -m compileall`, or equivalent framework compile checks.
- Add-on skill verification should check the add-on's own integration state only. UI kit verification checks dependency/config/CSS/icon wiring; testing verification checks test discovery/config; Docker/Compose verification checks file/config presence.

## 欄位

- `role`: `frontend`、`backend` 或 `any`。只有真正跨 repo 的能力使用 `any`。
- `category`: 可選，用來區分 `framework`、`ui-kit`、`api-client`、`testing`、`readme-docs`、`docker`、`compose`、`devops` 等 skill 類型。
- `framework` / `frameworks`: framework scaffold 或 add-on 適用範圍。
- `uiKit`: UI kit add-on 名稱。
- `requiresPrimarySkills`: add-on 依賴的 framework skill。
- `requiresUiKitSkills`: pattern/index skill 依賴的 UI kit skill。
- `order`: 執行順序。framework scaffold 通常最早，add-on 後面。
- `packageManager`: `pnpm`、`npm`、`yarn`、`bun`、`uv`、`docker` 等；會自行偵測 lockfile 的 Node script launcher 用 `node`。
- `scaffoldCommand`: 初始化或補檔 command array。
- `verificationCommands`: 驗證 command array。Framework skill 放 project-wide build/compile；add-on skill 放 integration/config check。
- `runtimeSmokeCommand`: 啟動 runtime smoke test 的 command。沒有 runtime component 時省略或留空。
- `runtimeSmokeHealthUrl`: runtime smoke check URL。沒有 health URL 時省略或留空。

## Script Launcher

多步驟檔案產生邏輯放在 bundled script，metadata 只保留短 launcher：

```json
"if test -f .opencode/skills/<skill-name>/scripts/bootstrap-<name>.cjs; then node .opencode/skills/<skill-name>/scripts/bootstrap-<name>.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/<skill-name>/scripts/bootstrap-<name>.cjs; fi"
```

使用 `.cjs`，讓 script 在目標專案的 `type: module` 設定下仍維持穩定。script 本身要能重複執行，保留既有使用者檔案，並清楚回報真正錯誤。

## 範例

以下範例使用 `jsonc` fence，讓本規範 skill 保持文件用途。實際寫入其他 project skill 時使用 `opencode-bootstrap-json` fence。

**Framework scaffold:**

```jsonc
{
  "role": "frontend",
  "category": "framework",
  "framework": "react-vite",
  "order": 0,
  "packageManager": "pnpm",
  "scaffoldCommand": [
    "pnpm create vite . --template react-ts --no-interactive",
    "if test -f .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; then node .opencode/skills/react-vite-feature-based/scripts/bootstrap-01-02.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/react-vite-feature-based/scripts/bootstrap-01-02.cjs; fi"
  ],
  "verificationCommands": ["pnpm build"],
  "runtimeSmokeCommand": "pnpm dev --host 127.0.0.1 --port $PORT --strictPort",
  "runtimeSmokeHealthUrl": "http://127.0.0.1:$PORT/"
}
```

**UI kit add-on:**

```jsonc
{
  "role": "frontend",
  "category": "ui-kit",
  "uiKit": "nuxt-ui",
  "frameworks": ["nuxt", "nuxt4"],
  "requiresPrimarySkills": ["nuxt4-creater"],
  "order": 30,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/nuxt-ui/scripts/bootstrap-00-install.cjs; then node .opencode/skills/nuxt-ui/scripts/bootstrap-00-install.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/bootstrap-00-install.cjs; fi",
    "if test -f .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; then node .opencode/skills/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/nuxt-ui-bootstrap.cjs; fi"
  ],
  "verificationCommands": [
    "if test -f .opencode/skills/nuxt-ui/scripts/verify-build.cjs; then node .opencode/skills/nuxt-ui/scripts/verify-build.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/nuxt-ui/scripts/verify-build.cjs; fi"
  ]
}
```

**API client add-on:**

```jsonc
{
  "role": "frontend",
  "category": "api-client",
  "frameworks": ["react-vite", "vue-vite", "nuxt", "nuxt4"],
  "order": 20,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/api-client/scripts/bootstrap-api.cjs; then node .opencode/skills/api-client/scripts/bootstrap-api.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/api-client/scripts/bootstrap-api.cjs; fi"
  ],
  "verificationCommands": []
}
```

**Testing add-on:**

```jsonc
{
  "role": "frontend",
  "category": "testing",
  "testing": "playwright",
  "frameworks": ["frontend", "web", "static", "vite", "react-vite", "vue-vite", "nuxt", "nuxt4", "next", "sveltekit", "astro", "angular"],
  "order": 40,
  "packageManager": "node",
  "scaffoldCommand": [
    "if test -f .opencode/skills/playwright-e2e-testing/scripts/bootstrap-01-01.cjs; then node .opencode/skills/playwright-e2e-testing/scripts/bootstrap-01-01.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/playwright-e2e-testing/scripts/bootstrap-01-01.cjs; fi"
  ],
  "verificationCommands": [
    "if test -f .opencode/skills/playwright-e2e-testing/scripts/verify-list.cjs; then node .opencode/skills/playwright-e2e-testing/scripts/verify-list.cjs; else node ${OPENCODE_PROJECT_SKILLS_PRESEEDED_DIR:-/app/.opencode/skills}/playwright-e2e-testing/scripts/verify-list.cjs; fi"
  ]
}
```

**README docs-only rule:**

```jsonc
{
  "role": "any",
  "category": "readme-docs",
  "order": 90,
  "packageManager": "none",
  "scaffoldCommand": [],
  "verificationCommands": []
}
```

## 檢查清單

- 這個 metadata 是否只做該 skill 的業務？
- Framework scaffold 是否只包含 framework 與基本結構？
- add-on 是否有清楚的 `category` 與 dependency fields？
- `scaffoldCommand` 是否只包含穩定短指令或 bundled script launcher？
- runtime smoke command 是否有對應 health URL，且 target app 真的會啟動在 `$PORT`？
- verification commands 是否是專案已具備或 scaffold 後確定存在的指令？
