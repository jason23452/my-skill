# README 保留檢查表

| 元素 | 是否翻譯 | 必須原樣保留 | 檢查重點 |
| --- | --- | --- | --- |
| Headings | 翻譯可見文字 | heading level 與順序 | 階層一致；anchors 已更新 |
| Paragraphs / lists | 翻譯 | Markdown 結構 | list 仍能正確 render |
| Inline code | 不翻譯 | backticks 與 literal content | commands、flags、paths、env vars 不變 |
| Fenced code blocks | 不翻譯 | fence markers、language tags、code | 數量一致，內容一致 |
| Badge markdown | 通常不翻譯 | image URL、target URL、query params | URL mechanics 不變 |
| Images | alt text 可視情況翻譯 | image source URL 與 relative path | image links 仍可解析 |
| Tables | prose cells 可翻譯 | 欄位數、separator row、alignment | table shape 與 source 一致 |
| Raw HTML | 只翻 visible text | tags、attributes、wrappers、IDs、classes | HTML 仍可 render |
| GitHub alerts | 只翻 body text | `[!NOTE]`、`[!WARNING]` 等 marker | alert syntax 有效 |
| Relative file links | 通常不翻譯 | destination path | links 指向預期檔案 |
| Same-file anchors | link text 可翻譯 | link intent | 每個 `(#...)` target 存在 |
| HTML comments / markers | 不翻譯 | marker text | selector markers 單一且完整 |

## 快速檢查

- 比對 code fences 數量。
- 搜尋 `](#` 並確認 target 存在。
- 搜尋 `README.` 並確認 selector links 指向 sibling variants。
- 搜尋 `http` 並確認 URLs 沒有被改壞。
- 搜尋 backticks，抽查 literal tokens 沒有被翻譯。
