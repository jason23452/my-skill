# 產出檔案

## `.extract-design-system/raw.json`

原始萃取輸出。保留它以便 debug 與未來 schema upgrade。

## `.extract-design-system/normalized.json`

CLI 用來產生後續檔案的穩定內部表示。

## `design-system/tokens.json`

normalized output 的專案本地副本，方便檢查與重用。

## `design-system/tokens.css`

starter CSS variables 檔案；若有萃取到資料，會包含 colors、fonts、spacing、radius 與 shadows。
