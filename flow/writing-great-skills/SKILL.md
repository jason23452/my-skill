---
name: writing-great-skills
description: 高品質 skill 撰寫與改寫參考，聚焦 predictable triggering、information hierarchy、progressive disclosure、pruning 與降低 no-op 指令。
disable-model-invocation: true
---

# Writing Great Skills

skill 的目的，是讓 stochastic system 產生可預期的流程行為。這裡的 **Predictability** 指每次都採用相同品質的工作方法，而不是每次輸出完全相同內容。

粗體術語在 [`GLOSSARY.md`](GLOSSARY.md) 有完整定義；需要細節時再讀，避免把 glossary 全部塞進主流程。

## Invocation

skill 有兩種 invocation 形態，各自花費不同成本：

- **Model-invoked**: 保留 `description`，讓 agent 可以自動觸發，也讓其他 skill 能引用。代價是每一輪都會增加 **context load**。
- **User-invoked**: 設定 `disable-model-invocation: true`，由使用者手動呼叫。優點是零 context load，代價是使用者要記得它存在，也就是 **cognitive load**。

只有當 agent 必須自己發現這個 skill，或其他 skill 需要自動連到它時，才做成 model-invoked。若只會被人手動叫用，保持 user-invoked。

當 user-invoked skills 多到使用者難以記住時，用一個 router skill 整理「何時用哪個 skill」。

## Description 寫法

model-invoked 的 `description` 同時負責兩件事：說明 skill 是什麼，以及列出哪些情境要觸發。

規則：

- 將 leading word 放在 description 前段，讓觸發語意明確。
- 一個 branch 只寫一次，不要用多個同義句重複同一件事。
- 刪掉 body 已經會說明的身份宣告，description 只保留觸發條件與必要 reach clause。
- 若相鄰 skill 容易誤觸，明確寫出何時不該使用。

## Information Hierarchy

skill 內容分三層：

1. **In-skill steps**: `SKILL.md` 中的有序動作。每一步都要有可檢查的 completion criterion。
2. **In-skill reference**: `SKILL.md` 中所有分支都常用的規則、範例或定義。
3. **External reference**: 只有部分分支需要的 reference，放到同資料夾 `.md` 檔，用清楚 pointer 引導 agent 需要時再讀。

不要把所有知識都塞進 `SKILL.md`。主檔應保留 agent 馬上要執行的流程與不可跳過的規則；細節用 progressive disclosure 放到 reference。

## Completion Criteria

每個步驟應結束在可檢查條件，而不是模糊狀態。

弱條件：

```md
- 理解需求後繼續。
- 產出合理計畫。
```

強條件：

```md
- 每個 acceptance criterion 都已映射到至少一個 task。
- 每個 task 都有 owned files、scope boundary、verification command。
```

completion criterion 越清楚，越能防止 premature completion。

## 何時拆分 skill

只在拆分能降低風險或負擔時拆分。

- **By invocation**: 有獨立 leading word，且 agent 應該自己觸發時，拆成 model-invoked skill。
- **By sequence**: 後續步驟會讓 agent 太早跳過目前步驟時，把 sequence 切開，降低 premature completion。
- **By branch**: 不同情境需要不同大型 reference 或工具時，拆出 branch 或 reference file。

不要為了「看起來 modular」而拆；每個新 skill 都會增加 context load 或 cognitive load。

## Pruning

維護 skill 時逐句檢查：

- 這句是否改變 agent 行為？如果不會，就是 no-op。
- 這個規則是否已在其他地方說過？如果是，就是 duplication。
- 這段是否仍符合目前 workflow？如果不是，就是 sediment。
- 這個細節是否每次都需要？如果不是，移到 reference。

保持 single source of truth：同一個行為規則只能有一個權威位置。

## Leading Words

leading word 是 agent 會用來思考的緊湊概念，例如 tracer bullet、seam、frontier、red-green-refactor。

好 leading word 可以同時改善 execution 與 invocation：

- 在 body 中重複使用時，穩定 agent 的行為模式。
- 在 description、prompt、docs 中一致出現時，提高觸發可靠度。

把三句重複的形容收斂成一個強 leading word，通常比加更多規則有效。

## 常見 Failure Modes

- **Premature completion**: agent 在目前步驟未真正完成前就往後走。先修 completion criterion；必要時再拆 sequence。
- **Duplication**: 同一個意思出現在多處，造成維護與語意權重問題。
- **Sediment**: 舊內容沉積，與現在 workflow 不再相關。
- **Sprawl**: skill 太長，即使每句都正確，也會降低可讀性與注意力。
- **No-op**: 指令沒有改變預設行為，只是在花 token。
- **Negation**: 用禁止句 steering，反而把不想要的行為帶入上下文。優先改成正向目標行為。

## 審查 Checklist

- `name` 是否穩定、短、lowercase-hyphenated。
- `description` 是否包含明確 trigger phrases。
- body 是否先講流程，再講規則。
- 每個步驟是否有 completion criterion。
- 大型 reference 是否已 progressive disclosure。
- 是否有 no-op、duplication、sediment。
- 是否有可測 eval prompts 或至少清楚的手動驗收方式。
