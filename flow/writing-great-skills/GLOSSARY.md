# Glossary: Building Great Skills

本 glossary 定義高品質 skill 的核心概念。skill 的根本目標是 **Predictability**：讓 agent 每次採用穩定、可預期的工作流程，而不是要求每次產生完全一樣的輸出。

## Predictability

agent 在不同 prompt 下採用一致品質流程的程度。它不是 output determinism；brainstorming skill 可以每次輸出不同想法，但仍可預期地展開、分歧、收斂。

## Invocation

skill 被觸發或使用的方式。

### Model-invoked

保留 `description`，讓 agent 能自動看見並觸發。優點是可被 agent 或其他 skill 發現；缺點是每輪都消耗 context load。

### User-invoked

設定 `disable-model-invocation: true`，只能由使用者手動呼叫。優點是零 context load；缺點是使用者要記得它存在。

### Description

skill 的機器可讀觸發條件。對 model-invoked skill 來說，description 是最重要的 trigger surface；它不應只寫摘要，而要寫何時使用。

### Context Pointer

上下文中指向外部內容的線索。`description` 指向 skill；`SKILL.md` 中的 reference link 指向其他文件。pointer 的文字決定 agent 何時會去讀目標。

### Context Load

model-invoked skill 的常駐成本。每個 description 都會佔用 token 與注意力。

### Cognitive Load

user-invoked skill 對使用者的記憶成本。使用者必須知道有哪些 skill，以及何時呼叫。

### Router Skill

一個幫使用者記住其他 user-invoked skills 的 skill。它列出每個 skill 的使用時機，但不能自動觸發沒有 description 的 skill。

### Granularity

skill 拆分的細度。拆太細會增加 context load 或 cognitive load；拆太粗會讓流程過長、分支混雜或 premature completion。

## Information Hierarchy

skill 內容依 agent 需要的即時程度排序。

### Steps

agent 要依序執行的動作。每個 step 都需要 completion criterion。

### Reference

agent 需要查閱的規則、範例、定義、schema 或模板。reference 可以放在 `SKILL.md`，也可以透過 progressive disclosure 放到外部檔案。

### External Reference

skill 系統外或 skill folder 內的支援文件，不直接觸發，只在被 pointer 指到時讀取。

### Progressive Disclosure

把不是每個分支都需要的內容移出 `SKILL.md`，放在 reference 檔案，讓主流程保持清楚。

### Co-location

把同一概念的定義、規則、例外放在一起，避免 agent 讀到一半卻漏掉重要 caveat。

### Sprawl

skill 太長的 failure mode。即使每句都正確，過長也會降低 agent 注意力與維護性。解法是拆 reference、拆 branch 或拆 sequence。

## Steering

影響 agent runtime 行為的槓桿。

### Branch

skill 支援的一種不同路徑或情境。不同 branch 可能需要不同 inputs、references、scripts 或 output format。

### Leading Word

一個強而短的概念詞，能召喚模型既有知識並穩定行為，例如 tracer bullet、seam、frontier、red-green-refactor。

### Completion Criterion

判斷一步是否完成的條件。好的 criterion 可檢查、可窮盡，能防止 premature completion。

### Legwork

agent 在單一步驟內自行完成的探索、讀檔、驗證、分析工作。強 completion criterion 會迫使 legwork 變厚。

### Post-Completion Steps

目前步驟之後的步驟。若太早出現在上下文中，可能讓 agent 急著結束目前步驟。

### Premature Completion

agent 在真正完成前宣告完成。常見原因是 completion criterion 太模糊，或後續步驟吸引注意力。

### Negation

用禁止句 steering 的 failure mode。`不要寫冗長註解` 會把「冗長註解」帶入上下文。優先寫正向目標，例如「註解限制為一行，說明非顯而易見的理由」。

## Pruning

保持 skill 精簡、有效、可維護。

### Single Source Of Truth

同一個行為規則只存在一個權威位置。

### Duplication

同一個意思出現在多處。它會浪費 token、增加維護成本，並誤導 agent 以為該概念比實際更重要。

### Relevance

一行內容是否仍與 skill 任務相關。過時、泛泛而談或不影響行為的內容都應移除或下放。

### Sediment

舊內容因為不敢刪而沉積，逐漸讓 skill 變長且失準。

### No-op

不會改變 agent 行為的指令。檢查方式是問：沒有這句時，agent 是否本來就會這樣做？如果會，這句通常是 no-op。
