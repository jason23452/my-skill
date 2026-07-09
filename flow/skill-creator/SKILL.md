---
name: skill-creator
description: 建立、修改、測試與優化 agent skills。當使用者想從零建立 skill、改進既有 skill、撰寫 evals、benchmark skill 表現、比較有無 skill 的輸出、或優化 skill description 觸發率時使用。
---

# Skill Creator 中文版

本 skill 用於建立與迭代改善 agent skills。目標不是只寫一份漂亮的 `SKILL.md`，而是讓 skill 在真實 prompt 下穩定觸發、穩定引導 agent 做對事，並能用 evals 或人工 review 驗證品質。

## 核心循環

高層流程如下：

1. 捕捉 intent：確認 skill 要讓 agent 做什麼、何時觸發、輸出格式與成功標準。
2. 寫 draft：建立或修改 `SKILL.md`，必要時加入 `references/`、`scripts/`、`assets/`、`evals/`。
3. 建立 evals：寫 2 到 5 個真實、具代表性的測試 prompts。
4. 跑測試：比較 with-skill 與 baseline，或比較 old-skill 與 new-skill。
5. 評分與 review：產出 `grading.json`、`benchmark.json`，必要時開 eval viewer。
6. 根據 feedback 改 skill。
7. 重複直到使用者滿意，或 benchmark 顯示已達標。
8. 最後可優化 `description`，提高正確觸發率並降低誤觸。

## 和使用者溝通

先看使用者熟悉程度再決定用詞。若使用者不熟悉 eval、benchmark、assertion、JSON，簡短解釋。

預設做法：

- 說明你正在把 workflow 轉成可重複使用的 skill。
- 主動提出需要的輸入與缺口。
- 在建立 evals 前先讓使用者確認測試情境。
- 不要把主觀審美硬轉成假客觀分數；主觀輸出可以用人工 review。

## 建立 Skill

### 1. Capture Intent

先從目前對話萃取資訊，不要重問已經明確的內容。必要時補問：

1. 這個 skill 要讓 agent 做什麼？
2. 什麼使用者語句、檔案、情境應該觸發它？
3. 預期輸出格式是什麼？
4. 有哪些 edge cases、禁止事項或安全邊界？
5. 是否需要 scripts 做 deterministic work？
6. 是否需要 references 放大型知識或模板？
7. 是否需要 evals 驗證效果？

### 2. Interview And Research

釐清 input/output、範例檔、成功標準、相依工具。若需要查 docs 或找相似 skills，先做 research，再帶著選項回來減少使用者負擔。

### 3. Write `SKILL.md`

基本結構：

```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
  evals/
```

frontmatter 必要欄位：

```yaml
---
name: skill-name
description: 這個 skill 做什麼，以及何時一定要使用。description 是主要觸發機制，要包含具體 trigger phrases。
---
```

寫作規則：

- `name` 使用 lowercase-hyphenated，保持短且穩定。
- `description` 同時說明用途與觸發情境；要具體，不要只寫摘要。
- body 先放 agent 需要執行的流程，再放規則、模板、例外。
- 每個步驟要有 completion criterion。
- 接近 500 行時，將大型內容移到 `references/`。
- deterministic 或重複性工作放到 `scripts/`，不要讓 agent 每次重新發明。
- 安全邊界要清楚；不要建立會誤導、竊取資料、繞過授權或執行惡意行為的 skill。

## Evals

### 建立 `evals/evals.json`

草擬 2 到 5 個真實 prompts，請使用者確認。

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": [],
      "expectations": [
        "The output includes X",
        "The skill used script Y"
      ]
    }
  ]
}
```

完整 JSON schema 見 `references/schemas.md`。

### Assertion 原則

好的 expectation 應該：

- 可客觀驗證。
- 難以被錯誤輸出僥倖滿足。
- 檢查真正結果，而不是只檢查檔名存在。
- 對使用者在意的品質有辨識力。

主觀 skill 可以少用 assertions，改用人工 review。

## 執行與評估測試

本節是一個連續流程，不要只做一半。不要使用 `/skill-test` 或其他未確認 testing skill。

### 1. 建立 workspace

在 skill 目錄旁建立：

```text
<skill-name>-workspace/
  iteration-1/
    eval-<id-or-name>/
      with_skill/
      without_skill/
```

如果是在改進既有 skill，先 snapshot 舊版：

```text
<skill-name>-workspace/skill-snapshot/
```

baseline 規則：

- 新 skill：baseline 是 without_skill。
- 改既有 skill：baseline 是 old_skill snapshot，或使用者指定的版本。

### 2. 同一輪派發 with-skill 與 baseline

每個 eval 同時啟動兩個 runs，避免先跑完一邊後 context 或判斷偏移。

with-skill prompt 應包含：

```text
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files or none>
- Save outputs to: <workspace>/iteration-<N>/eval-<ID>/with_skill/outputs/
- Outputs to save: <what the user cares about>
```

baseline prompt 應使用相同 task，但不提供 skill，或提供 old skill snapshot。

### 3. 建立 eval metadata

每個 run 旁建立 `eval_metadata.json`：

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": []
}
```

### 4. 捕捉 timing

subagent 完成通知中的 `total_tokens` 與 `duration_ms` 只有當下可取得。收到後立刻存到 run directory 的 `timing.json`。

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

### 5. Grading

所有 runs 完成後，使用 `agents/grader.md` 的規則評分，為每個 run 產生 `grading.json`。

`grading.json` 中 `expectations` 必須使用以下欄位名稱：

- `text`
- `passed`
- `evidence`

不要改成 `name`、`met`、`details`，eval viewer 依賴這些欄位。

### 6. Benchmark

執行 aggregation script：

```bash
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
```

它會產出 `benchmark.json` 與 `benchmark.md`，包含 pass rate、時間、token、平均值、標準差與差異。

若手動產生 benchmark，依 `references/schemas.md` schema。

### 7. Analyzer Pass

使用 `agents/analyzer.md` 檢查 benchmark patterns，例如：

- 某個 assertion with-skill 與 without-skill 都 100% pass，可能沒有辨識力。
- 某個 eval variance 很高，可能 flaky。
- with-skill 明顯提升 pass rate，但 token/time 成本過高。
- skill 讓某些原本可過的情境變差。

### 8. Eval Viewer

有 benchmark 與 outputs 後，使用 viewer 讓使用者看結果：

```bash
python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json
```

無 GUI 或 headless 環境使用：

```bash
python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  --static <output_path>
```

iteration 2 之後加上：

```text
--previous-workspace <workspace>/iteration-<N-1>
```

## 改進 Skill

使用 feedback 與 benchmark 改 skill 時遵守：

- 從 feedback 中 generalize，不要只為單一 eval overfit。
- 讀 transcript，不只看 final output；找出 skill 讓 agent 做了哪些多餘工作。
- 移除不拉動行為的 no-op 句子。
- 如果每個 run 都重新寫同樣 helper，將 helper 放入 `scripts/`。
- 用為什麼解釋行為，而不是只堆疊 ALWAYS / NEVER。
- 優先修高影響、可泛化的問題。

改完後建立 `iteration-<N+1>/`，重新跑 evals，產生 reviewer，等待使用者回饋。

停止條件：

- 使用者說滿意。
- feedback 幾乎為空。
- benchmark 已達目標且沒有重大 regression。
- 已無法取得有意義進展。

## Blind Comparison

若使用者問「新版真的比較好嗎」，可做 blind comparison。

流程：

1. 使用 `agents/comparator.md`，把兩份輸出標成 A/B，不告訴評分者哪個 skill 產生。
2. comparator 只依任務完成度與輸出品質選 winner。
3. 使用 `agents/analyzer.md` unblind，分析 winner 為何較好，以及 loser skill 如何改善。

這是進階流程；大多數情況 human review + benchmark 已足夠。

## Description Optimization

`description` 是 skill 觸發的主要機制。建立或大改 skill 後，主動詢問是否要優化觸發率。

### 1. 建立 trigger eval set

建立 20 個 queries，混合 should-trigger 與 should-not-trigger：

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

query 要真實、具體、包含邊界案例。不要只寫「Format this data」這種太抽象的句子。

### 2. 讓使用者 review eval set

使用 `assets/eval_review.html`：

1. 讀取 template。
2. 替換 `__EVAL_DATA_PLACEHOLDER__`、`__SKILL_NAME_PLACEHOLDER__`、`__SKILL_DESCRIPTION_PLACEHOLDER__`。
3. 寫到 temp HTML。
4. 開啟或交給使用者 review。
5. 取回 `eval_set.json`。

### 3. 跑 optimization loop

```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-powering-this-session> \
  --max-iterations 5 \
  --verbose
```

完成後用 `best_description` 更新 `SKILL.md` frontmatter，並向使用者報告 before/after 與分數。

## Packaging

如果需要打包 skill：

```bash
python -m scripts.package_skill <path/to/skill-folder>
```

更新既有 skill 時：

- 保留原本 `name` 與 folder name。
- 若安裝位置唯讀，先複製到可寫 temp 目錄再改。
- package 前確認 `SKILL.md`、references、scripts、assets 都在正確目錄。

## Reference Files

需要時讀取：

- `agents/grader.md`: 如何根據 transcript 與 outputs 評分 assertions。
- `agents/comparator.md`: 如何做 blind A/B comparison。
- `agents/analyzer.md`: 如何分析 winner/loser 或 benchmark patterns。
- `references/schemas.md`: `evals.json`、`grading.json`、`benchmark.json` 等 JSON schema。

## 最後提醒

請使用 TodoList 管理工作，至少包含：capture intent、draft skill、create evals、run tests、grade/benchmark、generate viewer、revise skill、optimize description。若在 headless 環境，仍應用 `--static` 產生 viewer HTML 讓使用者 review。
