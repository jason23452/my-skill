# JSON Schemas

本文件定義 `skill-creator` 使用的 JSON 結構。欄位名稱是機器可讀 contract，不要翻譯；欄位說明與範例文字可使用中文。

## `evals/evals.json`

位置：skill 目錄內的 `evals/evals.json`。

用途：定義要用來測試 skill 的 prompts、預期結果與可驗證 expectations。

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "使用者真實任務 prompt",
      "expected_output": "成功結果的人類可讀描述",
      "files": ["evals/files/sample1.pdf"],
      "expectations": [
        "The output includes X",
        "The skill used script Y"
      ]
    }
  ]
}
```

欄位：

- `skill_name`: 必須與 skill frontmatter 的 `name` 一致。
- `evals[].id`: 唯一整數 ID。
- `evals[].prompt`: 要執行的任務。
- `evals[].expected_output`: 成功標準摘要。
- `evals[].files`: 可選，input file paths，相對於 skill root。
- `evals[].expectations`: 可驗證 assertions。

## `eval_metadata.json`

位置：每個 eval run 目錄中。

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": [
    "The output includes X"
  ]
}
```

欄位：

- `eval_id`: 對應 `evals.json` 的 ID。
- `eval_name`: 可讀名稱，用於資料夾與 viewer。
- `prompt`: 實際執行 prompt。
- `assertions`: 本 run 要評估的 assertions。

## `history.json`

位置：workspace root。

用途：在 improve mode 中追蹤版本演進。

```json
{
  "started_at": "2026-01-15T10:30:00Z",
  "skill_name": "pdf",
  "current_best": "v2",
  "iterations": [
    {
      "version": "v0",
      "parent": null,
      "expectation_pass_rate": 0.65,
      "grading_result": "baseline",
      "is_current_best": false
    },
    {
      "version": "v1",
      "parent": "v0",
      "expectation_pass_rate": 0.75,
      "grading_result": "won",
      "is_current_best": false
    },
    {
      "version": "v2",
      "parent": "v1",
      "expectation_pass_rate": 0.85,
      "grading_result": "won",
      "is_current_best": true
    }
  ]
}
```

`grading_result` 合法值：`baseline`、`won`、`lost`、`tie`。

## `grading.json`

位置：`<run-dir>/grading.json`。

用途：grader agent 的輸出。`expectations` 陣列中的欄位名稱必須是 `text`、`passed`、`evidence`。

```json
{
  "expectations": [
    {
      "text": "The output includes the name 'John Smith'",
      "passed": true,
      "evidence": "Found in transcript Step 3: 'Extracted names: John Smith, Sarah Johnson'"
    },
    {
      "text": "The spreadsheet has a SUM formula in cell B10",
      "passed": false,
      "evidence": "No spreadsheet was created. The output was a text file."
    }
  ],
  "summary": {
    "passed": 1,
    "failed": 1,
    "total": 2,
    "pass_rate": 0.5
  },
  "execution_metrics": {
    "tool_calls": {
      "Read": 5,
      "Write": 2,
      "Bash": 8
    },
    "total_tool_calls": 15,
    "total_steps": 6,
    "errors_encountered": 0,
    "output_chars": 12450,
    "transcript_chars": 3200
  },
  "timing": {
    "executor_duration_seconds": 165.0,
    "grader_duration_seconds": 26.0,
    "total_duration_seconds": 191.0
  },
  "claims": [
    {
      "claim": "The form has 12 fillable fields",
      "type": "factual",
      "verified": true,
      "evidence": "Counted 12 fields in field_info.json"
    }
  ],
  "user_notes_summary": {
    "uncertainties": ["Used 2023 data, may be stale"],
    "needs_review": [],
    "workarounds": ["Fell back to text overlay for non-fillable fields"]
  },
  "eval_feedback": {
    "suggestions": [
      {
        "assertion": "The output includes the name 'John Smith'",
        "reason": "A hallucinated document that mentions the name would also pass."
      }
    ],
    "overall": "Assertions check presence but not correctness."
  }
}
```

欄位：

- `expectations[]`: 每條 expectation 的評分與 evidence。
- `summary`: pass/fail aggregate。
- `execution_metrics`: executor metrics，可從 `metrics.json` 複製。
- `timing`: wall clock timing，可從 `timing.json` 複製。
- `claims`: 從 output 中萃取並驗證的 factual/process/quality claims。
- `user_notes_summary`: executor 標記的不確定性或 workaround。
- `eval_feedback`: 可選，grader 發現 eval 本身需要改善時提供。

## `metrics.json`

位置：`<run-dir>/outputs/metrics.json`。

用途：executor run 的工具與輸出量統計。

```json
{
  "tool_calls": {
    "Read": 5,
    "Write": 2,
    "Bash": 8,
    "Edit": 1,
    "Glob": 2,
    "Grep": 0
  },
  "total_tool_calls": 18,
  "total_steps": 6,
  "files_created": ["filled_form.pdf", "field_values.json"],
  "errors_encountered": 0,
  "output_chars": 12450,
  "transcript_chars": 3200
}
```

## `timing.json`

位置：`<run-dir>/timing.json`。

用途：記錄 run 的時間與 token。subagent task 完成通知中的 `total_tokens` 與 `duration_ms` 不會自動永久保存，收到後立刻寫入。

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3,
  "executor_start": "2026-01-15T10:30:00Z",
  "executor_end": "2026-01-15T10:32:45Z",
  "executor_duration_seconds": 165.0,
  "grader_start": "2026-01-15T10:32:46Z",
  "grader_end": "2026-01-15T10:33:12Z",
  "grader_duration_seconds": 26.0
}
```

## `benchmark.json`

位置：`<workspace>/iteration-N/benchmark.json` 或 `benchmarks/<timestamp>/benchmark.json`。

用途：彙整多個 runs 的 pass rate、time、tokens、tool calls 與 comparison summary。

```json
{
  "metadata": {
    "skill_name": "pdf",
    "skill_path": "/path/to/pdf",
    "executor_model": "model-id",
    "analyzer_model": "model-id",
    "timestamp": "2026-01-15T10:30:00Z",
    "evals_run": [1, 2, 3],
    "runs_per_configuration": 3
  },
  "runs": [
    {
      "eval_id": 1,
      "eval_name": "Ocean",
      "configuration": "with_skill",
      "run_number": 1,
      "result": {
        "pass_rate": 0.85,
        "passed": 6,
        "failed": 1,
        "total": 7,
        "time_seconds": 42.5,
        "tokens": 3800,
        "tool_calls": 18,
        "errors": 0
      },
      "expectations": [
        {"text": "...", "passed": true, "evidence": "..."}
      ],
      "notes": [
        "Used 2023 data, may be stale"
      ]
    }
  ],
  "run_summary": {
    "with_skill": {
      "mean_pass_rate": 0.85,
      "stddev_pass_rate": 0.05,
      "mean_time_seconds": 42.5,
      "mean_tokens": 3800
    },
    "without_skill": {
      "mean_pass_rate": 0.55,
      "stddev_pass_rate": 0.15,
      "mean_time_seconds": 30.0,
      "mean_tokens": 2500
    }
  },
  "analysis_notes": [
    "Skill improves pass rate by 30 points but increases token usage."
  ]
}
```

## `comparison.json`

位置：blind comparison output path。

```json
{
  "winner": "A",
  "reasoning": "Output A is more complete and better formatted.",
  "rubric": {
    "A": {
      "content_score": 4.7,
      "structure_score": 4.3,
      "overall_score": 9.0
    },
    "B": {
      "content_score": 2.7,
      "structure_score": 2.7,
      "overall_score": 5.4
    }
  },
  "output_quality": {
    "A": {
      "score": 9,
      "strengths": ["Complete solution"],
      "weaknesses": ["Minor style issue"]
    },
    "B": {
      "score": 5,
      "strengths": ["Readable output"],
      "weaknesses": ["Missing required field"]
    }
  }
}
```

`winner` 合法值：`A`、`B`、`TIE`。

## Trigger Eval Set

位置：description optimization workspace。

```json
[
  {
    "query": "使用者真實 prompt",
    "should_trigger": true
  },
  {
    "query": "相鄰但不該觸發的 prompt",
    "should_trigger": false
  }
]
```

規則：

- should-trigger 與 should-not-trigger 都要有 8 到 10 筆左右。
- negative cases 要包含 near misses，不要只放明顯無關內容。
- queries 要像真實使用者會輸入的句子，包含檔名、背景、限制、typos 或口語化表達。
