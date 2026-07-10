# 語言切換器參考

每個 README variant 靠近頂部只能有一個 selector block。

## 放置位置

- 放在 title 與 badge / hero cluster 後面。
- 所有 variant 的位置保持一致。

## 中文主檔 canonical block

```md
<!-- README-I18N:START -->

**中文** | [English](./README.en.md)

<!-- README-I18N:END -->
```

## 英文 sibling canonical block

```md
<!-- README-I18N:START -->

[中文](./README.md) | **English**

<!-- README-I18N:END -->
```

## 更新規則

- 如果已有 `README-I18N` markers，只替換該 block。
- 如果頂部已有明顯但未標記的 selector，就地正規化。
- 同一個 README 不可留下多個 selector blocks。

## 檔名模式

中文優先預設：

```text
README.md
README.en.md
```

如果 repo 已經使用其他多語命名模式，例如 `README.md` + `README.zh.md`，保留既有模式。
