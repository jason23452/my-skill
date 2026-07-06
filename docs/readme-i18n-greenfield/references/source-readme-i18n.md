# 來源 Skill：readme-i18n

來源：`xixu-me/skills/readme-i18n`

## 中文改寫摘要

`readme-i18n` 的核心目標是翻譯與本地化 repository README，同時不破壞 Markdown 結構與 repo mechanics。整合到本 skill 時，採用以下規則：

- 預設把 `README.md` 當作主要文件；本專案改為中文優先。
- 若需要多語，建立 sibling README，例如 `README.en.md`。
- 保留 GitHub Flavored Markdown 結構。
- 在每個 README variant 靠近頂部的位置加入或更新語言切換器。
- 只翻譯人類語言 prose。
- 保留 project names、package names、commands、CLI flags、option names、environment variables、URLs、file paths、inline code、code fences、HTML attributes、badge URLs、image URLs。
- 保持 heading hierarchy 與 section order 一致。
- 如果 translated headings 造成 GitHub heading slug 改變，要同步修正 same-file anchor links。
- 不要重複插入 language selector。
- 完成前檢查 code fence 數量、links、badge/image URLs、anchors。

## 常見錯誤

- 翻譯 fenced code blocks 或 inline code。
- 插入兩個語言切換器。
- 翻譯 heading 後忘記更新 same-file anchors。
- 修改 badge URL 或 image source。
- 讓 localized README 的章節順序偏離 source README。
